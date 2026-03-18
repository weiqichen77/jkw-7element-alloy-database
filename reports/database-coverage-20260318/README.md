# Database Coverage Summary (2026-03-18)

Dataset baseline: `_site/data/materials.json`
Generated from latest deployed database after source/field rendering fixes.

## 1) Database Composition

- Total materials: **3401**
- Total data points (`data[]` records): **7542**
- Unique elements: **13**
  - Al, Cd, Cr, Cu, Mo, Nb, Ni, Pt, Ta, V, W, Zn, Zr

### Material-type distribution

| Type | Count | Share |
|---|---:|---:|
| element | 33 | 0.97% |
| solid-solution | 3233 | 95.06% |
| intermetallic | 123 | 3.62% |
| amorphous | 12 | 0.35% |

### Data-point source distribution (`data[].source`, normalized)

| Source base | Count | Share |
|---|---:|---:|
| DPA-3 | 3408 | 45.19% |
| Other | 3338 | 44.26% |
| DPA-1 | 491 | 6.51% |
| DFT | 244 | 3.24% |
| Alloy_tongqi | 49 | 0.65% |
| URL | 9 | 0.12% |
| DOI | 3 | 0.04% |

## 2) Property Coverage (Material-level)

Material-level = number of materials with at least one valid value for the property.

### Structure

| Property | Materials | Coverage |
|---|---:|---:|
| density | 3245 | 95.41% |
| lattice parameters | 3389 | 99.65% |
| RDF | 12 | 0.35% |
| POSCAR (top-level) | 144 | 4.23% |

### Thermodynamics

| Property | Materials | Coverage |
|---|---:|---:|
| C_v (`specificHeat_v`) | 7 | 0.21% |
| C_p (`specificHeat_p`) | 7 | 0.21% |
| mixing enthalpy | 3356 | 98.68% |
| diffusion coefficient | 12 | 0.35% |
| thermal expansion | 7 | 0.21% |

### Mechanics

| Property | Materials | Coverage |
|---|---:|---:|
| elastic constants | 3364 | 98.91% |
| Young's modulus | 2376 | 69.86% |
| bulk modulus | 2376 | 69.86% |
| shear modulus | 2377 | 69.89% |
| Poisson's ratio | 2377 | 69.89% |
| stress-strain | 7 | 0.21% |

### Defects

| Property | Materials | Coverage |
|---|---:|---:|
| vacancy formation energy | 7 | 0.21% |
| interstitial formation energy | 3363 | 98.88% |
| stacking fault energy | 4 | 0.12% |

## 3) Property Coverage by Material Type (Category-level)

Category-level = whether a material has any valid value in that category.

| Type | Structure | Thermodynamics | Mechanics | Defects |
|---|---:|---:|---:|---:|
| element (33) | 100% | 21.21% | 24.24% | 24.24% |
| solid-solution (3233) | 100% | 100% | 100% | 100% |
| intermetallic (123) | 100% | 100% | 100% | 100% |
| amorphous (12) | 100% | 100% | 0% | 0% |

## 4) Data-point-level Highlights

Data-point-level = fraction of all 7542 `data[]` records with a valid value.

- density: 52.53%
- lattice parameters: 55.46%
- mixing enthalpy: 53.86%
- elastic constants: 54.59%
- interstitial formation energy: 54.23%
- Young/bulk/shear/Poisson: about 41%
- RDF: 0.28%
- diffusion coefficient: 0.16%
- stress-strain: 0.09%

Web UI equivalent total (same counting logic as current frontend): **33,041**

## 5) Notes for Current Version

- Main-table value selection now follows source-priority logic per property field.
- C_v/C_p and stress-strain are shown when any sub-entry has data.
- RDF and stress-strain text files are parsed and plotted at runtime.
- Amorphous data directory is now included in GitHub Pages deployment assets.

## 6) Machine-readable Metrics

- `reports/database-coverage-20260318/coverage-summary.json`

## 7) Counting-Method Consistency Note

To avoid confusion between web UI totals and report totals:

- Web UI total (`countDataProperties`, updated): **33,041**
  - Specific heat is counted as one combined field (`specificHeat` or `C_v/C_p`).
- Report per-key total (`propertyCoverageByDataPoint`): **33,063**
  - `C_v` and `C_p` are counted as separate keys.

Difference: **22**

Reason: entries that have both `C_v` and `C_p` are counted once in web UI, but twice in per-key report metrics.
