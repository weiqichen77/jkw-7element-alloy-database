#!/usr/bin/env bash

set -euo pipefail

root_dir=${1:-$(pwd)}

processed=0
skipped=0

process_file() {
  local rdf_file=$1
  local tmp_file
  local first_line

  IFS= read -r first_line < "$rdf_file" || true

  if [[ ${first_line:-} != "# Time-averaged data for fix rdf_final_eq" ]]; then
    printf 'Skip already processed or unsupported format: %s\n' "$rdf_file" >&2
    skipped=$((skipped + 1))
    return
  fi

  tmp_file=$(mktemp)

  awk '
    BEGIN {
      block_count = 0
      header_line = "# r avg_1"
      expected_rows = 0
    }

    /^#/ {
      if ($2 == "Row") {
        if (NF == 5) {
          header_line = "# r(A) g(r)_avg coord_avg"
        } else {
          header_line = "# r(A)"
          for (i = 4; i <= NF; ++i) {
            header_line = header_line " " $i "_avg"
          }
        }
      }
      next
    }

    NF == 2 {
      block_count++
      current_rows = $2 + 0
      if (expected_rows == 0) {
        expected_rows = current_rows
      } else if (current_rows != expected_rows) {
        printf("Inconsistent row count in %s\n", FILENAME) > "/dev/stderr"
        exit 1
      }
      current_row = 0
      next
    }

    NF >= 3 {
      current_row++
      if (current_row > expected_rows) {
        printf("Too many rows in block in %s\n", FILENAME) > "/dev/stderr"
        exit 1
      }

      if (block_count == 1) {
        field_count = NF
      } else if (NF != field_count) {
        printf("Inconsistent column count in %s\n", FILENAME) > "/dev/stderr"
        exit 1
      }

      radius[current_row] = $2
      for (i = 3; i <= NF; ++i) {
        sums[current_row, i] += $i
      }
      next
    }

    {
      printf("Unsupported line in %s: %s\n", FILENAME, $0) > "/dev/stderr"
      exit 1
    }

    END {
      if (block_count == 0 || expected_rows == 0) {
        printf("No RDF blocks found in %s\n", FILENAME) > "/dev/stderr"
        exit 1
      }

      print header_line
      for (row = 1; row <= expected_rows; ++row) {
        printf("%.8f", radius[row])
        for (col = 3; col <= field_count; ++col) {
          printf(" %.8f", sums[row, col] / block_count)
        }
        printf("\n")
      }
    }
  ' "$rdf_file" > "$tmp_file"

  mv "$tmp_file" "$rdf_file"
  processed=$((processed + 1))
  printf 'Processed %s\n' "$rdf_file"
}

while IFS= read -r rdf_file; do
  process_file "$rdf_file"
done < <(find "$root_dir" -type f -name 'rdf.txt' | sort)

printf 'Processed %d files, skipped %d files.\n' "$processed" "$skipped"
