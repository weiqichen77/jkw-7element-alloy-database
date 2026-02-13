# Scripts Reference Guide

This document provides comprehensive information about all utility scripts in the database project.

## Data Processing Scripts

### fix-json-format.js

**Purpose:** Automatically detect and fix common format issues in JSON input files before importing to the database.

**Location:** `scripts/fix-json-format.js`

**Usage:**
```bash
node scripts/fix-json-format.js <input.json> [output.json] [options]
```

**Options:**
- `--dry-run` - Show what would be fixed without writing files
- `--verbose` or `-v` - Show detailed information about each fix

**Examples:**
```bash
# Basic usage (creates input_fixed.json)
node scripts/fix-json-format.js materials.json

# Specify output filename
node scripts/fix-json-format.js materials.json materials_fixed.json

# Test without writing file
node scripts/fix-json-format.js materials.json --dry-run --verbose

# Fix external files
node scripts/fix-json-format.js /path/to/materials_intermetallic_0213.json
node scripts/fix-json-format.js /path/to/materials_solid_solution_0213.json
```

**What It Fixes:**

1. **Field Renames**
   - `ori_source` → `source`

2. **Path Normalization**
   - Remove leading slashes: `/data/...` → `data/...`
   - Fix directory naming: `solid_solution` → `solid-solution`

3. **Data Source Normalization**
   - `DPA1_251208` → `DPA-1`
   - `DPA3` → `DPA-3`
   - `dft` → `DFT`
   - `md` → `MD`

4. **Type Fixes**
   - `solid_solution` → `solid-solution`
   - `solid-element` → `element`

5. **Empty Fields Removal**
   - Removes fields with `null`, `""`, or `undefined` values

**Output:**
```
═══════════════════════════════════════════════
   JSON Format Fixer - Alloy Materials Database
═══════════════════════════════════════════════

🔍 Reading file: materials.json

📊 Total materials: 100

🔧 Processing materials...

✅ Validating fixed data...

📈 Fix Statistics:
──────────────────────────────────────────────
Total materials:           100
Materials with fixes:      45

Issues fixed:
  - Field renames:         12
  - Path normalizations:   89
  - Data source fixes:     23
  - Type fixes:            5
  - Empty fields removed:  156

💾 Saving to: materials_fixed.json
✅ File saved successfully!

═══════════════════════════════════════════════
✅ Fixed 45 materials with format issues
═══════════════════════════════════════════════
```

**Validation:**

The script also validates the fixed data and reports any remaining issues:
- Missing required fields
- Invalid material types
- Empty data arrays
- Missing temperature or properties for non-init entries

---

### convert-data-v2.js

**Purpose:** Convert CSV templates to JSON format compatible with the database.

**Location:** `scripts/convert-data-v2.js`

**Usage:**
```bash
node scripts/convert-data-v2.js input.csv output.json
```

**Features:**
- Parses CSV template format
- Groups rows by material (name + source)
- Supports multiple data entries per material
- Handles `init` source entries (structure only, no properties)
- Validates material structure
- Auto-generates IDs (if not provided)

**Input Format:** See `example-template-v2.csv`

---

### merge-materials.js

**Purpose:** Merge multiple JSON files into a single materials database.

**Location:** `scripts/merge-materials.js`

**Usage:**
```bash
node scripts/merge-materials.js file1.json file2.json ... output.json
```

**Features:**
- Combines multiple JSON material files
- Removes duplicates based on source ID
- Maintains data integrity

---

### validate-data.js

**Purpose:** Validate JSON files against the database schema.

**Location:** `scripts/validate-data.js`

**Usage:**
```bash
node scripts/validate-data.js input.json
```

**Checks:**
- Required fields present
- Valid material types
- Data structure compliance
- Temperature/source consistency

---

### check-duplicates.js

**Purpose:** Check for duplicate materials in JSON files.

**Location:** `scripts/check-duplicates.js`

**Usage:**
```bash
node scripts/check-duplicates.js input.json
```

**Output:**
- List of duplicate materials by source ID
- Statistics on duplicates found

---

## Complete Workflow Example

### Scenario: Import new material data from external JSON files

```bash
# Step 1: Fix format issues in your input files
node scripts/fix-json-format.js materials_intermetallic_0213.json materials_intermetallic_fixed.json --verbose

node scripts/fix-json-format.js materials_solid_solution_0213.json materials_solid_solution_fixed.json --verbose

# Step 2: Validate the fixed files
node scripts/validate-data.js materials_intermetallic_fixed.json
node scripts/validate-data.js materials_solid_solution_fixed.json

# Step 3: Check for duplicates
node scripts/check-duplicates.js materials_intermetallic_fixed.json

# Step 4: Merge with existing database
node scripts/merge-materials.js \
  backend/data/materials_intermetallic.json \
  materials_intermetallic_fixed.json \
  backend/data/materials_intermetallic_new.json

node scripts/merge-materials.js \
  data/materials.json \
  materials_solid_solution_fixed.json \
  data/materials_new.json

# Step 5: Backup and replace
cp backend/data/materials_intermetallic.json backend/data/materials_intermetallic_backup.json
cp data/materials.json data/materials_backup.json

mv backend/data/materials_intermetallic_new.json backend/data/materials_intermetallic.json
mv data/materials_new.json data/materials.json

# Step 6: Deploy to frontend
cp backend/data/materials_intermetallic.json _site/data/
cp data/materials.json _site/data/

# Step 7: Test in browser
# Open _site/index.html in browser and search for new materials
```

---

## Tips and Best Practices

### 1. Always Use --dry-run First

```bash
node scripts/fix-json-format.js large_file.json --dry-run --verbose
```

This lets you preview changes before modifying files.

### 2. Keep Backups

```bash
cp important_data.json important_data_backup_$(date +%Y%m%d).json
```

### 3. Validate After Every Step

```bash
node scripts/validate-data.js output.json
```

### 4. Use Verbose Mode for Debugging

```bash
node scripts/fix-json-format.js input.json --verbose > fix_report.txt
```

### 5. Chain Commands Safely

```bash
# Fix, validate, then merge if validation passes
node scripts/fix-json-format.js input.json output.json && \
node scripts/validate-data.js output.json && \
node scripts/merge-materials.js existing.json output.json merged.json
```

---

## Troubleshooting

### Issue: "Cannot find module"

```bash
# Make sure you're in the project root directory
cd /workspaces/jkw-7element-alloy-database

# Install dependencies if needed
npm install
```

### Issue: "Permission denied"

```bash
# Make script executable
chmod +x scripts/fix-json-format.js
```

### Issue: "Invalid JSON"

```bash
# Use a JSON validator first
node -e "console.log(JSON.parse(require('fs').readFileSync('file.json', 'utf8')))"
```

### Issue: Script runs but no fixes applied

Check the fix configuration in the script. Some fixes may be disabled by default:

```javascript
const FIXES = {
  FIELD_RENAME: true,
  PATH_NORMALIZE: true,
  DATA_SOURCE_NORMALIZE: true,
  REMOVE_EMPTY_FIELDS: true,
  ADD_MISSING_FIELDS: false,  // Disabled by default
};
```

---

## Contributing

When adding new scripts:

1. Add documentation to this file
2. Include usage examples
3. Add error handling
4. Provide verbose/debug modes
5. Include validation steps

---

## See Also

- [DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) - Data format specification
- [example-template-v2.csv](example-template-v2.csv) - CSV template example
- [V2.3_UPDATE_NOTES.md](docs/V2.3_UPDATE_NOTES.md) - Latest structure changes
