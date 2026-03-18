#!/usr/bin/env bash

set -euo pipefail

src_root=${1:-/gauss9/scratch1/cityu/chefan/run/lammps/calc/DPA/3.1}
dest_root=${2:-$(pwd)}

copied=0
warned=0

calc_dest_layout() {
  local ele1=$1
  local comp_dir=$2
  local -a parts
  local structure
  local idx
  local base_ele
  local other_ele
  local ratio_token
  local delta
  local sum_floor
  local leftover
  local ele
  local extra_ele
  local elements_path
  local composition_path
  declare -A frac_units=()
  declare -A frac_floor=()
  declare -A frac_rem=()
  declare -A frac_int=()
  local -a sorted_eles=()

  IFS=_ read -r -a parts <<< "$comp_dir"

  if (( ${#parts[@]} < 5 )) || (( (${#parts[@]} - 2) % 3 != 0 )); then
    return 1
  fi

  structure=${parts[0]}
  frac_units["$ele1"]=1000000

  for ((idx = 1; idx < ${#parts[@]} - 1; idx += 3)); do
    base_ele=${parts[idx]}
    other_ele=${parts[idx + 1]}
    ratio_token=${parts[idx + 2]}

    if [[ $base_ele != "$ele1" ]] || [[ ! $ratio_token =~ ^[0-9]+$ ]]; then
      return 1
    fi

    delta=$(( frac_units["$ele1"] * ratio_token / 1000000 ))
    frac_units["$ele1"]=$(( frac_units["$ele1"] - delta ))
    frac_units["$other_ele"]=$(( ${frac_units["$other_ele"]:-0} + delta ))
  done

  mapfile -t sorted_eles < <(
    for ele in "${!frac_units[@]}"; do
      if (( frac_units["$ele"] > 0 )); then
        printf '%s\n' "$ele"
      fi
    done | sort
  )

  if (( ${#sorted_eles[@]} == 0 )); then
    return 1
  fi

  sum_floor=0
  for ele in "${sorted_eles[@]}"; do
    frac_floor["$ele"]=$(( frac_units["$ele"] / 10000 ))
    frac_rem["$ele"]=$(( frac_units["$ele"] % 10000 ))
    frac_int["$ele"]=${frac_floor["$ele"]}
    sum_floor=$(( sum_floor + frac_floor["$ele"] ))
  done

  leftover=$(( 100 - sum_floor ))
  if (( leftover < 0 )); then
    return 1
  fi

  while (( leftover > 0 )); do
    extra_ele=$(
      for ele in "${sorted_eles[@]}"; do
        printf '%05d %s\n' "${frac_rem["$ele"]}" "$ele"
      done | sort -r | awk 'NR==1 {print $2}'
    )
    frac_int["$extra_ele"]=$(( frac_int["$extra_ele"] + 1 ))
    frac_rem["$extra_ele"]=-1
    leftover=$(( leftover - 1 ))
  done

  printf -v elements_path '%s/' "${sorted_eles[@]}"
  elements_path=${elements_path%/}

  composition_path=
  for ele in "${sorted_eles[@]}"; do
    if [[ -n $composition_path ]]; then
      composition_path+=_
    fi
    composition_path+=${frac_int["$ele"]}
  done

  printf '%s\n%s\n%s\n' "$structure" "$elements_path" "$composition_path"
}

while IFS= read -r src_file; do
  rel=${src_file#"$src_root"/}
  layout_text=
  layout=()
  structure=
  elements_path=
  composition_path=

  if [[ ! $rel =~ ^([^/]+)/annealing/[^/]+/([^/]+)/([^/]+)/[^/]+/[^/]+/([^/]+)/([^/]+)/([^/]+)$ ]]; then
    printf 'Skip unmatched path: %s\n' "$src_file" >&2
    continue
  fi

  potential=${BASH_REMATCH[1]}
  temp_token=${BASH_REMATCH[2]}
  anneal_speed=${BASH_REMATCH[3]}
  ele1=${BASH_REMATCH[4]}
  comp_dir=${BASH_REMATCH[5]}
  file_name=${BASH_REMATCH[6]}

  if [[ ! $temp_token =~ ^([0-9]+)_.+_([0-9]+)K$ ]]; then
    printf 'Skip unmatched temperature token: %s\n' "$src_file" >&2
    continue
  fi

  high_temp=${BASH_REMATCH[1]}
  low_temp=${BASH_REMATCH[2]}

  if ! layout_text=$(calc_dest_layout "$ele1" "$comp_dir"); then
    printf 'Skip unmatched composition dir: %s\n' "$src_file" >&2
    continue
  fi

  mapfile -t layout <<< "$layout_text"

  if (( ${#layout[@]} != 3 )); then
    printf 'Skip invalid composition dir: %s\n' "$src_file" >&2
    continue
  fi

  structure=${layout[0]}
  elements_path=${layout[1]}
  composition_path=${layout[2]}
  dst_dir=$dest_root/$elements_path/$potential/$composition_path/${high_temp}_${low_temp}K/$anneal_speed
  dst_file=$dst_dir/rdf.txt

  mkdir -p "$dst_dir"

  if [[ -e $dst_file ]]; then
    printf 'Warn overwrite: %s <- %s\n' "$dst_file" "$src_file" >&2
    warned=$((warned+1))
  fi

  cp -f "$src_file" "$dst_file"
  copied=$((copied+1))
  printf '%s -> %s\n' "$src_file" "$dst_file"
done < <(find "$src_root" -type f -path '*/annealing/*/*K/*K_per_ns/*/*/*/*/rdf.final_eq_*.txt' | sort)

printf 'Copied %d files' "$copied"
if (( warned > 0 )); then
  printf ' with %d overwrite warnings' "$warned"
fi
printf '.\n'
