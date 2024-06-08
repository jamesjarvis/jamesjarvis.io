#!/bin/bash

# Define the directories
source_directory="./content"
target_directory="./public"

# Check if source directory exists
if [ ! -d "$source_directory" ]; then
  echo "Source directory $source_directory does not exist."
  exit 1
fi

# Check if target directory exists
if [ ! -d "$target_directory" ]; then
  echo "Target directory $target_directory does not exist."
  exit 1
fi

# Find all image files in the source directory
jpg_files=$(find "$source_directory" -type f -name "*.png" -or -name "*.jpeg" -or -name "*.jpg" -or -name "*.JPG")

# Loop through each found file
for file in $jpg_files; do
  # Extract the base name of the file
  base_name=$(basename "$file")
  
  # Find and remove matching files in the target directory tree
  target_files=$(find "$target_directory" -type f -name "$base_name")
  
  for target_file in $target_files; do
    rm "$target_file"
    echo "Removed $target_file"
  done
done
