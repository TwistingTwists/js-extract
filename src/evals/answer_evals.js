
async function matchJsonText(jsonFile, textFile) {
    try {
      console.log("jsonfile", jsonFile);
      const jsonData = JSON.parse(fs.readFileSync(jsonFile, 'utf-8'));
      const textContent = fs.readFileSync(textFile, 'utf-8');
  
      const answerCount = (textContent.match(/Answer:/g) || []).length; // Count "Answer:" instances
      const jsonObjectsWithAnswer = jsonData.filter(item => item.hasOwnProperty('answer')).length;
  
      const matchingAnswers = [];
  
      for (const item of jsonData) {
        const answer = item.answer;
        if (answer && textContent.includes(answer)) {
          matchingAnswers.push(answer);
        }
      }
  
      return {
        matchingAnswers,
        answerCount,
        jsonObjectsWithAnswer
      };
  
    } catch (error) {
      console.error("Error reading or processing files:", error);
      return {
        matchingAnswers: [],
        answerCount: 0,
        jsonObjectsWithAnswer: 0
      };
    }
  }


const fs = require('fs');
const path = require('path');
const glob = require('glob'); // You'll need to install glob: npm install glob

// function getFilesFromFolder(folderPath, globPattern) {
//     return new Promise((resolve, reject) => {
//         glob(path.join(folderPath, globPattern), (err, files) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 resolve(files);
//             }
//         });
//     });
// }

function getFilesFromFolderSync(folderPath, globPattern) {
    try {
        const files = glob.sync(path.join(folderPath, globPattern));
        return files;
    } catch (err) {
        console.error('Error finding files:', err);
        return [];
    }
}


const folder = "./files3"
const globy = "*.txt"

const files_list = getFilesFromFolderSync(folder, globy);
// console.log(files_list)



async function processFiles(folder, globy) {
    const files_list = getFilesFromFolderSync(folder, globy);


    for (const file of files_list) {
        // Assuming you want to match each JSON file with a corresponding text file
        const jsonFile = file.replace('.txt', '.json'); // Adjust this logic if your file naming is different

        try {
            const results = await matchJsonText(jsonFile, file);
            // console.log(`\nMatching answers for ${file}:`, matchingAnswers);
            console.log("Matching answers:", results.matchingAnswers);
            console.log("Number of 'Answer:' instances in text:", results.answerCount);
            console.log("Number of JSON objects with 'answer' key:", results.jsonObjectsWithAnswer);
        } catch (error) {
            console.error(`Error processing ${file}:`, error);
        }
    }
}



processFiles(folder, globy)
    .then(() => console.log('Finished processing files'))
    .catch(error => console.error('Error during processing:', error));
