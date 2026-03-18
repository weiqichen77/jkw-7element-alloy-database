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

        try:
            data.append([float(value) for value in stripped.split()])
        except ValueError as exc:
            raise ValueError(f"Unsupported numeric line in {source}: {line.rstrip()}") from exc

    if not data:
        raise ValueError(f"No RDF data found in {source}")

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
                header = ["r(A)"] + (raw_names[1:] if len(raw_names) >= 2 else ["value_1"])
            continue

        fields = stripped.split()
        if len(fields) == 2:
            block_count += 1
            current_rows = int(float(fields[1]))
            if expected_rows is None:
                expected_rows = current_rows
                radius = [0.0] * expected_rows
            elif current_rows != expected_rows:
                raise ValueError(f"Inconsistent row count in {source}")
            current_row = 0
            continue

        numeric = [float(value) for value in fields]
        if field_count is None:
            field_count = len(numeric)
            if field_count < 3 or expected_rows is None:
                raise ValueError(f"Invalid RDF block in {source}")
            sums = [[0.0] * (field_count - 2) for _ in range(expected_rows)]
        elif len(numeric) != field_count:
            raise ValueError(f"Inconsistent column count in {source}")

        current_row += 1
        row_index = current_row - 1
        if expected_rows is None or row_index >= expected_rows:
            raise ValueError(f"Unexpected RDF row count in {source}")
        radius[row_index] = numeric[1]
        for idx, value in enumerate(numeric[2:]):
            sums[row_index][idx] += value

    if block_count == 0 or expected_rows is None:
        raise ValueError(f"No LAMMPS RDF blocks found in {source}")

    averaged = [[r_value] + [value / block_count for value in sums[idx]] for idx, r_value in enumerate(radius)]
    if header is None or len(header) != len(averaged[0]):
        header = ["r(A)"] + [f"value_{idx}" for idx in range(1, len(averaged[0]))]
    return header, averaged


def load_rdf(source: Path) -> tuple[list[str], list[list[float]]]:
    lines = source.read_text(encoding="utf-8").splitlines()
    if not lines:
        raise ValueError(f"Empty file: {source}")
    if lines[0].strip() == "# Time-averaged data for fix rdf_final_eq":
        return parse_lammps_rdf(lines, source)
    return parse_simple_rdf(lines, source)


def collect_groups(root_dir: Path) -> dict[tuple[str, str], dict[str, Path]]:
    groups: dict[tuple[str, str], dict[str, Path]] = {}
    for rdf_file in sorted(root_dir.rglob("rdf.txt")):
        relative = rdf_file.relative_to(root_dir)
        if len(relative.parts) < 6:
            continue
        elements = "/".join(relative.parts[:-5])
        dataset = relative.parts[-5]
        composition = relative.parts[-4]
        if dataset not in {"DFT", "DPA1_7ele_cry260226", "DPA3_7ele_cryfinal"}:
            continue
        key = (elements, composition)
        groups.setdefault(key, {})[dataset] = rdf_file
    return groups


def dataset_label(dataset: str) -> str:
    if dataset == "DPA1_7ele_cry260226":
        return "DPA1"
    if dataset == "DPA3_7ele_cryfinal":
        return "DPA3"
    return dataset


def safe_name(text: str) -> str:
    return text.replace("/", "__")


def plot_group(key: tuple[str, str], group: dict[str, Path], output_dir: Path) -> Path:
    elements, composition = key
    order = ["DFT", "DPA1_7ele_cry260226", "DPA3_7ele_cryfinal"]
    colors = {"DFT": "#111111", "DPA1_7ele_cry260226": "#1f77b4", "DPA3_7ele_cryfinal": "#d62728"}

    fig, ax = plt.subplots(figsize=(7.2, 4.8))
    for dataset in order:
        rdf_file = group.get(dataset)
        if rdf_file is None:
            continue
        header, rows = load_rdf(rdf_file)
        x_values = [row[0] for row in rows]
        y_values = [row[1] for row in rows]
        series_label = dataset_label(dataset)
        if len(header) > 1:
            series_label = f"{series_label} ({header[1]})"
        ax.plot(x_values, y_values, linewidth=2.0, label=series_label, color=colors.get(dataset))

    ax.set_xlabel("r(A)")
    ax.set_ylabel("g(r)")
    ax.set_title(f"{elements} | {composition}")
    ax.grid(True, alpha=0.3)
    ax.legend(frameon=False)
    fig.tight_layout()

    output_path = output_dir / f"{safe_name(elements)}__{composition}.png"
    fig.savefig(output_path, dpi=220)
    plt.close(fig)
    return output_path


def plot_overview(groups: dict[tuple[str, str], dict[str, Path]], output_path: Path) -> None:
    comparable = [item for item in groups.items() if "DFT" in item[1] and ("DPA1_7ele_cry260226" in item[1] or "DPA3_7ele_cryfinal" in item[1])]
    if not comparable:
        return

    fig, axes = plt.subplots(len(comparable), 1, figsize=(8.2, 4.0 * len(comparable)), squeeze=False)
    order = ["DFT", "DPA1_7ele_cry260226", "DPA3_7ele_cryfinal"]
    colors = {"DFT": "#111111", "DPA1_7ele_cry260226": "#1f77b4", "DPA3_7ele_cryfinal": "#d62728"}

    for ax, ((elements, composition), group) in zip(axes[:, 0], comparable):
        for dataset in order:
            rdf_file = group.get(dataset)
            if rdf_file is None:
                continue
            _, rows = load_rdf(rdf_file)
            ax.plot(
                [row[0] for row in rows],
                [row[1] for row in rows],
                linewidth=1.8,
                label=dataset_label(dataset),
                color=colors.get(dataset),
            )
        ax.set_title(f"{elements} | {composition}")
        ax.set_xlabel("r(A)")
        ax.set_ylabel("g(r)")
        ax.grid(True, alpha=0.3)
        ax.legend(frameon=False)

    fig.tight_layout()
    fig.savefig(output_path, dpi=220)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description="Plot DFT vs DPA RDF comparison figures.")
    parser.add_argument("root_dir", nargs="?", default=".", help="Root directory to scan. Default: current directory.")
    parser.add_argument("--output-dir", default="rdf_compare_plots", help="Per-composition comparison plot directory.")
    parser.add_argument("--overview", default="rdf_compare_overview.png", help="Overview figure filename.")
    args = parser.parse_args()

    root_dir = Path(args.root_dir).resolve()
    output_dir = Path(args.output_dir).resolve()
    output_dir.mkdir(parents=True, exist_ok=True)

    groups = collect_groups(root_dir)
    comparable = {key: group for key, group in groups.items() if "DFT" in group and ("DPA1_7ele_cry260226" in group or "DPA3_7ele_cryfinal" in group)}
    if not comparable:
        raise SystemExit(f"No comparable DFT/DPA RDF groups found under {root_dir}")

    for key, group in sorted(comparable.items()):
        output_path = plot_group(key, group, output_dir)
        print(f"Saved {output_path}")

    overview_path = Path(args.overview).resolve()
    plot_overview(comparable, overview_path)
    print(f"Saved {overview_path}")


if __name__ == "__main__":
    main()
