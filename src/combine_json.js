
const fs = require('fs');
const path = require('path');

function combineJsonFiles(folderPath) {
    const files = fs.readdirSync(folderPath).filter(file => path.extname(file) === '.json');
    const combinedData = [];

    for (const file of files) {
        const filePath = path.join(folderPath, file);

        try {
            const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

            // Check if data is null or empty array
            if (data === null || data.length === 0) {
                console.log(`Skipping file: ${filePath} (empty or null data)`);
                continue; // Skip to the next file
            }

            // Add filename and original path fields
            data.forEach(item => {
                item.originalPath = filePath;
            });

            combinedData.push(...data);
        } catch (error) {
            console.error(`Error reading or parsing file ${filePath}:`, error);
        }
    }

    return combinedData;
}


// Example usage
const folder = './files3';

const combinedData = combineJsonFiles(folder);
console.log('Combined JSON data:', JSON.stringify(combinedData, null, 2)); // Print nicely formatted JSON


// Save combined data to a new file (optional)
const outputFilename = 'combined_data.json';
fs.writeFileSync(path.join(folder, outputFilename), JSON.stringify(combinedData, null, 2));