# Quick Fix Guide for Your JSON Files

This guide shows you exactly how to fix and import your two JSON files:
- `materials_intermetallic_0213.json`
- `materials_solid_solution_0213.json`

## Step-by-Step Instructions

### 1️⃣ Fix Format Issues

Run the auto-fix script on both files:

```bash
cd /workspaces/jkw-7element-alloy-database

# Fix intermetallic file
node scripts/fix-json-format.js \
  /path/to/materials_intermetallic_0213.json \
  materials_intermetallic_0213_fixed.json \
  --verbose

# Fix solid solution file
node scripts/fix-json-format.js \
  /path/to/materials_solid_solution_0213.json \
  materials_solid_solution_0213_fixed.json \
  --verbose
```

**What will be fixed:**
- ✅ `ori_source` → `source` (solid solution file)
- ✅ Path: `solid_solution` → `solid-solution` (solid solution file)
- ✅ Remove leading slashes from paths
- ✅ Normalize data sources: `DPA1_251208` → `DPA-1`, `DPA3` → `DPA-3`
- ✅ Remove empty fields

### 2️⃣ Preview Changes (Optional)

If you want to see what will be fixed without modifying files:

```bash
# Dry run with verbose output
node scripts/fix-json-format.js \
  /path/to/materials_intermetallic_0213.json \
  --dry-run --verbose | less
```

Press `q` to exit the preview.

### 3️⃣ Validate Fixed Files

```bash
# Validate intermetallic data
node scripts/validate-data.js materials_intermetallic_0213_fixed.json

# Validate solid solution data
node scripts/validate-data.js materials_solid_solution_0213_fixed.json
```

### 4️⃣ Import to Database

Once validated, you can import the data:

```bash
# Backup existing data first
cp backend/data/materials_intermetallic.json backend/data/materials_intermetallic_backup_$(date +%Y%m%d).json
cp data/materials.json data/materials_backup_$(date +%Y%m%d).json

# Merge new data
node scripts/merge-materials.js \
  backend/data/materials_intermetallic.json \
  materials_intermetallic_0213_fixed.json \
  backend/data/materials_intermetallic.json

# For solid solution, you may need to create/update the file
node scripts/merge-materials.js \
  data/materials.json \
  materials_solid_solution_0213_fixed.json \
  data/materials.json
```

### 5️⃣ Deploy to Frontend

```bash
# Copy to deployed site
cp backend/data/materials_intermetallic.json _site/data/
cp data/materials.json _site/data/

# If using GitHub Pages
git add backend/data/materials_intermetallic.json data/materials.json _site/data/
git commit -m "Update database with new materials (0213)"
git push
```

## Expected Output

When you run the fix script, you should see:

```
═══════════════════════════════════════════════
   JSON Format Fixer - Alloy Materials Database
═══════════════════════════════════════════════

🔍 Reading file: materials_solid_solution_0213.json

📊 Total materials: 3000

🔧 Processing materials...

  ✓ Material 1: Zr24
    - Renamed ori_source to source
    - Normalized poscar path in data[0]
    - Normalized poscar path in data[1]

  ✓ Material 2: Al12Cu12
    - Renamed ori_source to source
    - Normalized data source: DPA3 → DPA-3
    - Normalized poscar path in data[0]

  ... (more materials)

✅ Validating fixed data...

📈 Fix Statistics:
──────────────────────────────────────────────
Total materials:           3000
Materials with fixes:      3000

Issues fixed:
  - Field renames:         3000  (ori_source → source)
  - Path normalizations:   6000  (solid_solution → solid-solution)
  - Data source fixes:     1500  (DPA3 → DPA-3)
  - Type fixes:            0
  - Empty fields removed:  4500

💾 Saving to: materials_solid_solution_0213_fixed.json
✅ File saved successfully!

═══════════════════════════════════════════════
✅ Fixed 3000 materials with format issues
═══════════════════════════════════════════════
```

## Troubleshooting

### If you see validation warnings:

```
⚠️  Validation Issues: 10 materials

📌 Material 5: custom-material
   - Data[0]: missing poscar field (recommended)
```

These are usually warnings, not errors. You can:
1. Manually fix critical issues
2. Proceed with import if warnings are acceptable
3. Re-run the fix script after manual corrections

### If paths are still wrong:

The script normalizes common path issues. If you have custom path patterns, edit the `normalizePath()` function in `scripts/fix-json-format.js`:

```javascript
function normalizePath(filePath) {
  // Add your custom path fixes here
  if (filePath.includes('my_custom_pattern')) {
    filePath = filePath.replace('my_custom_pattern', 'my-custom-pattern');
  }
  return filePath;
}
```

## Testing

After importing, test the data in your browser:

1. Open `http://localhost:8080/_site/index.html` (or your deployed URL)
2. Search for materials from your new data
3. Click "View Details" and check the structure selector
4. Verify that you can switch between different structures (init, DFT, DPA-3, etc.)

## Quick Commands (Copy & Paste)

```bash
# Navigate to project
cd /workspaces/jkw-7element-alloy-database

# Fix both files at once
node scripts/fix-json-format.js /path/to/materials_intermetallic_0213.json materials_intermetallic_0213_fixed.json && \
node scripts/fix-json-format.js /path/to/materials_solid_solution_0213.json materials_solid_solution_0213_fixed.json && \
echo "✅ Both files fixed!"

# Validate both files
node scripts/validate-data.js materials_intermetallic_0213_fixed.json && \
node scripts/validate-data.js materials_solid_solution_0213_fixed.json && \
echo "✅ Validation passed!"

# Backup and merge
cp backend/data/materials_intermetallic.json backend/data/materials_intermetallic_backup.json && \
node scripts/merge-materials.js backend/data/materials_intermetallic.json materials_intermetallic_0213_fixed.json backend/data/materials_intermetallic_merged.json && \
echo "✅ Merge complete!"
```

## Need Help?

If you encounter issues:
1. Check the console output for specific error messages
2. Run with `--verbose` flag for detailed information
3. Review [SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md) for full documentation
4. Check [DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) for format specification

## Summary

Your workflow is now:
1. ✅ Run `fix-json-format.js` on your input files
2. ✅ Validate the fixed files
3. ✅ Merge with existing database
4. ✅ Deploy to frontend
5. ✅ Test in browser

The fix script is intelligent and will handle all the format issues we identified earlier automatically!
