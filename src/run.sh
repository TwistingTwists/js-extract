

# echo "./jess3dd/jess101.txt"| bun run src/run_once.js && echo "./jess3dd/jess102.txt"| bun run src/run_once.js  && echo "./jess3dd/jess103.txt"| bun run src/run_once.js && echo "./jess3dd/jess104.txt"| bun run src/run_once.js && echo "./jess3dd/jess105.txt"| bun run src/run_once.js && echo "./jess3dd/jess106.txt"| bun run src/run_once.js  
#  echo "files/Doc7_01fe74_.txt" | bun src/run_once.js && echo "files/Doc7_044dc9_.txt" | bun src/run_once.js 
#  echo "files/Doc7_0593ef_.txt" | bun src/run_once.js && echo "files/Doc7_068542_.txt" | bun src/run_once.js && echo "files/Doc7_0f35be_.txt" | bun src/run_once.js && echo "files/Doc7_0_.txt" | bun src/run_once.js && echo "files/Doc7_119e32_.txt" | bun src/run_once.js && echo "files/Doc7_1617df_.txt" | bun src/run_once.js && echo "files/Doc7_1a7f45_.txt" | bun src/run_once.js && echo "files/Doc7_1_.txt" | bun src/run_once.js && echo "files/Doc7_2_.txt" | bun src/run_once.js && echo "files/Doc7_3_.txt" | bun src/run_once.js && echo "files/Doc7_4_.txt" | bun src/run_once.js && echo "files/Doc7_523b44_.txt" | bun src/run_once.js && echo "files/Doc7_55f4f1_.txt" | bun src/run_once.js && echo "files/Doc7_5db9ef_.txt" | bun src/run_once.js && echo "files/Doc7_5_.txt" | bun src/run_once.js && echo "files/Doc7_6_.txt" | bun src/run_once.js && echo "files/Doc7_7b4be9_.txt" | bun src/run_once.js && echo "files/Doc7_7e86dd_.txt" | bun src/run_once.js && echo "files/Doc7_7_.txt" | bun src/run_once.js && echo "files/Doc7_8b4f6e_.txt" | bun src/run_once.js && echo "files/Doc7_8fb608_.txt" | bun src/run_once.js && echo "files/Doc7_8_.txt" | bun src/run_once.js && echo "files/Doc7_9a31ee_.txt" | bun src/run_once.js && echo "files/Doc7_9_.txt" | bun src/run_once.js && echo "files/Doc7_aa6671_.txt" | bun src/run_once.js && echo "files/Doc7_b41688_.txt" | bun src/run_once.js && echo "files/Doc7_bd8e30_.txt" | bun src/run_once.js && echo "files/Doc7_bfd108_.txt" | bun src/run_once.js && echo "files/Doc7_c35306_.txt" | bun src/run_once.js && echo "files/Doc7_cfead8_.txt" | bun src/run_once.js && echo "files/Doc7_d6a652_.txt" | bun src/run_once.js && echo "files/Doc7_eed970_.txt" | bun src/run_once.js && echo "files/Doc7_f9fbb3_.txt" | bun src/run_once.js && echo "files/Doc7.txt" | bun src/run_once.js 
 

export PDF_DIRECTORY="/home/abhishek/Downloads/files_with_txt_2_/files_with_txt/pdf/images"

source "$HOME/console.sh"

directory="./files3"

# Get all text files in the directory and store them in an array
text_files=("$directory"/*.txt)

# Get the top 2 text files from the array
top_text_files=("${text_files[@]}")
# top_text_files=("${text_files[@]:0:2}")


# Iterate over the top_text_files array and print each filename
# for file in "${top_text_files[@]}"; do
#     warn "$file"
#     echo "$file" | bun src/run_once.js
# done



for file in "${top_text_files[@]}"; do
 # Determine the corresponding .json filename
    json_file="${file%.txt}.json"

    debug $json_file
    # Check if the .json file exists
    if [ -e "$json_file" ]; then
        echo "Skipping $file as $json_file already exists."
    else
        warn "$file"
        echo "$file" | bun src/run_once.js
    fi
done
