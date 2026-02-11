# 目录结构更新说明 (Directory Structure Update)

**更新日期**: 2026-02-11  
**版本**: V2.2

---

## 📋 变更概述 (Change Summary)

为了支持同一材料来自不同计算方法（DFT、DPA-1、DPA-3、MD、实验等）的结构文件，在原有目录结构中增加了**数据源子目录**层级。

To support structure files from different calculation methods (DFT, DPA-1, DPA-3, MD, Experiment) for the same material, a **data source subdirectory** level has been added to the original directory structure.

---

## 🔄 结构对比 (Structure Comparison)

### ❌ 旧结构 (Old Structure)

```
data/intermetallic/mp-bbgt/
├── POSCAR              # 只能有一个来源的POSCAR
├── rdf.dat             
└── stress_strain.dat   
```

**问题 (Problem)**: 
- 无法同时存储来自DFT、DPA-1、DPA-3等不同方法的结构文件
- Cannot store structure files from different methods (DFT, DPA-1, DPA-3, etc.) simultaneously

### ✅ 新结构 (New Structure)

```
data/intermetallic/mp-bbgt/
├── DFT/                      # DFT计算结果
│   ├── POSCAR                # DFT弛豫结构
│   ├── rdf.dat               # DFT计算的RDF
│   └── stress_strain.dat     # DFT计算的应力-应变
├── DPA-1/                    # DPA-1模型结果（可选）
│   ├── POSCAR                # DPA-1生成的结构
│   └── rdf.dat               # DPA-1的RDF
└── DPA-3/                    # DPA-3模型结果（可选）
    ├── POSCAR                # DPA-3生成的结构
    └── rdf.dat               # DPA-3的RDF
```

**优势 (Advantages)**:
- ✅ 支持多数据源并存 (Support multiple data sources)
- ✅ 清晰区分数据来源 (Clear data source distinction)
- ✅ 便于数据对比分析 (Easy for data comparison)
- ✅ 易于扩展新的数据源 (Easy to add new data sources)

---

## 📁 支持的数据源目录 (Supported Data Source Directories)

| Directory | 含义 (Meaning) | 用途 (Usage) |
|-----------|---------------|-------------|
| `DFT/` | Density Functional Theory | DFT计算的结构和性能数据 |
| `DPA-1/` | Deep Potential Model Gen 1 | DPA-1模型生成的数据 |
| `DPA-3/` | Deep Potential Model Gen 3 | DPA-3模型生成的数据 |
| `MD/` | Molecular Dynamics | 分子动力学模拟数据 |
| `Experiment/` | Experimental Measurement | 实验测量数据 |

**扩展性**: 可根据需要添加其他数据源目录（如 `AIMD/`, `ML-Model/` 等）

**Extensibility**: Other data source directories can be added as needed (e.g., `AIMD/`, `ML-Model/`, etc.)

---

## 📝 路径更新示例 (Path Update Examples)

### POSCAR文件路径 (POSCAR File Paths)

| 旧路径 (Old) | 新路径 (New) |
|-------------|-------------|
| `data/intermetallic/mp-bbgt/POSCAR` | `data/intermetallic/mp-bbgt/DFT/POSCAR` |
| `data/solid-solution/custom-001/POSCAR` | `data/solid-solution/custom-001/DFT/POSCAR` |
| `data/amorphous/sample-01/POSCAR` | `data/amorphous/sample-01/MD/POSCAR` |

### RDF文件路径 (RDF File Paths)

| 旧路径 (Old) | 新路径 (New) |
|-------------|-------------|
| `data/intermetallic/mp-bbgt/rdf.dat` | `data/intermetallic/mp-bbgt/DFT/rdf.dat` |
| - | `data/intermetallic/mp-bbgt/DPA-3/rdf.dat` (新增) |

### JSON中的路径引用 (Path References in JSON)

**旧格式 (Old)**:
```json
{
  "poscar": "data/intermetallic/mp-bbgt/POSCAR",
  "data": [
    {
      "properties": {
        "structure": {
          "rdf": "data/intermetallic/mp-bbgt/rdf.dat"
        }
      }
    }
  ]
}
```

**新格式 (New)**:
```json
{
  "poscar": "data/intermetallic/mp-bbgt/DFT/POSCAR",
  "poscar_source": "DFT relaxation",
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "properties": {
        "structure": {
          "rdf": "data/intermetallic/mp-bbgt/DFT/rdf.dat"
        }
      }
    },
    {
      "temperature": 0,
      "source": "DPA-3",
      "properties": {
        "structure": {
          "rdf": "data/intermetallic/mp-bbgt/DPA-3/rdf.dat"
        }
      }
    }
  ]
}
```

---

## 🔧 迁移指南 (Migration Guide)

### 对于现有数据 (For Existing Data)

如果您有现有的数据文件需要迁移到新结构：

If you have existing data files that need to be migrated to the new structure:

```bash
# 示例：迁移mp-bbgt的文件
# Example: Migrate files for mp-bbgt

# 1. 创建DFT子目录
mkdir -p data/intermetallic/mp-bbgt/DFT

# 2. 移动文件
mv data/intermetallic/mp-bbgt/POSCAR data/intermetallic/mp-bbgt/DFT/
mv data/intermetallic/mp-bbgt/rdf.dat data/intermetallic/mp-bbgt/DFT/
mv data/intermetallic/mp-bbgt/stress_strain.dat data/intermetallic/mp-bbgt/DFT/

# 3. 更新JSON文件中的路径
# Update paths in JSON file (手动编辑或使用脚本)
```

### 对于新数据 (For New Data)

添加新材料时，直接使用新结构：

When adding new materials, use the new structure directly:

```bash
# 创建带数据源子目录的材料目录
mkdir -p data/intermetallic/mp-xxxxx/DFT

# 添加文件
cp structure.vasp data/intermetallic/mp-xxxxx/DFT/POSCAR
cp rdf.txt data/intermetallic/mp-xxxxx/DFT/rdf.dat

# 如果有多个数据源
mkdir -p data/intermetallic/mp-xxxxx/DPA-3
cp dpa3_structure.vasp data/intermetallic/mp-xxxxx/DPA-3/POSCAR
```

---

## 📖 更新的文档 (Updated Documents)

本次变更已同步更新以下文档：

The following documents have been updated with this change:

- ✅ [docs/DIRECTORY_STRUCTURE.md](DIRECTORY_STRUCTURE.md) - 目录结构指南
- ✅ [USER_GUIDE_EN.md](../USER_GUIDE_EN.md) - 英文用户指南
- ✅ [USER_GUIDE_CN.md](../USER_GUIDE_CN.md) - 中文用户指南
- ✅ [README.md](../README.md) - 项目说明文件
- ✅ [example-template-v2.csv](../example-template-v2.csv) - CSV模板示例

---

## ❓ 常见问题 (FAQ)

### Q1: 必须使用子目录吗？
**A1**: 是的，从V2.2版本开始，所有新数据必须使用数据源子目录结构。

**Q1: Is the subdirectory structure mandatory?**  
**A1**: Yes, starting from V2.2, all new data must use the data source subdirectory structure.

### Q2: 如果只有一个数据源，也需要子目录吗？
**A2**: 是的，即使只有一个数据源（如DFT），也应该使用子目录以保持结构一致性。

**Q2: Do I need subdirectories if I only have one data source?**  
**A2**: Yes, even with only one data source (e.g., DFT), you should use subdirectories to maintain structural consistency.

### Q3: 可以自定义数据源目录名吗？
**A3**: 建议使用标准名称（DFT、DPA-1、DPA-3、MD、Experiment），但如有特殊需要可以使用自定义名称（如AIMD、QMC等），需在poscar_source字段中描述。

**Q3: Can I use custom data source directory names?**  
**A3**: Standard names (DFT, DPA-1, DPA-3, MD, Experiment) are recommended, but custom names (e.g., AIMD, QMC) can be used if necessary, with description in the poscar_source field.

### Q4: 已有数据会受影响吗？
**A4**: 现有数据库中的链接需要更新以匹配新结构。建议使用脚本批量更新路径。

**Q4: Will existing data be affected?**  
**A4**: Links in the existing database need to be updated to match the new structure. It is recommended to use scripts for batch path updates.

---

## 🔗 相关链接 (Related Links)

- [Directory Structure Guide](DIRECTORY_STRUCTURE.md)
- [User Guide (EN)](../USER_GUIDE_EN.md)
- [User Guide (CN)](../USER_GUIDE_CN.md)
- [Data Structure V2](DATA_STRUCTURE_V2.md)

---

**更新日志 (Update Log)**:
- 2026-02-11: 初始版本，新增数据源子目录层级
- 2026-02-11: Initial version, added data source subdirectory level
