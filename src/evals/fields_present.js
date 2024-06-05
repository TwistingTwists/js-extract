const fs = require('fs');

const combinedDataPath = './files3/combined_data.json'; // Path to your combined JSON file

// Read the combined data from the file
fs.readFile(combinedDataPath, 'utf-8', (err, data) => {
  if (err) {
    console.error("Error reading combined data file:", err);
    return;
  }

  const combinedData = JSON.parse(data);
  const requiredFields = ['question', 'choices', 'answer', 'topic', 'originalPath'];

  // Iterate through each object in the combined data
  for (let i = 0; i < combinedData.length; i++) {
    const obj = combinedData[i];
    const missingFields = [];

    // Check for missing fields using a loop
    for (const field of requiredFields) {
      if (!(field in obj)) {
        missingFields.push(field);
      }
    }

    if (missingFields.length > 0) {
      console.warn(`Object at index ${i} is missing the following fields: ${missingFields.join(', ')}`);
      console.warn(`${obj.originalPath} \n\n `);
    //   console.log(obj, "\n\n");
    }
  }
});