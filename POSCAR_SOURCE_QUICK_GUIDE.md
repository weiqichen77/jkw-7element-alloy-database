# POSCAR 构型来源标注功能 - 快速指南

## 功能说明

新增功能允许用户标注POSCAR构型文件的数据来源。当材料有多个数据源时（如DFT、DPA-3等），可以明确说明POSCAR构型来自哪个数据源。

## 快速使用

### 1. CSV模板中的新列

在 `example-template-v2.csv` 中新增了 `poscar_source` 列：

```csv
name,source,type,composition,poscar,temperature,data_source,poscar_source,density,...
Al2Cu4,Wang Lab,solid-solution,Al2Cu4,data/poscar/al2cu4.vasp,0,DFT,DFT,7.85,...
Al2Cu4,Wang Lab,solid-solution,Al2Cu4,data/poscar/al2cu4.vasp,0,DPA-3,DFT,7.83,...
```

**说明**：
- 第一行：DFT数据，POSCAR来自DFT → `poscar_source=DFT`
- 第二行：DPA-3数据，POSCAR来自DFT → `poscar_source=DFT`

### 2. 转换为JSON

使用现有脚本即可：
```bash
node scripts/convert-data-v2.js your-data.csv output.json
```

生成的JSON将包含：
```json
{
  "data": [
    {
      "temperature": 0,
      "source": "DFT",
      "poscarSource": "DFT",
      "properties": {...}
    },
    {
      "temperature": 0,
      "source": "DPA-3",
      "poscarSource": "DFT",
      "properties": {...}
    }
  ]
}
```

### 3. 网页显示效果

用户在网页上查看材料时会看到：

**Material Information 部分**：
```
Structure File: View POSCAR (Source: DFT)
```

**Data Sources 部分**：
```
0K - DFT: DFT
0K - DPA-3: DPA-3 (POSCAR from DFT)  ← 自动标注差异
300K - DFT: DFT
```

## 使用场景示例

### 场景1：四组不同方法的数据
```csv
Material-X,Lab-A,solid-solution,Al2Cu4,data/poscar/x.vasp,0,DFT,DFT,7.85,...
Material-X,Lab-A,solid-solution,Al2Cu4,data/poscar/x.vasp,0,DPA-3 final,DFT,7.83,...
Material-X,Lab-A,solid-solution,Al2Cu4,data/poscar/x.vasp,0,DPA-1_251208,DFT,7.84,...
Material-X,Lab-A,solid-solution,Al2Cu4,data/poscar/x.vasp,0,DPA-1_260109,DFT,7.82,...
```

网页会显示：
- DFT: DFT
- DPA-3 final: DPA-3 final (POSCAR from DFT)
- DPA-1_251208: DPA-1_251208 (POSCAR from DFT)
- DPA-1_260109: DPA-1_260109 (POSCAR from DFT)

### 场景2：实验+计算数据
```csv
Material-Y,Lab-B,element,Ni1,data/poscar/ni.vasp,0,DFT,DFT,8.90,...
Material-Y,Lab-B,element,Ni1,data/poscar/ni.vasp,300,Experiment,DFT,8.85,...
```

网页会显示：
- 0K - DFT: DFT
- 300K - Experiment: Experiment (POSCAR from DFT)

## 关键点

1. **可选字段**：如果不填写 `poscar_source`，不影响数据使用
2. **建议使用**：当有多个数据源时，建议填写以提高数据透明度
3. **向后兼容**：现有数据无需修改，自动兼容
4. **显示智能**：只有当POSCAR来源与数据来源不同时，才显示差异标注

## 相关文档

详细文档请参考：
- `POSCAR_SOURCE_UPDATE.md` - 完整更新说明
- `DATA_UPLOAD_GUIDE.md` - 数据上传指南
- `docs/DATA_STRUCTURE_V2.md` - 数据结构说明

## 测试

测试已通过：
- ✅ CSV转换正确
- ✅ JSON结构正确
- ✅ 网页显示正确
- ✅ 向后兼容性测试通过

---

更新日期：2026-02-03
