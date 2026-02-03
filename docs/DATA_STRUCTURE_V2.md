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
  "name": "Material-Name",
  "source": "mp-xxxxx",
  "type": "solid-solution",
  "composition": "Al2Cu4Ni1",
  "elements": ["Al", "Cu", "Ni"],
  "atomCount": {
    "Al": 2,
    "Cu": 4,
    "Ni": 1
  },
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
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

### Basic Information (User-Provided)

- **name** (string, required): Material name (e.g., "Nb20Al10")
- **source** (string, required): Data source identifier (e.g., "mp-bbgt" from Materials Project, or custom ID)
- **type** (string, required): Material type
  - `element`: Pure element (单质)
  - `solid-solution`: Solid solution (固溶体)
  - `intermetallic`: Intermetallic compound (金属间化合物)
  - `amorphous`: Amorphous material (非晶)
  - `interface`: Interface structure (界面)
- **composition** (string, required): Chemical composition formula (e.g., "Al2Cu4Ni1")
- **elements** (array, required): List of element symbols (e.g., ["Al", "Cu", "Ni"])
- **atomCount** (object, required): Number of atoms per element (e.g., `{"Al": 2, "Cu": 4, "Ni": 1}`)
- **poscar** (string, optional): Path to POSCAR file (e.g., "data/intermetallic/mp-bbgt/POSCAR")
  - **Default**: Assumed to be from DFT relaxation

### Auto-Generated Fields

- **id** (string): Unique identifier automatically assigned by the system
  - Format: "Alloy-XX-#####" where XX is type code (E=element, SS=solid-solution, IM=intermetallic, AM=amorphous, IF=interface)
  - Example: "Alloy-IM-00001" for first intermetallic compound
  - **Do not include this field in your input JSON**

### Data Array

Each entry in the `data` array contains:


- **temperature** (number, required): Temperature in Kelvin (K)
- **source** (string, required): Data source (DFT|DPA-1|DPA-3|MD|Experiment|other)
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
