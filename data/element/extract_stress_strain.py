#!/usr/bin/env python3

from __future__ import annotations

import argparse
import math
import re
from pathlib import Path
from typing import Iterable


AXIS_TO_LENGTH = {"x": "lx", "y": "ly", "z": "lz"}
AXIS_TO_STRESS = {"x": "sxx", "y": "syy", "z": "szz"}
FILENAME_PATTERN = re.compile(
    r"sxx_(?P<x>[^_]+)_syy_(?P<y>[^_]+)_szz_(?P<z>[^_]+)"
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Convert raw stress_info .dat files into cleaned stress-strain curves."
    )
    parser.add_argument(
        "paths",
        nargs="*",
        default=["."],
        help="Files or directories to process. Directories are searched recursively.",
    )
    parser.add_argument(
        "--fit-points",
        type=int,
        default=5,
        help="Number of initial frames used to fit l(stress) and estimate l0 at stress=0.",
    )
    parser.add_argument(
        "--suffix",
        default=None,
        help="Optional suffix for writing a separate output file. Default overwrites the source file.",
    )
    parser.add_argument(
        "--axis",
        choices=("auto", "x", "y", "z"),
        default="auto",
        help="Loading axis. Default is inferred from the filename.",
    )
    return parser.parse_args()


def iter_input_files(paths: Iterable[str], suffix: str) -> list[Path]:
    files: list[Path] = []
    for raw_path in paths:
        path = Path(raw_path)
        if path.is_file():
            if path.suffix == ".dat" and not path.name.endswith("_stress_strain.dat"):
                files.append(path)
            continue
        if path.is_dir():
            files.extend(
                candidate
                for candidate in path.rglob("*.dat")
                if not candidate.name.endswith("_stress_strain.dat")
            )
    return sorted(set(files))


def load_table(path: Path) -> tuple[list[str], list[dict[str, float]]]:
    header: list[str] | None = None
    rows: list[dict[str, float]] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            stripped = line.strip()
            if not stripped:
                continue
            if stripped.startswith("#"):
                if header is None:
                    header = stripped.lstrip("#").split()
                continue
            if header is None:
                raise ValueError(f"{path}: missing header line")
            values = stripped.split()
            if len(values) != len(header):
                raise ValueError(
                    f"{path}: expected {len(header)} columns, got {len(values)}"
                )
            row = {name: float(value) for name, value in zip(header, values)}
            rows.append(row)
    if header is None or not rows:
        raise ValueError(f"{path}: no data found")
    return header, rows


def infer_axis(path: Path, rows: list[dict[str, float]]) -> str:
    match = FILENAME_PATTERN.search(path.name)
    if match:
        magnitudes = {
            axis: abs(float(match.group(axis)))
            for axis in ("x", "y", "z")
        }
        best_axis = max(magnitudes, key=magnitudes.get)
        if magnitudes[best_axis] > 0.0:
            return best_axis

    stress_ranges = {}
    for axis, stress_col in AXIS_TO_STRESS.items():
        values = [row[stress_col] for row in rows]
        stress_ranges[axis] = max(values) - min(values)
    return max(stress_ranges, key=stress_ranges.get)


def linear_fit_intercept(x_values: list[float], y_values: list[float]) -> float:
    n_points = len(x_values)
    if n_points < 2:
        raise ValueError("need at least two points for linear fitting")

    mean_x = sum(x_values) / n_points
    mean_y = sum(y_values) / n_points
    sxx = sum((x - mean_x) ** 2 for x in x_values)
    if math.isclose(sxx, 0.0, abs_tol=1e-30):
        raise ValueError("stress values are identical in the fitting window")
    sxy = sum((x - mean_x) * (y - mean_y) for x, y in zip(x_values, y_values))
    slope = sxy / sxx
    intercept = mean_y - slope * mean_x
    return intercept


def build_curve(
    rows: list[dict[str, float]],
    axis: str,
    fit_points: int,
) -> tuple[float, list[tuple[float, float]]]:
    stress_col = AXIS_TO_STRESS[axis]
    length_col = AXIS_TO_LENGTH[axis]
    fit_window = rows[:fit_points]
    if len(fit_window) < 2:
        raise ValueError("not enough rows for fitting")

    fit_stress = [row[stress_col] for row in fit_window]
    fit_length = [row[length_col] for row in fit_window]
    l0 = linear_fit_intercept(fit_stress, fit_length)
    if math.isclose(l0, 0.0, abs_tol=1e-30):
        raise ValueError("fitted l0 is zero")

    curve: list[tuple[float, float]] = [(0.0, 0.0)]
    last_kept_strain = 0.0
    for row in rows:
        strain = (row[length_col] - l0) / l0
        stress = row[stress_col]
        if strain < last_kept_strain:
            continue
        curve.append((strain, stress))
        last_kept_strain = strain
    return l0, curve


def output_path_for(path: Path, suffix: str | None) -> Path:
    if suffix is None:
        return path
    return path.with_name(f"{path.stem}{suffix}")


def write_curve(
    source: Path,
    destination: Path,
    axis: str,
    fit_points: int,
    l0: float,
    curve: list[tuple[float, float]],
) -> None:
    temp_path = destination.with_name(f"{destination.name}.tmp")
    with temp_path.open("w", encoding="utf-8") as handle:
        handle.write(f"# source {source}\n")
        handle.write(f"# axis {axis}\n")
        handle.write(f"# fit_points {fit_points}\n")
        handle.write(f"# l0 {l0:.16g}\n")
        handle.write("# strain stress\n")
        for strain, stress in curve:
            handle.write(f"{strain:.10e} {stress:.10e}\n")
    temp_path.replace(destination)


def main() -> int:
    args = parse_args()
    files = iter_input_files(args.paths, args.suffix)
    if not files:
        print("No input .dat files found.")
        return 1

    failed = False
    for path in files:
        try:
            _, rows = load_table(path)
            axis = args.axis if args.axis != "auto" else infer_axis(path, rows)
            l0, curve = build_curve(rows, axis, args.fit_points)
            destination = output_path_for(path, args.suffix)
            write_curve(path, destination, axis, args.fit_points, l0, curve)
            print(
                f"{path} -> {destination} | axis={axis} | l0={l0:.8f} | points={len(curve)}"
            )
        except Exception as exc:  # noqa: BLE001
            failed = True
            print(f"FAILED {path}: {exc}")
    return 1 if failed else 0


if __name__ == "__main__":
    raise SystemExit(main())
