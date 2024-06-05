const fs = require('fs');


function listSubfolders(folderPath) {
    try {
        const subfolders = fs.readdirSync(folderPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        return subfolders; // Return the subfolders array
    } catch (error) {
        //   console.error(`Error listing subfolders: ${error.message}`);
        return []; // Return an empty array if an error occurs
    }
}


function combineAndCleanTextFiles(folderPath) {
    const textFiles = fs.readdirSync(folderPath)
        .filter(file => file.endsWith('.txt'));

    let combinedText = '';

    textFiles.forEach(file => {
        const filePath = `${folderPath}/${file}`;
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const cleanedContent = fileContent.replace(/ - Confidence: [0-9]+\.[0-9]+$/gm, '');
        combinedText += cleanedContent;
    });

    return combinedText;
}



function processSubfolders(folderPath) {
    const subfolders = listSubfolders(folderPath);

    subfolders.forEach(subfolder => {
        const subfolderPath = `${folderPath}/${subfolder}`;
        const combinedCleanedText = combineAndCleanTextFiles(subfolderPath);


        // Write combined text to a file
        const outputFilePath = `${subfolderPath}_combined.txt`;
        fs.writeFileSync(outputFilePath, combinedCleanedText);
        console.log(`Combined and cleaned text saved to: ${outputFilePath}`);

        console.log(`Combined and cleaned text from ${subfolder}:`);
        //   console.log(combinedCleanedText);
        // Or save it to a file, etc.
    });
}


const folderPath = '/home/abhishek/Downloads/files_with_txt_2_/files_with_txt/pdf/images'; // Replace with the actual folder path

processSubfolders(folderPath);