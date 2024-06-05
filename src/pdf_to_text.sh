# #!/bin/bash

# # Function to convert PDF to text
# pdf_to_text() {
#   pdf_file_path="$1"

#   # Extract filename without extension
#   pdf_filename="${pdf_file_path%.*}"

#   # Extract base path for the PDF file
#   pdf_base_path="${pdf_file_path%/*}"


#   image_folder="${pdf_base_path}/images/'${pdf_filename}'"

#   # Create subdirectory for images using base path
#   mkdir -p "$image_folder"


#   # Convert PDF to images
#   pdftoppm -jpeg -jpegopt quality=100 -r 300 "${pdf_file_path}" "$image_folder/pg"
#   # images/"${pdf_filename}"/pg

#   # Loop through images in the directory and run OCR
#   for image_file in "$image_folder"/*.jpg; do
#     text_file="${image_file%.*}.txt"
#     echo "$image_filename"
#     easyocr -l en -f "${image_file}" --detail=1 --gpu=True > $text_file
#   done
# }

# # Example usage:
# pdf_to_text "/home/abhishek/Downloads/files_with_txt_2_/files_with_txt/pdf/Doc7_044dc9_.pdf"

source "$HOME/console.sh"

# Function to convert PDF to text
pdf_to_text() {
  pdf_file_path="$1"

  # Extract filename without extension
  pdf_filename=$(basename "$pdf_file_path" .pdf) 
  # pdf_filename="${pdf_file_path%.*}"

  # Extract base path for the PDF file
  pdf_base_path="${pdf_file_path%/*}"
  
  # log "pdf_base_path: ${pdf_base_path}"
  print_me pdf_base_path

  image_folder="${pdf_base_path}/images/$pdf_filename"

  # Create subdirectory for images using base path
  warn "Creating image directory: ${image_folder}"
  mkdir -p "$image_folder"

  # Convert PDF to images
  debug "Converting PDF to images: ${pdf_file_path}"
  pdftoppm -jpeg -jpegopt quality=100 -r 300 "${pdf_file_path}" "$image_folder/pg"

  # # Loop through images in the directory and run OCR
  # log "Running OCR on images: ${image_folder}"
  # for image_file in "$image_folder"/*.jpg; do
  #   text_file="${image_file%.*}.txt"
  #   image_filename="${image_file##*/}"
  #   debug "Processing image: ${image_filename}"
  #   # easyocr -l en -f "${image_file}" --detail=1 --gpu=True > "$text_file"
  #   log "Created text file: ${text_file}"
  # done
}

# Example usage:
# pdf_to_text "/home/abhishek/Downloads/files_with_txt_2_/files_with_txt/pdf/Doc7_044dc9_.pdf"



# Main script
input_directory="$1"

# Check if directory is provided
if [ -z "$input_directory" ]; then
  error "Error: Please provide the directory path as an argument."
  exit 1
fi

# # Find all PDF files in the directory
# find "$input_directory" -type f -name "*.pdf" -print0 |
#   xargs -0 -P 2 -n 1 bash -c 'pdf_to_text "$1"' --


# Iterate through all files in the directory
for file in "$input_directory"/*.pdf; do
  # Check if the file is a regular file (not a directory)
  if [ -f "$file" ]; then
    # Print the filename
    warn " $file"

    pdf_to_text $file
 
  fi
done