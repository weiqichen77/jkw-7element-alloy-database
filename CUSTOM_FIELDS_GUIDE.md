# Custom Fields Example

This file demonstrates how to use custom/unknown fields in your JSON data files.

## Why Use Custom Fields?

- Track internal metadata (lab IDs, experiment dates, researcher names)
- Add proprietary data specific to your organization
- Include experimental properties not in the standard schema
- Maintain forward compatibility with future schema versions

## How It Works

✅ **All unknown fields are preserved** - No errors will be thrown
✅ **Standard processing continues** - Required fields are still validated
✅ **Frontend compatible** - Web interface safely ignores unknown fields
✅ **Import/export safe** - Custom fields survive all processing steps

## Examples

### Example 1: Basic Custom Metadata

```json
{
  "name": "Al2Cu4 Sample",
  "source": "lab-2024-001",
  "type": "solid-solution",
  "composition": "Al2Cu4",
  "elements": ["Al", "Cu"],
  "atomCount": {"Al": 2, "Cu": 4},
  
  "customLabId": "EXP-12345",
  "researchGroup": "Materials Lab A",
  "projectCode": "PROJECT-2024-A",
  "sampleBatch": "BATCH-001",
  "priority": "high",
  
  "data": [...]
}
```

### Example 2: Researcher Information

```json
{
  "name": "Ni-Cu Alloy",
  "source": "custom-ni-cu-001",
  "type": "solid-solution",
  
  "metadata": {
    "date": "2026-02-13",
    "researcher": {
      "name": "Dr. Jane Smith",
      "email": "jane.smith@university.edu",
      "orcid": "0000-0001-2345-6789"
    },
    "institution": "University Materials Lab",
    "fundingSource": "NSF Grant #12345"
  },
  
  "elements": ["Ni", "Cu"],
  "atomCount": {"Ni": 12, "Cu": 12},
  "data": [...]
}
```

### Example 3: Experimental Notes

```json
{
  "name": "High-Entropy Alloy",
  "source": "hea-2024-003",
  "type": "solid-solution",
  
  "experimentalNotes": "Sample prepared using arc melting method",
  "synthesisMethod": "arc-melting",
  "annealingConditions": {
    "temperature": 1200,
    "duration": "4 hours",
    "atmosphere": "argon"
  },
  "qualityRating": "A",
  "sampleImages": [
    "images/sample-001-optical.jpg",
    "images/sample-001-sem.jpg"
  ],
  
  "composition": "AlNiCuZrNb",
  "elements": ["Al", "Ni", "Cu", "Zr", "Nb"],
  "data": [...]
}
```

### Example 4: Custom Properties in Data Entries

```json
{
  "name": "Test Material",
  "source": "test-001",
  "type": "intermetallic",
  "elements": ["Al", "Cu"],
  "atomCount": {"Al": 2, "Cu": 4},
  
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "poscar": "data/intermetallic/test-001/DFT/POSCAR",
      
      "computationalDetails": {
        "software": "VASP 6.3",
        "functional": "PBE",
        "kpoints": "8x8x8",
        "cutoffEnergy": 500,
        "convergenceCriteria": "1e-6"
      },
      "calculationTime": "48 hours",
      "hpcCluster": "Cluster-A",
      
      "properties": {
        "structure": {
          "density": 7.85,
          "latticeParameters": {...},
          
          "customQualityMetric": 0.95,
          "structureSource": "fully-optimized"
        },
        "customCategory": {
          "customProperty1": 123.45,
          "customProperty2": "some value"
        }
      }
    }
  ]
}
```

### Example 5: Internal Tracking Fields

```json
{
  "name": "Al-Ni Binary",
  "source": "mp-12345",
  "type": "intermetallic",
  
  "internalTracking": {
    "importDate": "2026-02-13",
    "importedBy": "data-team",
    "dataVersion": "v2.3",
    "verificationStatus": "verified",
    "lastModified": "2026-02-13T10:30:00Z",
    "changeHistory": [
      "2026-02-10: Initial import",
      "2026-02-13: Updated structure files"
    ]
  },
  
  "qualityControl": {
    "validated": true,
    "validatedBy": "Dr. Smith",
    "validationDate": "2026-02-12",
    "issues": []
  },
  
  "elements": ["Al", "Ni"],
  "atomCount": {"Al": 20, "Ni": 10},
  "data": [...]
}
```

## Best Practices

### ✅ DO:
- Use descriptive field names (camelCase recommended)
- Group related custom fields in nested objects
- Document your custom fields in your own documentation
- Keep custom fields consistent across similar materials
- Use standard JSON data types (string, number, boolean, object, array)

### ❌ DON'T:
- Overwrite standard required fields with custom data
- Use field names that conflict with future schema additions
- Store sensitive information in plain text
- Create excessively deep nesting (3-4 levels max recommended)

## Processing Workflow

```bash
# Your file with custom fields
node scripts/fix-json-format.js my_materials_with_custom_fields.json

# ✅ All custom fields are preserved
# ✅ Standard fields are fixed/normalized
# ✅ Validation only checks required fields
# ✅ Ready for import!
```

## Testing

You can test custom field preservation using the test script:

```bash
node scripts/test-unknown-fields.js
```

This will verify that:
- Top-level custom fields are preserved
- Nested custom objects are preserved
- Custom fields in data entries are preserved
- Custom fields in properties are preserved
- Custom property categories are preserved
- All required fields are still validated

## Notes

- The web frontend will not display custom fields (but they remain in the data)
- If you need to display custom data, you can create a custom view
- Custom fields are included when exporting data
- API queries can access custom fields programmatically

## Questions?

See:
- [DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md) - Standard schema documentation
- [SCRIPTS_REFERENCE.md](SCRIPTS_REFERENCE.md) - Script documentation
- [QUICK_FIX_GUIDE.md](QUICK_FIX_GUIDE.md) - Quick start guide
