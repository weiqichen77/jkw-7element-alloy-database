# 7-Element Alloy Materials Database - User Guide

> **Core System**: Al-Ni-Cu-Zr-Nb-Ta-W alloy materials property database

**[🏠 Back to Main](README.md)** | [中文版](USER_GUIDE_CN.md)

---

## 📚 Quick Navigation

| I want to... | Go to |
|--------------|-------|
| Know what's in the database | [Database Contents](#database-contents) |
| Query and use data | [Data Query](#data-query) |
| Upload new data | [Data Upload](#data-upload) |
| Update existing data | [Update Existing Data](#update-existing-data) |
| View data format | [Data Structure](#data-structure) |

---

## Database Contents

### Material Types

The database contains the following types of alloy materials:

| Type | Description | ID Prefix | Examples |
|------|-------------|-----------|----------|
| Element | Pure elements | Alloy-E- | Al, Cu, Ni |
| Solid Solution | Solid solution alloys | Alloy-SS- | Al-Ni, Al-Cu |
| Intermetallic | Intermetallic compounds | Alloy-IM- | Al₃Ni₂, NbAl₃ |
| Amorphous | Amorphous materials | Alloy-AM- | a-Al₂Cu₃ |
| Interface | Interface structures | Alloy-IF- | Al₂Cu₃/Nb₄Ta₅ |

### Property Data

Each material can contain properties at multiple temperatures and from various data sources:

#### Structural Properties
- Density (g/cm³)
- Lattice parameters (a, b, c, α, β, γ)
- Point group, space group
- Radial distribution function (RDF)
- POSCAR crystal structure file (DFT relaxed)

#### Thermodynamic Properties
- Specific heat capacity (J/(g·K))
- Mixing enthalpy (eV/atom)
- Diffusion coefficient (m²/s)
- Thermal expansion coefficient (K⁻¹)

#### Mechanical Properties
- Young's modulus (GPa)
- Bulk modulus (GPa)
- Shear modulus (GPa)
- Poisson's ratio
- Elastic constants matrix (Cij)
- Stress-strain curves

#### Defect Properties
- Vacancy formation energy (eV)
- Interstitial formation energy (eV)
- Stacking fault energy (mJ/m²)

### Data Sources

- **DFT**: Density Functional Theory calculations
- **DPA-1**: Deep Potential model generation 1
- **DPA-3**: Deep Potential model generation 3
- **MD**: Molecular Dynamics simulations
- **Experiment**: Experimental data

### Current Database Scale

```bash
# Statistics
Total materials: 123
Total data points: 5904
Temperature range: 0K - 1000K
Data source types: 5
```

---

## Data Query

### Web Interface

Visit: **https://weiqichen77.github.io/jkw-7element-alloy-database/**

#### 1. Basic Search
- **Keyword search**: Enter material name, element symbol, or ID
- **Examples**: Search for "Al-Ni", "mp-bbgt", "Alloy-IM-00001"

#### 2. Filtering

**Filter by material type**:
- ☐ All
- ☐ Element
- ☐ Solid Solution
- ☐ Intermetallic
- ☐ Amorphous
- ☐ Interface

**Filter by property category**:
- ☐ Structure
- ☐ Thermodynamics
- ☐ Mechanics
- ☐ Defects

#### 3. View Details

Click on a material row to expand detailed information:
- Basic material information (composition, type, source)
- 3D atomic structure visualization
- Property data at different temperatures
- POSCAR file download
- RDF and stress-strain curve data

#### 4. Data Export

**Supported formats**:
- **JSON**: Complete data structure
- **CSV**: Table format (suitable for Excel)
- **POSCAR ZIP**: Batch download crystal structure files

**Export options**:
- Export all data
- Export filtered data
- Export selected materials

---

## Data Upload

### Prepare Data

#### Method 1: Using CSV Template (Recommended)

1. **Download template**: `example-template-v2.csv`

2. **Fill in data**:
```csv
name,source,type,composition,poscar,poscar_source,temperature,data_source,density,...
Nb20Al10,mp-xxxxx,intermetallic,Nb20Al10,data/intermetallic/mp-xxxxx/POSCAR,DFT relaxation,0,DFT,8.57,...
```

**Required fields**:
- `name`: Material name
- `source`: Data source identifier (e.g., mp-xxxxx, custom-001)
- `type`: Material type (element, solid-solution, intermetallic, amorphous, interface)
- `composition`: Chemical formula (e.g., Al2Cu4Ni1)
- `temperature`: Temperature (K)
- `data_source`: Calculation method (DFT, DPA-1, DPA-3, MD, Experiment)

**Optional fields**:
- `poscar_source`: POSCAR structure origin (e.g., "DFT relaxation", "DPA-1 model", "DPA-3 model", "Experiment")
  - If not specified, defaults to "DFT relaxation" on web display

> **Note**: CSV uses snake_case (e.g., `point_group`), converted to camelCase in JSON (e.g., `pointGroup`)

3. **Convert to JSON**:
```bash
node scripts/convert-data-v2.js your-data.csv output.json
```

#### Method 2: Write JSON Directly

```json
{
  "name": "Nb20Al10",
  "source": "mp-xxxxx",
  "type": "intermetallic",
  "composition": "Nb20Al10",
  "elements": ["Nb", "Al"],
  "atomCount": {"Nb": 20, "Al": 10},
  "poscar": "data/intermetallic/mp-xxxxx/POSCAR",
  "poscar_source": "DFT relaxation",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "structure": {
          "density": 8.57,
          "latticeParameters": {
            "a": 3.52,
            "b": 3.52,
            "c": 3.52,
            "alpha": 90,
            "beta": 90,
            "gamma": 90,
            "pointGroup": "Fm-3m"
          }
        },
        "thermodynamics": {
          "mixingEnthalpy": -0.25
        },
        "mechanics": {
          "youngsModulus": 200,
          "bulkModulus": 160
        },
        "defects": {
          "vacancyFormationEnergy": 1.35
        }
      }
    }
  ]
}
```

**Notes**:
- ✅ **Do not** include `id` field (auto-generated by system)
- ✅ **Optional**: Add `poscar_source` field to specify structure origin
- ✅ If `poscar_source` not specified, web will display "DFT relaxation" by default
- ✅ Use relative paths (from repository root)

### Organize Files

Create material directory and place files:

```bash
# Create material directory with data source subdirectory
# (directory name = source field value)
mkdir -p data/intermetallic/mp-xxxxx/DFT

# Add structure file
cp your_structure.vasp data/intermetallic/mp-xxxxx/DFT/POSCAR

# Add optional data files
cp rdf_data.txt data/intermetallic/mp-xxxxx/DFT/rdf.dat
cp stress_strain.txt data/intermetallic/mp-xxxxx/DFT/stress_strain.dat
```

**Directory structure**:
```
data/intermetallic/mp-xxxxx/
└── DFT/                    # Data source subdirectory
    ├── POSCAR              # Crystal structure (DFT relaxed)
    ├── rdf.dat             # Radial distribution function (optional)
    └── stress_strain.dat   # Stress-strain data (optional)
```

**Multiple data sources** (optional):
```bash
# If you have data from multiple sources (DFT, DPA-1, DPA-3, etc.)
mkdir -p data/intermetallic/mp-xxxxx/DPA-1
mkdir -p data/intermetallic/mp-xxxxx/DPA-3

cp dpa1_structure.vasp data/intermetallic/mp-xxxxx/DPA-1/POSCAR
cp dpa3_structure.vasp data/intermetallic/mp-xxxxx/DPA-3/POSCAR
```

**Supported data source directories**:
- `DFT/` - Density Functional Theory calculations
- `DPA-1/` - Deep Potential model generation 1
- `DPA-3/` - Deep Potential model generation 3
- `MD/` - Molecular Dynamics simulations
- `Experiment/` - Experimental measurements

### Validate Data

```bash
# Validate JSON format
node scripts/validate-data.js your-data.json

# Check for duplicates and existing data
node scripts/check-duplicates.js your-data.json
```

**Example output**:
```
✅ No duplicate data found
New materials: 5

Or:

⚠️  Found 2 duplicate materials:
1. Nb20Al10 (ID: Alloy-IM-00001)
   - Source: mp-bbgt
   - Existing data points: 3 (temperatures: 0K, 300K, 600K)
```

---

## Update Existing Data

If duplicate data is detected, you can choose different update modes:

### Update Modes

```bash
# 1. Add new temperature points
node scripts/update-materials.js your-data.json --mode=add-temp
```
- Only add data for new temperature points
- Existing temperature data remains unchanged
- **Use case**: Supplement properties at different temperatures

```bash
# 2. Add new data sources
node scripts/update-materials.js your-data.json --mode=add-source
```
- Only add data from new sources (DFT/DPA-1/DPA-3, etc.)
- Existing data sources remain unchanged
- **Use case**: Calculate the same material with different methods

```bash
# 3. Partial update (non-empty fields only)
node scripts/update-materials.js your-data.json --mode=partial
```
- Only update provided non-empty fields
- Empty or omitted fields retain original values
- **Use case**: Correct or supplement partial property data

```bash
# 4. Full replacement (default mode)
node scripts/update-materials.js your-data.json --mode=full
# Or shorthand
node scripts/update-materials.js your-data.json
```
- Completely replace the entire material entry
- Preserve auto-generated ID
- **Use case**: Re-provide complete material data

### Usage Examples

**Scenario 1: Add new temperature points**
```json
// Only provide data for new temperature points
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "type": "intermetallic",
  "composition": "Nb20Al10",
  "data": [
    {
      "temperature": 900,  // New temperature point
      "source": "DFT",
      "properties": { ... }
    }
  ]
}
```
```bash
node scripts/update-materials.js new-temps.json --mode=add-temp
```

**Scenario 2: Add new calculation method data**
```json
// Same temperature, different data source
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "data": [
    {
      "temperature": 0,
      "source": "DPA-3",  // New data source
      "properties": { ... }
    }
  ]
}
```
```bash
node scripts/update-materials.js dpa3-data.json --mode=add-source
```

**Scenario 3: Correct partial properties**
```json
// Only provide fields to be updated
{
  "name": "Nb20Al10",
  "source": "mp-bbgt",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "mechanics": {
          "youngsModulus": 205  // Corrected value
          // Other fields remain unchanged
        }
      }
    }
  ]
}
```
```bash
node scripts/update-materials.js corrections.json --mode=partial
```

### General Options

```bash
# Skip confirmation prompt
node scripts/update-materials.js your-data.json --mode=add-temp --force
```

**Matching Rules**:
- Material matching: `name` + `source` + `type` + `composition`
- Data point matching: `temperature` + `source` (data origin)

**Notes**:
- ✅ Auto-generated IDs always remain unchanged
- ✅ New materials are directly added to the database
- ✅ Manual commit and push required after updates
- ⚠️  Recommended to check data with `check-duplicates.js` first

### Submit Data

#### Method 1: GitHub Pull Request (Recommended)

1. Fork the repository
2. Add data files and POSCAR
3. Submit Pull Request
4. Wait for review and merge

#### Method 2: Contact Administrator

Send data to: [Administrator Email]

Include:
- JSON data file
- POSCAR and other data files
- Data source description

---

## Data Structure

### JSON Format

#### Top-level Material Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | ✓ | Material name |
| source | String | ✓ | Data source ID (e.g., mp-xxxxx) |
| type | String | ✓ | Material type |
| composition | String | ✓ | Chemical formula (e.g., Al2Cu4) |
| elements | Array | ✓ | Element list ["Al", "Cu"] |
| atomCount | Object | ✓ | Atom count {"Al": 2, "Cu": 4} |
| poscar | String | ✗ | POSCAR file path |
| poscar_source | String | ✗ | POSCAR origin description (e.g., "DFT relaxation", "DPA-1 model") |
| data | Array | ✓ | Property data array |

**Auto-generated fields** (do not include in input):
- `id`: System-assigned (format: Alloy-XX-#####)

---

## FAQ

### Q: How to search for alloys with specific elements?
**A**: Enter element symbol (e.g., "Al") in the search box. The system will display all materials containing that element.

### Q: Are there copyright restrictions on the data?
**A**: Data mainly comes from Materials Project and research literature. Please cite sources when using.

### Q: Can I download the entire database?
**A**: Yes, click "Export Data" and select "All Data" to export complete JSON or CSV file.

### Q: What is the POSCAR file format?
**A**: VASP POSCAR format containing crystal structure information. Defaults to DFT relaxed structure.

### Q: How to cite this database?
**A**: 
```
7-Element Alloy Materials Database (Al-Ni-Cu-Zr-Nb-Ta-W System)
https://weiqichen77.github.io/jkw-7element-alloy-database/
```

### Q: What if I find data errors?
**A**: Submit an Issue on the GitHub repository or contact the administrator.

### Q: How to update existing material data?
**A**: 
1. Prepare JSON file with updated data
2. Run `node scripts/check-duplicates.js your-data.json` to check which materials exist
3. Choose update mode based on needs:
   - `--mode=add-temp` - Only add new temperature points
   - `--mode=add-source` - Only add new data sources
   - `--mode=partial` - Partial update (non-empty fields)
   - `--mode=full` - Complete replacement (default)
4. Run `node scripts/update-materials.js your-data.json --mode=<mode>`

### Q: How to add new temperature point data for existing materials?
**A**: Use `--mode=add-temp` mode. Only provide data for new temperature points in JSON, existing points remain unchanged. Example:
```bash
node scripts/update-materials.js new-temps.json --mode=add-temp
```

### Q: How to correct a wrong property value?
**A**: Use `--mode=partial` mode. Only provide fields that need correction, other fields keep original values.

---

## Technical Support

- **GitHub Repository**: https://github.com/weiqichen77/jkw-7element-alloy-database
- **Web Interface**: https://weiqichen77.github.io/jkw-7element-alloy-database/
- **Issue Reporting**: GitHub Issues

---

## Version Information

- **Current Version**: V2.1
- **Last Updated**: 2026-02-03
- **Material Count**: 123
- **Data Points**: 5904

---

**Quick Links**:
- 📖 [Complete API Documentation](docs/API.md)
- 🏗️ [Detailed Data Structure](docs/DATA_STRUCTURE_V2.md)
- 📁 [Directory Structure Guide](docs/DIRECTORY_STRUCTURE.md)
