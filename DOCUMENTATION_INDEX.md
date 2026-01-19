# Documentation Index

Complete guide to all documentation and resources for the Alloy Materials Database.

## Getting Started

- **[QUICK_START.md](QUICK_START.md)** - Start here! Basic setup and first steps
- **[README.md](README.md)** - Project overview and features
- **[FRONTEND_USER_GUIDE.md](FRONTEND_USER_GUIDE.md)** - How to use the web interface

## Data Management

- **[DATA_UPLOAD_GUIDE.md](DATA_UPLOAD_GUIDE.md)** ⭐ **MAIN GUIDE FOR DATA IMPORT**
  - JSON file structure requirements
  - Directory organization
  - Upload process (3 methods)
  - Validation and verification
  - Troubleshooting

- **[docs/DATA_INTEGRATION_GUIDE.md](docs/DATA_INTEGRATION_GUIDE.md)** - Advanced data integration workflows
- **[docs/DATA_STRUCTURE_V2.md](docs/DATA_STRUCTURE_V2.md)** - Technical JSON schema details
- **[docs/SOURCE_FORMAT_GUIDE.md](docs/SOURCE_FORMAT_GUIDE.md)** - Original data format specifications

## Deployment & Technical

- **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** - GitHub Pages deployment instructions
- **[GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)** - GitHub Actions CI/CD configuration
- **[.github/workflows/deploy-pages.yml](.github/workflows/deploy-pages.yml)** - Automated deployment workflow

## Project Status

- **[PROJECT_STATUS.md](PROJECT_STATUS.md)** - Current development status
- **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** - High-level project information
- **[DATA_INTEGRATION_STATUS.md](DATA_INTEGRATION_STATUS.md)** - Data integration progress

## Fix Reports

- **[INTERMETALLIC_FIX_REPORT.md](INTERMETALLIC_FIX_REPORT.md)** - Report on fixing intermetallic materials import issue

## Directory Structure

```
jkw-7element-alloy-database/
├── 📘 Documentation Files
│   ├── README.md
│   ├── QUICK_START.md
│   ├── DEPLOYMENT_GUIDE.md
│   ├── GITHUB_PAGES_SETUP.md
│   ├── DATA_UPLOAD_GUIDE.md ⭐
│   ├── FRONTEND_USER_GUIDE.md
│   ├── DATA_INTEGRATION_STATUS.md
│   ├── PROJECT_STATUS.md
│   ├── PROJECT_SUMMARY.md
│   └── INTERMETALLIC_FIX_REPORT.md
│
├── 📁 docs/ (Advanced Documentation)
│   ├── API.md
│   ├── DATA_INTEGRATION_GUIDE.md
│   ├── DATA_STRUCTURE_V2.md
│   ├── IMPLEMENTATION_PLAN_V2.md
│   ├── SOURCE_FORMAT_GUIDE.md
│   ├── TESTING_CHECKLIST.md
│   ├── V2_USER_GUIDE.md
│   └── V2.1_UPDATE_NOTES.md
│
├── 📁 backend/
│   ├── api/
│   │   └── materials.js (API endpoints)
│   └── data/
│       ├── materials.json (100 regular alloys)
│       ├── materials_intermetallic.json (123 intermetallic compounds)
│       ├── poscar/ (crystal structure files)
│       └── rdf/ (radial distribution functions)
│
├── 📁 frontend/
│   ├── index.html (main web interface)
│   ├── css/ (stylesheets)
│   └── js/ (JavaScript code)
│
├── 📁 scripts/ (Data processing)
│   ├── convert-data.js
│   ├── merge-materials.js
│   ├── validate-data.js
│   ├── prepare-github-pages.js
│   └── ... (more utilities)
│
├── 📁 .github/workflows/
│   └── deploy-pages.yml (CI/CD automation)
│
└── 📁 _site/ (Deployment directory)
    ├── index.html
    ├── css/
    ├── js/
    └── data/
        └── materials.json (merged data)
```

## Quick Reference

### Most Important Files for New Users

1. **Start Here**: [QUICK_START.md](QUICK_START.md)
2. **Upload Data**: [DATA_UPLOAD_GUIDE.md](DATA_UPLOAD_GUIDE.md)
3. **Use Web Interface**: [FRONTEND_USER_GUIDE.md](FRONTEND_USER_GUIDE.md)
4. **Technical Details**: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

### File Locations

| Purpose | Path |
|---------|------|
| **View/Edit Materials** | `backend/data/materials.json` |
| **Add Intermetallic** | `backend/data/materials_intermetallic.json` |
| **Web Interface** | `frontend/index.html` |
| **Deployment Config** | `.github/workflows/deploy-pages.yml` |
| **All Documentation** | Root directory (*.md files) |

## Key Processes

### Adding New Materials

```
Prepare JSON file
    ↓
Validate with validate-data.js
    ↓
Replace/merge into backend/data/
    ↓
Commit & push to GitHub
    ↓
GitHub Actions automates deployment
    ↓
Website updates (1-2 minutes)
```

### Data Flow

```
materials.json (100 entries)
     ↓
Merged by prepare-github-pages.js
     ↓
materials_intermetallic.json (123 entries)
     ↓
_site/data/materials.json (223 total)
     ↓
Served by GitHub Pages
     ↓
Displayed by frontend/index.html
```

## Troubleshooting Guide

| Problem | Solution |
|---------|----------|
| Data not showing | Check [DATA_UPLOAD_GUIDE.md](DATA_UPLOAD_GUIDE.md#troubleshooting) |
| Website deployment stuck | Check [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md) |
| JSON validation errors | Run: `node scripts/validate-data.js your_file.json` |
| Search not finding materials | Ensure data is merged: check Actions tab |
| Frontend not loading | Check browser console (F12) for JavaScript errors |

## Contact & Support

- **GitHub Repository**: https://github.com/weiqichen77/jkw-7element-alloy-database
- **Live Demo**: https://weiqichen77.github.io/jkw-7element-alloy-database/
- **Issues**: Open a GitHub issue for bugs/features
- **Questions**: Check FAQ in relevant documentation file

## Version Info

- **Current Version**: 2.1
- **Last Updated**: 2024-01-19
- **Total Materials**: 223 (100 regular alloys + 123 intermetallic)
- **Database Status**: ✓ Active and Deployed

## Navigation Quick Links

| Feature | Document |
|---------|----------|
| "How do I start?" | [QUICK_START.md](QUICK_START.md) |
| "How do I upload data?" | [DATA_UPLOAD_GUIDE.md](DATA_UPLOAD_GUIDE.md) |
| "How do I use the website?" | [FRONTEND_USER_GUIDE.md](FRONTEND_USER_GUIDE.md) |
| "How is it deployed?" | [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) |
| "What's the project status?" | [PROJECT_STATUS.md](PROJECT_STATUS.md) |
| "How do I fix errors?" | [DATA_UPLOAD_GUIDE.md#troubleshooting](DATA_UPLOAD_GUIDE.md#troubleshooting) |

---

**Tip**: Use `Ctrl+F` or `Cmd+F` to search this page for keywords, or search on GitHub for file content.
