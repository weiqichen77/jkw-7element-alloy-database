# Data Structure V2

## Overview

This document describes the enhanced data structure for the alloy materials database, supporting multiple temperatures, data sources, and expanded property categories.

## Material Types

- `element`: Pure element (单质)
- `solid-solution`: Solid solution (固溶体)
- `intermetallic`: Intermetallic compound (金属间化合物)
- `amorphous`: Amorphous material (非晶)
- `interface`: Interface structure (界面)

## Composition Notation Rules

### Basic Format
- Element symbols followed by atom counts: `Al2Cu4Ni1`
- System automatically converts numbers to subscripts: Al₂Cu₄Ni₁

### Amorphous Prefix
- Use `a-` prefix to mark amorphous materials: `a-Al2Cu4Ni1`
- Displays as: a-Al₂Cu₄Ni₁
- Required for materials with type "amorphous"

### Interface Notation
- Use slash `/` to separate two sides: `Al2Cu3/Nb4Ta5`
- Each side formatted independently: Al₂Cu₃/Nb₄Ta₅
- Can combine with amorphous prefix on either side:
  - `a-Al2Cu3/Nb4Ta5` → a-Al₂Cu₃/Nb₄Ta₅
  - `Al2Cu3/a-Nb4Ta5` → Al₂Cu₃/a-Nb₄Ta₅
  - `a-Al2Cu3/a-Nb4Ta5` → a-Al₂Cu₃/a-Nb₄Ta₅

### Examples
- Simple: `Al2Cu4` → Al₂Cu₄
- Amorphous: `a-Al2Nb3` → a-Al₂Nb₃
- Interface: `Al2Cu3/Nb4Ta5` → Al₂Cu₃/Nb₄Ta₅
- Complex: `Al2Cu3/a-Nb4Ta5` → Al₂Cu₃/a-Nb₄Ta₅

## JSON Schema

```json
{
  "id": 1,
  "name": "Material-Name",
  "type": "solid-solution",
  "composition": "Al2Cu4Ni1",
  "elements": ["Al", "Cu", "Ni"],
  "atomCount": {
    "Al": 2,
    "Cu": 4,
    "Ni": 1
  },
  "poscar": "data/poscar/material-1.vasp",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "poscarSource": "DFT",
      "properties": {
        "structure": {
          "density": 7.85,
          "latticeParameters": {
            "a": 3.52,
            "b": 3.52,
            "c": 3.52,
            "alpha": 90,
            "beta": 90,
            "gamma": 90,
            "pointGroup": "Fm-3m"
          },
          "rdf": "data/rdf/material-1-0K-DFT.dat"
        },
        "thermodynamics": {
          "specificHeat": 0.45,
          "mixingEnthalpy": -0.25,
          "diffusionCoefficient": 1.2e-10,
          "thermalExpansion": 1.5e-5
        },
        "mechanics": {
          "youngsModulus": 200,
          "bulkModulus": 160,
          "shearModulus": 80,
          "poissonsRatio": 0.3,
          "elasticConstants": [
            [230, 135, 135, 0, 0, 0],
            [135, 230, 135, 0, 0, 0],
            [135, 135, 230, 0, 0, 0],
            [0, 0, 0, 118, 0, 0],
            [0, 0, 0, 0, 118, 0],
            [0, 0, 0, 0, 0, 118]
          ],
          "stressStrain": "data/stress-strain/material-1-0K-DFT.dat"
        },
        "defects": {
          "vacancyFormationEnergy": 1.2,
          "interstitialFormationEnergy": {
            "dumbbell111": 3.5,
            "dumbbell100": 3.8,
            "crowdion111": 4.2
          },
          "stackingFaultEnergy": 0.05
        }
      }
    },
    {
      "temperature": 300,
      "source": "DFT",
      "properties": {
        "structure": {
          "density": 7.82,
          "latticeParameters": {
            "a": 3.53,
            "b": 3.53,
            "c": 3.53,
            "alpha": 90,
            "beta": 90,
            "gamma": 90,
            "pointGroup": "Fm-3m"
          }
        },
        "thermodynamics": {
          "specificHeat": 0.48
        }
      }
    },
    {
      "temperature": 0,
      "source": "DPA-3",
      "properties": {
        "structure": {
          "density": 7.83
        }
      }
    }
  ]
}
```

## Field Descriptions

### Basic Information

- **id** (number, required): Unique identifier
- **name** (string, required): Material name
- **type** (string, required): Material type (element|solid-solution|intermetallic|amorphous|interface)
- **composition** (string, required): Chemical composition formula (e.g., "Al2Cu4Ni1")
- **elements** (array, required): List of element symbols
- **atomCount** (object, required): Number of atoms per element
- **poscar** (string, optional): Path to POSCAR file

### Data Array

Each entry in the `data` array contains:

- **temperature** (number, required): Temperature in Kelvin (K)
- **source** (string, required): Data source (DFT|DPA-1|DPA-3|MD|Experiment|other)
- **poscarSource** (string, optional): **NEW in V2.1** - Specifies which data source the POSCAR structure originates from. Use when POSCAR file comes from a different calculation method than the current data entry. For example, if you have DFT and DPA-3 data but POSCAR was generated from DFT, set `poscarSource: "DFT"` for all entries.
- **properties** (object): Property groups

### Property Groups

#### Structure Properties

- **density** (number): Density in g/cm³
- **latticeParameters** (object):
  - **a, b, c** (number): Lattice constants in Ångström
  - **alpha, beta, gamma** (number): Lattice angles in degrees
  - **pointGroup** (string): Crystallographic point group
- **rdf** (string|array): Radial distribution function (file path or data array)

#### Thermodynamics Properties

- **specificHeat** (number): Specific heat capacity in J/(g·K)
- **mixingEnthalpy** (number): Mixing enthalpy in eV/atom
- **diffusionCoefficient** (number): Diffusion coefficient in m²/s
- **thermalExpansion** (number): Thermal expansion coefficient in K⁻¹

#### Mechanics Properties

- **youngsModulus** (number): Young's modulus in GPa
- **bulkModulus** (number): Bulk modulus in GPa
- **shearModulus** (number): Shear modulus in GPa
- **poissonsRatio** (number): Poisson's ratio (dimensionless)
- **elasticConstants** (array|object): 6×6 elastic constant matrix (Cij) in GPa
  - Format 1: 2D array: `[[c11,c12,...], [c21,c22,...], ...]`
  - Format 2: Object with matrix: `{matrix: [[c11,c12,...], ...]}`
  - Displayed as symmetric 6×6 table in UI with row/column headers
- **stressStrain** (string|array): Stress-strain curve (file path or data array)

#### Defects Properties

- **vacancyFormationEnergy** (number): Vacancy formation energy in eV
- **interstitialFormationEnergy** (number|object): 
  - If number: single value in eV
  - If object: multiple interstitial sites with values in eV
- **stackingFaultEnergy** (number): Generalized stacking fault energy in J/m²

## Data Point Counting Rules

For statistical purposes, count only non-null property values:

1. Each scalar value (density, specificHeat, etc.) counts as 1 data point
2. Lattice parameters (a, b, c, alpha, beta, gamma, pointGroup) count as 7 data points if present
3. Elastic constants matrix (6×6) counts as 21 unique values (upper triangle)
4. Each interstitial site counts as 1 data point
5. File paths (rdf, stressStrain) count as 1 data point each

Example calculation for a single temperature/source entry:
- Structure: density(1) + latticeParameters(7) + rdf(1) = 9
- Thermodynamics: specificHeat(1) + mixingEnthalpy(1) + diffusionCoefficient(1) = 3
- Mechanics: youngsModulus(1) + bulkModulus(1) + shearModulus(1) + poissonsRatio(1) + elasticConstants(21) + stressStrain(1) = 26
- Defects: vacancyFormationEnergy(1) + interstitialFormationEnergy(3 sites) + stackingFaultEnergy(1) = 5

Total: 43 data points for this entry

If this material has 2 sources (DFT, DPA-3) at 0K: 43 × 2 = 86 data points

## POSCAR Source Field Usage (V2.1 Feature)

The `poscarSource` field allows you to specify which data source was used to generate the POSCAR structure file. This is particularly useful when:

### Use Case 1: Multiple Data Sources, Single POSCAR

You have property data from multiple calculation methods (e.g., DFT and DPA-3), but the POSCAR structure was generated using only one method (e.g., DFT).

```json
{
  "name": "Al2Cu4-sample",
  "poscar": "data/poscar/al2cu4.vasp",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "poscarSource": "DFT",
      "properties": { /* DFT properties */ }
    },
    {
      "temperature": 0,
      "source": "DPA-3",
      "poscarSource": "DFT",
      "properties": { /* DPA-3 properties */ }
    },
    {
      "temperature": 300,
      "source": "DFT",
      "poscarSource": "DFT",
      "properties": { /* DFT properties at 300K */ }
    }
  ]
}
```

In this example:
- All three data entries share the same POSCAR file
- The POSCAR was generated from DFT calculations at 0K
- The `poscarSource: "DFT"` field indicates this on the website
- Users can see that DPA-3 data uses a DFT-optimized structure

### Use Case 2: Mixed Data Sources

When you have data from experiments and simulations:

```json
{
  "name": "Ni-pure",
  "poscar": "data/poscar/ni.vasp",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "poscarSource": "DFT",
      "properties": { /* DFT properties */ }
    },
    {
      "temperature": 300,
      "source": "Experiment",
      "poscarSource": "DFT",
      "properties": { /* Experimental properties */ }
    }
  ]
}
```

Here the experimental data at 300K uses the DFT-optimized structure for reference.

### Display on Website

When users view material details, the POSCAR source is displayed:
- Next to the "Structure File" link: `View POSCAR (Source: DFT)`
- In the "Data Sources" section for each entry: `DPA-3 (POSCAR from DFT)`

This provides transparency about which calculation method generated the atomic structure.
