# Frontend User Guide

Quick guide for using the Alloy Materials Database web interface.

## Features

### Search
- **Search Box**: Enter any keyword to search materials
  - Material name (e.g., "Al3Zr3")
  - Composition (e.g., "Al", "Ni", "Cu")
  - Material ID (e.g., "mp-bbgt")
  - Element symbols (e.g., "Al-Ni")

- **Press Enter** or click **Search** to perform search
- Results appear instantly

### Data Display

#### Table View
| Column | Information |
|--------|------------|
| **No.** | Sequential number (1, 2, 3, ...) |
| **ID** | Material identifier (numeric or mp-xxxx format) |
| **Name** | Material composition name |
| **Type** | Classification (Binary, Ternary, Intermetallic, etc.) |
| **Elements** | List of constituent elements |
| **Density** | Material density in g/cm³ |
| **Details** | Click "View" to expand/collapse details |

#### Expandable Detail View
Click the "View" button to show material properties:

**Structure Properties**
- Lattice parameters: a, b, c (in Ångströms)
- Angles: α, β, γ (in degrees)
- Point group (if available)
- Density (g/cm³)

**Thermodynamic Properties** (if available)
- Formation energy (eV)
- Mixing enthalpy (eV)

**Mechanical Properties** (if available)
- Young's modulus (GPa)
- Bulk modulus (GPa)
- Shear modulus (GPa)
- Poisson's ratio

## Tips

1. **Search Tips**
   - Search is case-insensitive
   - Partial matches work: searching "Al" finds all Al-containing materials
   - Multiple word search: search "Al Ni" finds materials with both elements

2. **Viewing Details**
   - Only one material can be expanded at a time
   - Click another material to automatically collapse the previous one
   - Click "View" again to collapse without expanding another

3. **Data Interpretation**
   - "N/A" means data not available for that property
   - Lattice parameters are shown in Ångströms (10⁻¹⁰ m)
   - Elastic moduli are in GPa (10⁹ Pa)
   - Energies are in eV (electron volts)

4. **Large Datasets**
   - Page loads all materials by default
   - Search results count is displayed
   - Database updates when new materials are added

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Enter** | Perform search |
| **Click "View"** | Toggle detail expansion |

## Browser Compatibility

Works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## FAQ

**Q: Why is density showing "N/A"?**
A: Density is extracted from structure properties in the data file. Check that your JSON has the proper nested structure: `data[0].properties.structure.density`

**Q: Can I export search results?**
A: Currently the interface supports viewing and searching. Use browser developer tools (F12) to copy data.

**Q: Why can't I find a material I added?**
A: Ensure the JSON file is properly formatted and committed to the repository. GitHub Actions will deploy it automatically. Check the Actions tab to see deployment status.

**Q: How do I add more materials?**
A: See [DATA_UPLOAD_GUIDE.md](DATA_UPLOAD_GUIDE.md) for complete instructions.

## Contact & Issues

- For bug reports: Open an issue in the GitHub repository
- For feature requests: See [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)
- For data questions: See [DATA_INTEGRATION_GUIDE.md](docs/DATA_INTEGRATION_GUIDE.md)
