# Binary RDF Copy Rule

## Source Pattern

Scan files under:

```text
/gauss9/scratch1/cityu/chefan/run/lammps/calc/DPA/3.1/{potential}/annealing/*/*_{high_temp}_{low_temp}K/{anneal_speed}K_per_ns/*/*/{ele1}/{structure}_{ele1}_{ele2}_{num}0000_*/rdf.final_eq_*.txt
```

Variables:

- `{potential}`: potential directory name under `DPA/3.1`
- `{high_temp}`: the first temperature number in `*_{high_temp}_{low_temp}K`
- `{low_temp}`: the last temperature number in `*_{high_temp}_{low_temp}K`
- `{anneal_speed}`: directory name like `50000K_per_ns`
- `{ele1}`: element directory before the composition subdirectory
- `{structure}`: structure prefix in the composition directory, such as `fcc` (used only for parsing the source path)
- Composition tokens after `{structure}` are interpreted as chained substitutions from `ele1`
- Each substitution has the form `{ele1}_{other_ele}_{ratio}0000`
- The replacement is sequential: each step replaces `ratio%` of the remaining `ele1` with `other_ele`

## Destination Pattern

Copy each matched file to:

```text
{sorted_ele_dirs}/{potential}/{sorted_composition}/{high_temp}_{low_temp}K/{anneal_speed}K_per_ns/
```

The copied filename is always renamed to `rdf.txt`.

Rules:

- `sorted_ele_dirs`: all final elements sorted alphabetically and joined as directories, such as `Al/Cu/Zr`
- `sorted_composition`: final integer composition in the same alphabetic element order, such as `8_46_46`

## Example

Source:

```text
/gauss9/scratch1/cityu/chefan/run/lammps/calc/DPA/3.1/DPA3_7ele_cryfinal/annealing/14_14_14/2000_2000_1000K/50000K_per_ns/nose_hoover/sxx_0_syy_0_szz_0_sxy_0_sxz_0_syz_0/Cu/fcc_Cu_Zr_300000_100/rdf.final_eq_1000K.txt
```

Destination:

```text
Cu/Zr/DPA3_7ele_cryfinal/70_30/2000_1000K/50000K_per_ns/rdf.txt
```

Multi-element example:

Source composition directory:

```text
fcc_Cu_Zr_460000_Cu_Al_150000_100
```

Interpretation:

- First replace `46%` of `Cu` by `Zr`
- Then replace `15%` of the remaining `Cu` by `Al`
- Final composition is approximately `Al 8`, `Cu 46`, `Zr 46`

Destination:

```text
Al/Cu/Zr/DPA1_7ele_cry260226/8_46_46/2000_1100K/50000K_per_ns/rdf.txt
```

## Script

Use [copy_binary_rdf.sh](/gauss9/scratch1/cityu/chefan/run/lammps/jkw/dft_dpa_summary/data/amorphous/copy_binary_rdf.sh):

```bash
./copy_binary_rdf.sh
```

Optional arguments:

```bash
./copy_binary_rdf.sh <src_root> <dest_root>
```

Compatibility entrypoint [copy_cu_zr_rdf.sh](/gauss9/scratch1/cityu/chefan/run/lammps/jkw/dft_dpa_summary/data/amorphous/copy_cu_zr_rdf.sh) forwards to the same script.

## RDF Averaging

To average each copied `rdf.txt` inside subdirectories and overwrite the original file with the averaged result, use [average_binary_rdf.sh](/gauss9/scratch1/cityu/chefan/run/lammps/jkw/dft_dpa_summary/data/amorphous/average_binary_rdf.sh):

```bash
./average_binary_rdf.sh
```

Optional root directory:

```bash
./average_binary_rdf.sh <root_dir>
```

Behavior:

- Scan `root_dir` recursively for `rdf.txt`
- Skip files already in simplified averaged format
- Average all RDF blocks in each raw LAMMPS file
- Overwrite the original file in place

## RDF Plotting

To plot RDF files for quick checking, use [plot_binary_rdf.py](/gauss9/scratch1/cityu/chefan/run/lammps/jkw/dft_dpa_summary/data/amorphous/plot_binary_rdf.py):

```bash
python3 ./plot_binary_rdf.py
```

Optional root directory:

```bash
python3 ./plot_binary_rdf.py <root_dir>
```

Useful options:

```bash
python3 ./plot_binary_rdf.py . --output-dir binary_rdf_plots --overview binary_rdf_overview.png
```

Behavior:

- Support both raw LAMMPS block RDF files and already averaged RDF files
- Save one PNG per RDF file under `./binary_rdf_plots/`
- Save one overview figure as `./binary_rdf_overview.png` in the current directory

## Reusable Workflow

From this directory:

```bash
./copy_binary_rdf.sh
./average_binary_rdf.sh
python3 ./plot_binary_rdf.py
```
