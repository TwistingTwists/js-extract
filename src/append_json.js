
const fs = require('fs');

// Function to append a JS object to a JSON file
export function appendObjectToJsonFile(filePath, newObject) {
  try {
    // 1. Read the existing data from the file
    const data = fs.readFileSync(filePath);
    let jsonData = [];

    // 2. Parse the JSON data, handling empty files
    if (data.length > 0) {
      jsonData = JSON.parse(data);
    }

    // 3. Append the new object to the array
    jsonData.push(newObject);

    // 4. Convert the updated array back to JSON
    const updatedJsonData = JSON.stringify(jsonData, null, 2); // Use null, 2 for pretty printing

    // 5. Write the updated JSON data back to the file
    fs.writeFileSync(filePath, updatedJsonData);

    console.log('-> to JSON file!');
  } catch (err) {
    console.error('Error appending to JSON file:', err);
  }
}


// Example test cases for appendObjectToJsonFile
// 1. Append a new object to an empty JSON file:
//    appendObjectToJsonFile('test.json', { id: 1, name: 'Alice' }); 
//    // Expected output: test.json will contain [{ "id": 1, "name": "Alice" }]

// 2. Append to an existing JSON file with data:
//    appendObjectToJsonFile('test.json', { id: 2, name: 'Bob' }); 
//    // Expected output: test.json will now contain 
//    // [{ "id": 1, "name": "Alice" }, { "id": 2, "name": "Bob" }]


export function customInterpolate(strings, ...values) {
  // Combine the strings and values
  let result = strings[0];
  for (let i = 0; i < values.length; i++) {
    result += values[i] + strings[i + 1];
  }

  // Replace ${...} with the actual values, but ignore those within backticks
  return result.replace(/\$\{(.*?)\}/g, (match, p1) => {
    try {
      // Only evaluate if not within backticks
      if (!/`[^`]*\$\{.*?\}[^`]*`/.test(result)) {
        return eval(p1);
      }
      return match;
    } catch (e) {
      return match; // If evaluation fails, return the original match
    }
  });
}


// Example test cases for customInterpolate
// let name = "John";
// let age = 30;

// 1. Basic string interpolation:
//    console.log(customInterpolate`My name is ${name} and I am ${age} years old.`); 
//    // Expected output: My name is John and I am 30 years old.

// 2. Interpolation within backticks should be ignored:
//    console.log(customInterpolate`This is a template literal: \`Name: ${name}, Age: ${age}\``);
//    // Expected output: This is a template literal: `Name: ${name}, Age: ${age}`

// 3. Handling invalid expressions:
//    console.log(customInterpolate`This is an invalid expression: ${(name + age}`); 
//    // Expected output: This is an invalid expression: ${(name + age} (the expression is not evaluated)



export function pickRandomFromJsonFileSync(filePath) {
  try {
    // Read the file synchronously
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Check if the parsed data is an array
    if (!Array.isArray(data)) {
      throw new Error('The JSON file does not contain an array of objects');
    }

    // Check if the array is empty
    if (data.length === 0) {
      throw new Error('The array in the JSON file is empty');
    }

    // Pick a random index
    const randomIndex = Math.floor(Math.random() * data.length);

    // Return the randomly selected object
    return data[randomIndex];

  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}




export function findDuplicateQuestions(filePath) {
  try {
    // Read the file synchronously
    const jsonData = fs.readFileSync(filePath, 'utf8');

    // Parse the JSON data
    const data = JSON.parse(jsonData);

    // Check if the parsed data is an array
    if (!Array.isArray(data)) {
      throw new Error('The JSON file does not contain an array of objects');
    }

    // Object to store questions and their occurrences
    const questionMap = new Map();

    // Array to store duplicate questions
    const duplicates = [];

    // Iterate through each object in the array
    data.forEach((obj, index) => {
      if (!obj.hasOwnProperty('question')) {
        console.warn(`Object at index ${index} does not have a 'question' property`);
        return;
      }

      const question = obj.question;

      if (questionMap.has(question)) {
        // If the question already exists, it's a duplicate
        if (questionMap.get(question).length === 1) {
          // If this is the second occurrence, add the first occurrence to duplicates
          duplicates.push(questionMap.get(question)[0]);
        }
        // Add this occurrence to duplicates
        duplicates.push(obj);
        // Add to the list of occurrences
        questionMap.get(question).push(obj);
      } else {
        // If it's a new question, add it to the map
        questionMap.set(question, [obj]);
      }
    });

    return duplicates;

  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}



export function removeDuplicateQuestions(filePath, duplicates) {
  try {
    // Read the original file
    const jsonData = fs.readFileSync(filePath, 'utf8');
    let data = JSON.parse(jsonData);

    // Check if the parsed data is an array
    if (!Array.isArray(data)) {
      throw new Error('The JSON file does not contain an array of objects');
    }

    // Create a Set of unique question strings from the duplicates
    const duplicateQuestions = new Set(duplicates.map(obj => obj.question));

    // Create a Set to keep track of questions we've seen
    const seenQuestions = new Set();

    // Filter the original data
    data = data.filter(obj => {
      if (!obj.hasOwnProperty('question')) {
        console.warn('Object does not have a "question" property:', obj);
        return true; // Keep objects without a question property
      }

      const question = obj.question;

      // If it's not a duplicate or it's the first time we're seeing this question, keep it
      if (!duplicateQuestions.has(question) || !seenQuestions.has(question)) {
        seenQuestions.add(question);
        return true;
      }

      // Otherwise, it's a duplicate we've seen before, so remove it
      return false;
    });

    // Write the filtered data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

    console.log(`Duplicates removed. File updated: ${filePath}`);
    return data;

  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}

