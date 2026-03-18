#!/usr/bin/env python3

from __future__ import annotations

import argparse
import os
from pathlib import Path

os.environ.setdefault("MPLCONFIGDIR", "/tmp/matplotlib")

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt


def parse_simple_rdf(lines: list[str], source: Path) -> tuple[list[str], list[list[float]]]:
    header = None
    data: list[list[float]] = []

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue
        if stripped.startswith("#"):
            if header is None:
                header = stripped.lstrip("#").split()
            continue

        fields = stripped.split()
        try:
            row = [float(value) for value in fields]
        except ValueError as exc:
            raise ValueError(f"Unsupported numeric line in {source}: {line.rstrip()}") from exc
        data.append(row)

    if not data:
        raise ValueError(f"No averaged RDF data found in {source}")

    if header is None or len(header) != len(data[0]):
        header = ["r(A)"] + [f"value_{idx}" for idx in range(1, len(data[0]))]

    return header, data


def parse_lammps_rdf(lines: list[str], source: Path) -> tuple[list[str], list[list[float]]]:
    header = None
    block_count = 0
    expected_rows = None
    current_row = 0
    sums: list[list[float]] = []
    radius: list[float] = []
    field_count = None

    for raw_line in lines:
        stripped = raw_line.strip()
        if not stripped:
            continue
        if stripped.startswith("#"):
            fields = stripped.lstrip("#").split()
            if fields[:1] == ["Row"]:
                raw_names = fields[1:]
                if len(raw_names) >= 2:
                    header = ["r(A)"] + raw_names[1:]
                else:
                    header = ["r(A)"] + [f"value_{idx}" for idx in range(1, max(2, len(raw_names)))]
            continue

        fields = stripped.split()
        if len(fields) == 2:
            block_count += 1
            current_rows = int(float(fields[1]))
            if expected_rows is None:
                expected_rows = current_rows
                radius = [0.0] * expected_rows
                sums = []
            elif current_rows != expected_rows:
                raise ValueError(f"Inconsistent row count in {source}")
            current_row = 0
            continue

        numeric = [float(value) for value in fields]
        if field_count is None:
            field_count = len(numeric)
            if field_count < 3:
                raise ValueError(f"Too few RDF columns in {source}")
            sums = [[0.0] * (field_count - 2) for _ in range(expected_rows or 0)]
        elif len(numeric) != field_count:
            raise ValueError(f"Inconsistent column count in {source}")

        current_row += 1
        if expected_rows is None or current_row > expected_rows:
            raise ValueError(f"Unexpected RDF row count in {source}")

        row_index = current_row - 1
        radius[row_index] = numeric[1]
        for idx, value in enumerate(numeric[2:]):
            sums[row_index][idx] += value

    if block_count == 0 or expected_rows is None:
        raise ValueError(f"No LAMMPS RDF blocks found in {source}")

    if header is None:
        header = ["r(A)"] + [f"value_{idx}" for idx in range(1, len(sums[0]) + 1)]

    averaged = []
    for row_index, r_value in enumerate(radius):
        averaged.append([r_value] + [value / block_count for value in sums[row_index]])

    if len(header) != len(averaged[0]):
        header = ["r(A)"] + [f"value_{idx}" for idx in range(1, len(averaged[0]))]

    return header, averaged


def load_rdf(source: Path) -> tuple[list[str], list[list[float]]]:
    lines = source.read_text(encoding="utf-8").splitlines()
    if not lines:
        raise ValueError(f"Empty file: {source}")
    if lines[0].strip() == "# Time-averaged data for fix rdf_final_eq":
        return parse_lammps_rdf(lines, source)
    return parse_simple_rdf(lines, source)


def make_safe_name(root_dir: Path, rdf_file: Path) -> str:
    relative = rdf_file.relative_to(root_dir)
    parts = [part.replace(".", "_") for part in relative.parts]
    return "__".join(parts)


def plot_single_file(root_dir: Path, rdf_file: Path, output_dir: Path) -> tuple[Path, str, list[float], list[float]]:
    header, rows = load_rdf(rdf_file)
    x_values = [row[0] for row in rows]
    y_columns = list(zip(*[row[1:] for row in rows]))
    label = str(rdf_file.relative_to(root_dir))

    fig, ax = plt.subplots(figsize=(7.5, 5.0))
    for idx, y_values in enumerate(y_columns, start=1):
        series_label = header[idx] if idx < len(header) else f"value_{idx}"
        ax.plot(x_values, y_values, linewidth=1.8, label=series_label)

    ax.set_xlabel(header[0] if header else "r(A)")
    ax.set_ylabel("RDF / coordination")
    ax.set_title(label)
    ax.grid(True, alpha=0.3)
    if y_columns:
        ax.legend(frameon=False)

    output_path = output_dir / f"{make_safe_name(root_dir, rdf_file)}.png"
    fig.tight_layout()
    fig.savefig(output_path, dpi=200)
    plt.close(fig)

    first_series = list(y_columns[0]) if y_columns else []
    return output_path, label, x_values, first_series


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Plot RDF files under a directory. Supports both raw LAMMPS block output and averaged RDF files."
    )
    parser.add_argument("root_dir", nargs="?", default=".", help="Directory to scan. Default: current directory.")
    parser.add_argument(
        "--pattern",
        default="rdf.txt",
        help="Glob pattern used when scanning files. Default: rdf.txt",
    )
    parser.add_argument(
        "--output-dir",
        default="binary_rdf_plots",
        help="Directory for per-file PNGs. Default: ./binary_rdf_plots",
    )
    parser.add_argument(
        "--overview",
        default="binary_rdf_overview.png",
        help="Filename for overview plot in the current working directory.",
    )
    args = parser.parse_args()

    root_dir = Path(args.root_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    rdf_files = sorted(path for path in root_dir.rglob(args.pattern) if path.is_file())
    if not rdf_files:
        raise SystemExit(f"No files matched {args.pattern!r} under {root_dir}")

    overview_series: list[tuple[str, list[float], list[float]]] = []
    for rdf_file in rdf_files:
        output_path, label, x_values, first_series = plot_single_file(root_dir, rdf_file, output_dir)
        print(f"Saved {output_path}")
        if first_series:
            overview_series.append((label, x_values, first_series))

    if overview_series:
        fig, ax = plt.subplots(figsize=(8.0, 5.5))
        for label, x_values, y_values in overview_series:
            ax.plot(x_values, y_values, linewidth=1.6, label=label)
        ax.set_xlabel("r(A)")
        ax.set_ylabel("First RDF column")
        ax.set_title(f"RDF overview: {root_dir.name}")
        ax.grid(True, alpha=0.3)
        ax.legend(frameon=False, fontsize=8)
        fig.tight_layout()
        overview_path = Path(args.overview).resolve()
        fig.savefig(overview_path, dpi=200)
        plt.close(fig)
        print(f"Saved {overview_path}")


if __name__ == "__main__":
    main()
