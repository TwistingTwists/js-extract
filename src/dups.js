import { findDuplicateQuestions, removeDuplicateQuestions } from "./append_json";
const fs = require('fs');

const filePath = "cleaned_combined_mh_questions.json";

// const output_file = "cleaned_combined_mh_questions.json";
// const duplicates = findDuplicateQuestions( output_file);

// const duplicates = findDuplicateQuestions(filePath);

function countJSONObjects(filePath) {
    try {
        const jsonData = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(jsonData);
        if (Array.isArray(data)) {
            return data.length;
        } else {
            throw new Error('The JSON file does not contain an array of objects');
        }
    } catch (error) {
        console.error('Error counting JSON objects:', error.message);
        return null;
    }
}


// Count original number of objects
const originalCount = countJSONObjects(filePath);
if (originalCount === null) {
    console.error('Failed to count original objects. Exiting.');
    process.exit(1);
}

console.log('Original number of JSON objects:', originalCount);

// Find duplicates
const duplicates = findDuplicateQuestions(filePath);

if (duplicates) {
    console.log('Number of duplicate objects found:', duplicates.length);

    // Remove duplicates
    const updatedData = removeDuplicateQuestions(filePath, duplicates);

    if (updatedData) {
        console.log('Final number of objects after removing duplicates:', updatedData.length);
        console.log('Number of objects removed:', originalCount - updatedData.length);


        const output_file = "final_cleaned_mh.json"

        fs.writeFileSync(output_file, updatedData);

    } else {
        console.error('Failed to remove duplicates.');
    }
} else {
    console.log('No duplicates found or failed to find duplicates.');
}


// if (duplicates) {
//   console.log('Number of duplicates found:', duplicates.length);
//   const updatedData = removeDuplicateQuestions(filePath, duplicates);
//   if (updatedData) {
//     console.log('Number of entries after removing duplicates:', updatedData.length);
//   }
// }