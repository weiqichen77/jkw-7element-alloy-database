# Scripts Reference Guide

Reference documentation for all utility scripts in the `scripts/` directory.

## Data Management Scripts

### validate-data.js
**Purpose**: Validate JSON data files for correct structure

**Usage**:
```bash
node scripts/validate-data.js <file_path>
```

**Example**:
```bash
node scripts/validate-data.js backend/data/materials.json
```

**Output**:
```
✓ File loaded successfully
✓ 100 valid entries
✓ All required fields present
✓ No duplicate IDs
✓ Data structure valid
```

**Checks**:
- Valid JSON syntax
- Required fields present (id, name, type, composition, data)
- No duplicate IDs
- Data array not empty
- Properties structure valid

---

### merge-materials.js
**Purpose**: Merge two material JSON files

**Usage**:
```bash
node scripts/merge-materials.js <file1> <file2> [--output <output_file>]
```

**Example**:
```bash
node scripts/merge-materials.js \
  backend/data/materials.json \
  new_materials.json \
  --output backend/data/materials_merged.json
```

**Features**:
- Combines two JSON arrays
- Removes duplicates by ID
- Preserves data structure
- Reports merge statistics

---

### convert-data.js
**Purpose**: Convert data between different formats

**Usage**:
```bash
node scripts/convert-data.js --input <file> --output <file> --format <format>
```

**Supported Formats**:
- `json` - Standard JSON format
- `csv` - Flattened CSV format
- `xml` - XML format (optional)

**Example**:
```bash
# Convert JSON to CSV
node scripts/convert-data.js \
  --input backend/data/materials.json \
  --output export.csv \
  --format csv
```

---

### fix-intermetallic-keys.js
**Purpose**: Convert "source" field to "id" field for intermetallic data

**Usage**:
```bash
node scripts/fix-intermetallic-keys.js <input_file> [--output <output_file>]
```

**Example**:
```bash
node scripts/fix-intermetallic-keys.js \
  backend/data/materials_intermetallic.json \
  --output backend/data/materials_intermetallic_fixed.json
```

**What it does**:
- Renames "source" field to "id" (or vice versa)
- Preserves all other data
- Validates result

---

### generate-sample-data.js
**Purpose**: Generate sample material data for testing

**Usage**:
```bash
node scripts/generate-sample-data.js [count] [--output <file>]
```

**Example**:
```bash
# Generate 10 sample materials
node scripts/generate-sample-data.js 10 --output sample_materials.json
```

**Output**: Valid JSON file with sample data structure

---

## GitHub Pages Deployment Scripts

### prepare-github-pages.js
**Purpose**: Merge data files and prepare for GitHub Pages deployment

**Used by**: `.github/workflows/deploy-pages.yml` (automatic)

**Manual Usage**:
```bash
node scripts/prepare-github-pages.js
```

**What it does**:
1. Loads `materials.json` and `materials_intermetallic.json`
2. Converts "source" → "id" for intermetallic entries
3. Merges both files
4. Outputs to `_site/data/materials.json`
5. Reports statistics

---

## Data Cleaning Scripts

### clean-invalid-paths.js
**Purpose**: Remove or fix invalid file paths in POSCAR and RDF references

**Usage**:
```bash
node scripts/clean-invalid-paths.js <data_file> [--check|--fix]
```

**Options**:
- `--check` - Report invalid paths without modifying
- `--fix` - Fix paths automatically

**Example**:
```bash
# Check for invalid paths
node scripts/clean-invalid-paths.js backend/data/materials.json --check

# Fix invalid paths
node scripts/clean-invalid-paths.js backend/data/materials.json --fix
```

---

### fix-data-paths.js
**Purpose**: Update all file paths to correct locations

**Usage**:
```bash
node scripts/fix-data-paths.js <data_file> --from <old_path> --to <new_path>
```

**Example**:
```bash
node scripts/fix-data-paths.js \
  backend/data/materials.json \
  --from "data/poscar" \
  --to "poscar_files"
```

---

## Testing & Analysis Scripts

### test-data-loading.js
**Purpose**: Test if data loads correctly from various sources

**Usage**:
```bash
node scripts/test-data-loading.js
```

**Tests**:
- Backend JSON files load
- GitHub Pages deployment works
- Data merge is successful
- Material count matches expected

---

### check-poscar-mapping.js
**Purpose**: Verify POSCAR files exist for materials with poscar references

**Usage**:
```bash
node scripts/check-poscar-mapping.js <data_file>
```

**Example**:
```bash
node scripts/check-poscar-mapping.js backend/data/materials.json
```

**Output**:
```
✓ 95/100 materials have valid POSCAR files
✗ 5 materials have missing POSCAR files:
  - ID 1: data/poscar/missing_file.vasp
  - ID 5: data/poscar/another_missing.vasp
```

---

## Database Generation Scripts

### generate-poscar-files.js
**Purpose**: Generate POSCAR files from material data (if needed)

**Usage**:
```bash
node scripts/generate-poscar-files.js <data_file> [--output <dir>]
```

**Example**:
```bash
node scripts/generate-poscar-files.js \
  backend/data/materials.json \
  --output backend/data/poscar
```

---

### add-source-field.js
**Purpose**: Add missing "source" field to materials

**Usage**:
```bash
node scripts/add-source-field.js <data_file> --source <source_name> [--output <file>]
```

**Example**:
```bash
node scripts/add-source-field.js \
  backend/data/materials.json \
  --source "DFT" \
  --output backend/data/materials_with_source.json
```

---

### add-chart-data.js
**Purpose**: Add chart/visualization data to materials

**Usage**:
```bash
node scripts/add-chart-data.js <data_file> [--output <file>]
```

---

## Batch Operations

### integrate-all.sh
**Purpose**: Run complete integration workflow

**Usage**:
```bash
bash scripts/integrate-all.sh
```

**Executes**:
1. Validates all data files
2. Checks POSCAR mappings
3. Merges all materials
4. Generates sample data (if needed)
5. Prepares GitHub Pages deployment
6. Reports all statistics

---

## Configuration Scripts

### Automatic Workflow (.github/workflows/deploy-pages.yml)
Runs automatically on every git push:
```
git push → GitHub Actions → validate → merge → deploy → GitHub Pages
```

To run manually:
```bash
node scripts/validate-data.js backend/data/*.json
node scripts/prepare-github-pages.js
```

---

## Common Workflows

### Workflow 1: Add New Materials

```bash
# 1. Validate your file
node scripts/validate-data.js new_materials.json

# 2. Merge with existing data
node scripts/merge-materials.js \
  backend/data/materials.json \
  new_materials.json \
  --output backend/data/materials.json

# 3. Prepare deployment
node scripts/prepare-github-pages.js

# 4. Commit and push
git add backend/data/materials.json
git commit -m "Add 10 new materials"
git push origin main
```

### Workflow 2: Fix Data Issues

```bash
# 1. Check for problems
node scripts/check-poscar-mapping.js backend/data/materials.json

# 2. Clean invalid paths
node scripts/clean-invalid-paths.js backend/data/materials.json --fix

# 3. Validate result
node scripts/validate-data.js backend/data/materials.json

# 4. Deploy
node scripts/prepare-github-pages.js
```

### Workflow 3: Export Data

```bash
# Export to CSV
node scripts/convert-data.js \
  --input backend/data/materials.json \
  --output materials_export.csv \
  --format csv
```

### Workflow 4: Complete System Check

```bash
# Run full integration
bash scripts/integrate-all.sh

# Test data loading
node scripts/test-data-loading.js

# Generate deployment
node scripts/prepare-github-pages.js
```

---

## Troubleshooting Scripts

If you encounter issues:

1. **Data validation fails**:
   ```bash
   node scripts/validate-data.js your_file.json
   ```

2. **Materials not showing on website**:
   ```bash
   node scripts/test-data-loading.js
   ```

3. **Missing POSCAR files**:
   ```bash
   node scripts/check-poscar-mapping.js backend/data/materials.json
   ```

4. **Path issues**:
   ```bash
   node scripts/clean-invalid-paths.js backend/data/materials.json --check
   ```

---

## Command Cheat Sheet

```bash
# Validate
node scripts/validate-data.js backend/data/materials.json

# Merge
node scripts/merge-materials.js file1.json file2.json --output merged.json

# Convert
node scripts/convert-data.js --input in.json --output out.csv --format csv

# Fix keys
node scripts/fix-intermetallic-keys.js input.json --output output.json

# Test
node scripts/test-data-loading.js

# Deploy
node scripts/prepare-github-pages.js

# Batch
bash scripts/integrate-all.sh
```

---

## Tips

1. **Always validate before deploying**:
   ```bash
   node scripts/validate-data.js your_file.json
   ```

2. **Backup before modifying**:
   ```bash
   cp backend/data/materials.json backend/data/materials.json.backup
   ```

3. **Test changes locally first**:
   ```bash
   python3 -m http.server 8000
   # Then open http://localhost:8000
   ```

4. **Check GitHub Actions**:
   - Go to repository "Actions" tab
   - View deployment status
   - Check logs for errors

---

## See Also

- [DATA_UPLOAD_GUIDE.md](../DATA_UPLOAD_GUIDE.md) - User-friendly data upload guide
- [DEPLOYMENT_GUIDE.md](../DEPLOYMENT_GUIDE.md) - Deployment instructions
- [PROJECT_STATUS.md](../PROJECT_STATUS.md) - Project status and roadmap
