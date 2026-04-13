#!/usr/bin/env python3

from __future__ import annotations

import math
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt

def load_curve(path: Path) -> tuple[list[float], list[float]]:
    strain: list[float] = []
    stress: list[float] = []
    with path.open("r", encoding="utf-8") as handle:
        for line in handle:
            stripped = line.strip()
            if not stripped or stripped.startswith("#"):
                continue
            x_value, y_value = map(float, stripped.split()[:2])
            strain.append(x_value)
            stress.append(y_value)
    if not strain:
        raise ValueError(f"{path}: no numeric curve data found")
    return strain, stress


def rate_label(path: Path) -> str:
    parts = path.parts
    if len(parts) < 7:
        return path.stem
    # <element>/<crystal>/<potential>/<temperature>/<mode>/<strain_rate>/stress_strain.dat
    return parts[5]


def element_key(path: Path) -> tuple[str, str, str]:
    parts = path.parts
    if len(parts) < 7:
        raise ValueError(f"{path}: unexpected directory layout")
    element, crystal, potential = parts[:3]
    return element, crystal, potential


def main() -> int:
    root = Path(".")
    files = sorted(root.rglob("*.dat"))
    if not files:
        print("No .dat files found.")
        return 1

    grouped: dict[tuple[str, str, str], list[Path]] = {}
    for path in files:
        grouped.setdefault(element_key(path), []).append(path)

    groups = sorted(grouped.items(), key=lambda item: item[0][0])
    n_panels = len(groups)
    ncols = 3
    nrows = math.ceil(n_panels / ncols)
    fig, axes = plt.subplots(nrows, ncols, figsize=(15, 4.2 * nrows), constrained_layout=True)
    axes_list = list(axes.flat) if hasattr(axes, "flat") else [axes]

    for ax, ((element, crystal, potential), paths) in zip(axes_list, groups):
        for path in sorted(paths):
            strain, stress = load_curve(path)
            ax.plot(strain, stress, linewidth=2.2, label=rate_label(path))

        ax.set_title(f"{element}  {crystal}  {potential}", fontsize=12, fontweight="bold")
        ax.set_xlabel("Strain")
        ax.set_ylabel("Stress")
        ax.grid(True, alpha=0.25, linewidth=0.6)
        ax.legend(title="strain rate", fontsize=9, title_fontsize=9, frameon=False)

    for ax in axes_list[n_panels:]:
        ax.axis("off")

    fig.suptitle("Stress-Strain Curves", fontsize=16, fontweight="bold")
    png_path = root / "stress_strain_summary.png"
    pdf_path = root / "stress_strain_summary.pdf"
    fig.savefig(png_path, dpi=220, bbox_inches="tight")
    fig.savefig(pdf_path, bbox_inches="tight")
    print(f"Saved {png_path}")
    print(f"Saved {pdf_path}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
