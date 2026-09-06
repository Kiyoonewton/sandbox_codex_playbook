#!/bin/bash
# Usage: ./flatten_files_json.sh /path/to/source /path/to/output ext1 [ext2 ext3 ...]
SOURCE_DIR="$1"
OUTPUT_DIR="$2"
shift 2
if [[ -z "$SOURCE_DIR" || -z "$OUTPUT_DIR" || "$#" -eq 0 ]]; then
  echo "Usage: $0 /path/to/source /path/to/output ext1 [ext2 ext3 ...]"
  echo "Example: $0 ./src ./flattened ts tsx js"
  exit 1
fi
# Resolve absolute paths
SOURCE_DIR=$(realpath "$SOURCE_DIR")
SOURCE_BASENAME=$(basename "$SOURCE_DIR")
# Ensure output directory exists first, then get absolute path
mkdir -p "$OUTPUT_DIR"
OUTPUT_DIR=$(realpath "$OUTPUT_DIR")
# Clean output directory
rm -rf "$OUTPUT_DIR"
mkdir -p "$OUTPUT_DIR"
# Initialize map file
MAP_FILE="$OUTPUT_DIR/map.json"
TEMP_MAP="$OUTPUT_DIR/.temp_map"
echo "{" > "$TEMP_MAP"
FIRST_ENTRY=true
# Build find expression for extensions
FIND_EXPR=""
for ext in "$@"; do
  if [[ -n "$FIND_EXPR" ]]; then
    FIND_EXPR+=" -o "
  fi
  FIND_EXPR+="-name '*.$ext'"
done
# Find matching files and flatten
eval "find \"$SOURCE_DIR\" -type f \( $FIND_EXPR \)" | while read -r file; do  # Relative path from source
  rel_path="${file#$SOURCE_DIR/}"
  full_key="${SOURCE_BASENAME}/${rel_path}"
  flat_name="${SOURCE_BASENAME}__${rel_path//\//__}"
  # Escape for JSON
  full_key_escaped=$(printf '%s' "$full_key" | sed 's/\\/\\\\/g; s/"/\\"/g')
  flat_name_escaped=$(printf '%s' "$flat_name" | sed 's/\\/\\\\/g; s/"/\\"/g')
  # Copy the file
  cp "$file" "$OUTPUT_DIR/$flat_name"
  # Append entry to temp map
  if [ "$FIRST_ENTRY" = true ]; then
    FIRST_ENTRY=false
  else
    echo "," >> "$TEMP_MAP"
  fi
  echo "  \"${full_key_escaped}\": \"${flat_name_escaped}\"" >> "$TEMP_MAP"
done
# Finalize map file
echo "" >> "$TEMP_MAP"
echo "}" >> "$TEMP_MAP"
mv "$TEMP_MAP" "$MAP_FILE"
echo ":white_check_mark: Files flattened to $OUTPUT_DIR"
echo ":white_check_mark: map.json written to $MAP_FILE"
# ./flatten_files_json.sh /path/to/source /path/to/output (extensions)
# ./flatten_files_json.sh ./src ./flattened ts tsx
# Flatten only .ts and .tsx files
# ./flatten_files_json.sh ./src ./flattened ts tsx
# Flatten .js, .jsx, .ts files
# ./flatten_files_json.sh ./src ./flattened js jsx ts