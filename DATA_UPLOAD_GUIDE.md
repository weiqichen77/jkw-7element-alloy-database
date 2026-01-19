# Data Upload Guide

Complete guide for preparing, validating, and uploading material data to the Alloy Materials Database.

## Table of Contents
1. [JSON File Structure](#json-file-structure)
2. [Directory Structure](#directory-structure)
3. [Preparing Your Data](#preparing-your-data)
4. [Upload Process](#upload-process)
5. [Validation & Verification](#validation--verification)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)

---

## JSON File Structure

### Required Fields

Each material entry must have:

```json
{
  "id": 1,
  "name": "Al-Ni-Cu",
  "type": "Ternary",
  "composition": "Al80Ni10Cu10",
  "elements": ["Al", "Ni", "Cu"],
  "atomCount": 9900,
  "density": 3.24,
  "data": [
    {
      "temperature": 300,
      "source": "DFT",
      "properties": {
        "structure": {...},
        "thermodynamics": {...},
        "mechanics": {...},
        "defects": {...}
      }
    }
  ]
}
```

### Field Descriptions

#### Top-level Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | Number/String | ✓ | Unique identifier (numeric for regular, string "mp-xxxx" for intermetallic) |
| `name` | String | ✓ | Material composition name (e.g., "Al-Ni-Cu") |
| `type` | String | ✓ | Classification: "Binary", "Ternary", "Quaternary", etc. |
| `composition` | String | ✓ | Chemical formula with atomic percentages (e.g., "Al80Ni10Cu10") |
| `elements` | Array | ✓ | List of element symbols: `["Al", "Ni", "Cu"]` |
| `atomCount` | Number | ✓ | Total number of atoms in calculation cell |
| `density` | Number | ✓ | Density in g/cm³ |
| `data` | Array | ✓ | Array of property records (see below) |

#### Data Array Fields

Each entry in the `data` array:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `temperature` | Number | ✓ | Temperature in Kelvin |
| `source` | String | ✓ | Calculation method: "DFT", "CALPHAD", "Experiment", etc. |
| `properties` | Object | ✓ | Contains structure, thermodynamics, mechanics, defects |

#### Structure Properties

```json
"structure": {
  "spaceGroup": "Fm-3m",
  "pointGroup": "m-3m",
  "latticeType": "FCC",
  "latticeParameters": {
    "a": 4.0495,
    "b": 4.0495,
    "c": 4.0495,
    "alpha": 90.0,
    "beta": 90.0,
    "gamma": 90.0
  },
  "density": 3.24
}
```

**Note**: `latticeParameters` is optional but recommended. If present, it will be displayed even without `pointGroup`.

#### Thermodynamic Properties

```json
"thermodynamics": {
  "formationEnergy": -0.250,
  "mixingEnthalpy": -0.125,
  "entropy": 45.23
}
```

All thermodynamic values optional. Values should be in eV for energy-related properties.

#### Mechanical Properties

```json
"mechanics": {
  "youngsModulus": 125.5,
  "bulkModulus": 145.2,
  "shearModulus": 45.3,
  "poissonsRatio": 0.35
}
```

All mechanical properties optional. Values in GPa.

#### Defect Properties

```json
"defects": {
  "vacancyFormationEnergy": 1.45,
  "interstitialFormationEnergy": 2.30,
  "stallingEnergy": 0.85
}
```

All defect properties optional. Values in eV.

---

## Directory Structure

Place material data in the following structure:

```
backend/data/
├── materials.json                    # Regular binary/ternary alloys
├── materials_intermetallic.json      # Intermetallic compounds
├── poscar/
│   ├── material_id_1/
│   │   └── POSCAR                    # Crystal structure file
│   ├── material_id_2/
│   └── ...
└── rdf/
    ├── material_id_1/
    │   └── rdf_data.txt              # Radial distribution function
    ├── material_id_2/
    └── ...
```

### File Organization

- **materials.json**: Regular alloys with numeric IDs (1, 2, 3, ...)
- **materials_intermetallic.json**: Intermetallic phases with "mp-xxxx" format IDs
- **poscar/**: Crystal structure files in POSCAR format (optional)
- **rdf/**: Radial distribution function data (optional)

---

## Preparing Your Data

### Step 1: Create JSON File

Create your `materials.json` or `materials_intermetallic.json` with proper structure:

```json
[
  {
    "id": 1,
    "name": "Al-Ni",
    "type": "Binary",
    "composition": "Al80Ni20",
    "elements": ["Al", "Ni"],
    "atomCount": 100,
    "density": 3.45,
    "data": [
      {
        "temperature": 300,
        "source": "DFT",
        "properties": {
          "structure": {
            "spaceGroup": "Fm-3m",
            "pointGroup": "m-3m",
            "latticeType": "FCC",
            "latticeParameters": {
              "a": 4.05,
              "b": 4.05,
              "c": 4.05,
              "alpha": 90,
              "beta": 90,
              "gamma": 90
            },
            "density": 3.45
          },
          "thermodynamics": {
            "formationEnergy": -0.15,
            "mixingEnthalpy": -0.08
          }
        }
      }
    ]
  }
]
```

### Step 2: Validate JSON Format

Ensure your JSON is valid:

```bash
# Using Node.js
node -e "require('fs').readFileSync('./materials.json', 'utf8') && console.log('✓ Valid JSON')"

# Or validate online: https://jsonlint.com
```

### Step 3: Organize Supporting Files (Optional)

If you have POSCAR or RDF files:

```bash
mkdir -p backend/data/poscar/material_id_1
cp your_poscar_file backend/data/poscar/material_id_1/POSCAR

mkdir -p backend/data/rdf/material_id_1
cp your_rdf_file backend/data/rdf/material_id_1/rdf_data.txt
```

### Step 4: Test with Sample Data

Before uploading full dataset, test with a few entries:

```bash
# Copy test file to backend
cp test_materials.json backend/data/materials_test.json

# Run validation script
node scripts/validate-data.js backend/data/materials_test.json
```

---

## Upload Process

### Method 1: Direct File Replacement (Simple)

1. **Prepare your JSON file** with all materials data
2. **Replace the existing file**:
   ```bash
   cp your_materials.json backend/data/materials.json
   # OR for intermetallic
   cp your_intermetallic.json backend/data/materials_intermetallic.json
   ```

3. **Commit and push**:
   ```bash
   git add backend/data/materials.json
   git commit -m "Update materials database with new entries"
   git push origin main
   ```

4. **GitHub Actions automatically**:
   - Runs the deployment workflow
   - Merges all JSON files
   - Deploys to GitHub Pages
   - Check deployment in "Actions" tab

### Method 2: Add to Existing Data (Recommended)

1. **Load current data**:
   ```bash
   # Get the current materials count
   jq length backend/data/materials.json
   ```

2. **Merge with new entries**:
   ```bash
   # Use provided merge script
   node scripts/merge-materials.js \
     backend/data/materials.json \
     new_materials.json \
     --output backend/data/materials.json
   ```

3. **Validate merged data**:
   ```bash
   node scripts/validate-data.js backend/data/materials.json
   ```

4. **Push to repository**:
   ```bash
   git add backend/data/materials.json
   git commit -m "Add new materials entries (merged)"
   git push origin main
   ```

### Method 3: Using GitHub Web Interface

1. Go to repository: `jkw-7element-alloy-database`
2. Navigate to `backend/data/`
3. Click the pencil icon on `materials.json`
4. Edit the JSON content
5. Commit changes
6. Deployment starts automatically

---

## Validation & Verification

### Pre-Upload Validation

Run validation script:

```bash
node scripts/validate-data.js backend/data/materials.json
```

Expected output:
```
✓ File loaded successfully
✓ 100 valid entries
✓ All required fields present
✓ No duplicate IDs
✓ Data structure valid
```

### Post-Upload Verification

1. **Check GitHub Actions**:
   - Go to "Actions" tab in repository
   - View "pages build and deployment" workflow
   - Wait for ✓ deployment to complete

2. **Verify web display**:
   - Open: https://weiqichen77.github.io/jkw-7element-alloy-database
   - Check total material count in info message
   - Search for newly added materials
   - Click "View" to expand and verify details

3. **Quick validation**:
   ```bash
   # Check merged data is served
   curl -s https://weiqichen77.github.io/jkw-7element-alloy-database/data/materials.json | jq length
   ```

---

## Examples

### Binary Alloy Example

```json
{
  "id": 1,
  "name": "Al-Ni",
  "type": "Binary",
  "composition": "Al80Ni20",
  "elements": ["Al", "Ni"],
  "atomCount": 100,
  "density": 3.45,
  "data": [
    {
      "temperature": 300,
      "source": "DFT",
      "properties": {
        "structure": {
          "spaceGroup": "Fm-3m",
          "pointGroup": "m-3m",
          "latticeType": "FCC",
          "latticeParameters": {
            "a": 4.05,
            "b": 4.05,
            "c": 4.05,
            "alpha": 90,
            "beta": 90,
            "gamma": 90
          },
          "density": 3.45
        },
        "thermodynamics": {
          "formationEnergy": -0.15,
          "mixingEnthalpy": -0.08,
          "entropy": 30.5
        },
        "mechanics": {
          "youngsModulus": 120,
          "bulkModulus": 140,
          "shearModulus": 45,
          "poissonsRatio": 0.35
        }
      }
    }
  ]
}
```

### Intermetallic Example

For intermetallic compounds, use string IDs in "mp-xxxx" format:

```json
{
  "id": "mp-bbgt",
  "source": "mp-bbgt",
  "name": "Al3Ni2",
  "type": "Intermetallic",
  "composition": "Al60Ni40",
  "elements": ["Al", "Ni"],
  "atomCount": 100,
  "density": 3.89,
  "data": [
    {
      "temperature": 300,
      "source": "DFT",
      "properties": {
        "structure": {
          "latticeParameters": {
            "a": 6.42,
            "b": 6.42,
            "c": 8.54,
            "alpha": 90,
            "beta": 90,
            "gamma": 120
          }
        }
      }
    }
  ]
}
```

### Minimal Required Entry

```json
{
  "id": 99,
  "name": "Al-Ni-Cu",
  "type": "Ternary",
  "composition": "Al70Ni15Cu15",
  "elements": ["Al", "Ni", "Cu"],
  "atomCount": 200,
  "density": 3.56,
  "data": [
    {
      "temperature": 300,
      "source": "Experiment",
      "properties": {}
    }
  ]
}
```

---

## Troubleshooting

### Common Issues

#### 1. "Invalid JSON" error

**Problem**: Syntax error in JSON file

**Solution**:
```bash
# Validate locally
node -e "JSON.parse(require('fs').readFileSync('./materials.json', 'utf8'))"

# Use jsonlint online: https://jsonlint.com
```

#### 2. Duplicate ID error

**Problem**: Two materials have same ID

**Solution**:
```bash
# Find duplicates
jq '.[].id' materials.json | sort | uniq -d

# For intermetallic, check source field
jq '.[].source' materials_intermetallic.json | sort | uniq -d
```

#### 3. Data not appearing on website

**Possible causes**:

1. **Workflow didn't run**: Check GitHub Actions tab
2. **File not committed**: Ensure `git push` completed
3. **Wrong file location**: Must be in `backend/data/`
4. **JSON parsing failed**: Validate with `validate-data.js`

**Debug**:
```bash
# Check if file exists in deployment
curl -s https://weiqichen77.github.io/jkw-7element-alloy-database/data/materials.json | jq '.[] | .id' | head

# Check total count
curl -s https://weiqichen77.github.io/jkw-7element-alloy-database/data/materials.json | jq 'length'
```

#### 4. Missing lattice parameters display

**Problem**: Lattice parameters show "N/A" even though data exists

**Solution**: Ensure proper nesting:
```json
"properties": {
  "structure": {
    "latticeParameters": {    // <-- Must be inside 'structure'
      "a": 4.05,
      "b": 4.05,
      "c": 4.05,
      "alpha": 90,
      "beta": 90,
      "gamma": 90
    }
  }
}
```

#### 5. "Search not working" for intermetallic

**Problem**: Can't search by "mp-xxxx" ID

**Possible causes**:
- Source field not properly converted to `id` field
- Workflow didn't merge files correctly

**Solution**:
1. Verify GitHub Actions workflow completed ✓
2. Check that `id` field (not just `source`) is in merged data:
   ```bash
   curl -s https://weiqichen77.github.io/jkw-7element-alloy-database/data/materials.json | jq '.[-1] | .id'
   ```

---

## Automated Deployment Workflow

The repository includes automated CI/CD:

```
Push to GitHub → GitHub Actions
  ↓
  ├─ Runs validate-data.js (checks JSON validity)
  ├─ Merges materials.json + materials_intermetallic.json
  ├─ Converts source → id for intermetallic entries
  ├─ Extracts density values
  └─ Deploys to GitHub Pages (/_site)
  ↓
Website Updates (within 1-2 minutes)
```

**Files involved**:
- `.github/workflows/deploy-pages.yml` - Automation workflow
- `scripts/prepare-github-pages.js` - Data merge script
- `.nojekyll` - Tells GitHub to serve static files

---

## Best Practices

1. **Always validate before uploading**:
   ```bash
   node scripts/validate-data.js your_file.json
   ```

2. **Use descriptive commit messages**:
   ```bash
   git commit -m "Add 20 new Al-Ni-Cu ternary alloys with DFT properties"
   ```

3. **Keep backup of original data**:
   ```bash
   cp backend/data/materials.json backend/data/materials.json.backup
   ```

4. **Test with small dataset first**:
   - Add 5-10 entries
   - Verify they appear on website
   - Then upload full dataset

5. **Document data sources**:
   - Use clear `source` field ("DFT", "CALPHAD", "Experiment")
   - Add citations in commits
   - Include temperature information

6. **Maintain consistent naming**:
   - Composition: `Al70Ni20Cu10` (percentages as numbers)
   - Elements: Alphabetical order in array
   - Type: "Binary", "Ternary", "Quaternary", "Quinary", etc.

---

## Questions or Issues?

- Check [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) for technical details
- See [PROJECT_STATUS.md](PROJECT_STATUS.md) for current database status
- Review [DATA_INTEGRATION_GUIDE.md](docs/DATA_INTEGRATION_GUIDE.md) for advanced workflows

For bugs or feature requests, open an issue in the repository.
