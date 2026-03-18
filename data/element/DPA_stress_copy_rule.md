# DPA stress_info 复制规则

## 1) 源路径模板

```text
/gauss9/home/cityu/chefan/scratch/run/lammps/calc/DPA/3.1/{势能}/straining/{应变速率}/{温度}/nose_hoover/{应力文件夹名}/{元素}/{晶形}_{取向}/stress_info.dat
```

## 2) 目标路径模板

```text
./{元素}/{晶型}/{势能}/{温度小写}/strain/{晶向}/{应力文件夹名}.dat
```

> 说明：`温度小写` 通常按当前数据习惯写成 `298k`（即把 `298K` 转成小写）。

## 3) 字段映射

- `{势能}`：如 `DPA3_7ele_cryfinal`
- `{应变速率}`：如 `10_10_20`
- `{温度}`：如 `298K`
- `{应力文件夹名}`：如 `sxx_0_syy_0_szz_1.0e11_sxy_0_sxz_0_syz_0`
- `{元素}`：如 `Al`
- `{晶形}_{取向}`：如 `fcc_100`
  - `{晶型}` = `fcc`
  - `{晶向}` = `100`

## 4) 单文件示例

```bash
cp /gauss9/home/cityu/chefan/scratch/run/lammps/calc/DPA/3.1/DPA3_7ele_cryfinal/straining/10_10_20/298K/nose_hoover/sxx_0_syy_0_szz_1.0e11_sxy_0_sxz_0_syz_0/Al/fcc_100/stress_info.dat \
   ./Al/fcc/DPA3_7ele_cryfinal/298k/strain/100/sxx_0_syy_0_szz_1.0e11_sxy_0_sxz_0_syz_0.dat
```

## 5) 一句话规则

把 `stress_info.dat` 从

`.../{应力文件夹名}/{元素}/{晶形}_{取向}/stress_info.dat`

重命名复制到

`./{元素}/{晶型}/{势能}/{温度小写}/strain/{晶向}/{应力文件夹名}.dat`。
