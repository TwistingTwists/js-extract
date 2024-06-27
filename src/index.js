/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const fs = require('fs').promises;
const path = require("path");

import { parseJsonWithMarker } from './parse_json';
import {redLog, blueLog, magentaLog, greenLog} from "./utils";

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } = require("@google/generative-ai");
  
  const apiKey = process.env.GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(apiKey);
  
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `
    you are an expert data formatter. 

    do not add any additional text. reply with the text as-it-is 

    your only job is to reformat the text in a different structure as asked. adhere to these guidelines will make you the best data formatter in the world. 

    For this use case: you can convert any data into valid json. please pay extra attention towards the start and end of the text document given to you.
    `,
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];
  
  export async function run(image_file_path) {
    // console.log(text_file_path)
    // const text_file_content = await fs.readFile(text_file_path, 'utf-8');
    // // const system_prompt = "you are an expert educator.  Making students learn concepts progressively is your expertise. You break down a concept in sub-concepts (or subtopics) in increasing level of difficulty.";

    // const chatSession = model.startChat({
    //   generationConfig,
    //   safetySettings,
    //   history: [
    //     {
    //       role: "user",
    //       parts: [
    //         {text: text_file_content},
    //         {text: "for the above text, create the json output needed is : "},
    //         {text: "{ question: <question_text> , choices: <possible choices present in the text>,  answer: <correct answer >} "},
    //         {text: `
    //         Do not include anything that is not mentioned in the text. 
    //         As an expert data manipulator, you have the skill to adhere strictly to the given text. High quality data transformation only involves changing the data in given format.
    //         do not generate any data. ONLY reformat the data in given schema.
    //         `},
    //         {text: "do include the text as-it-is. Keep the options / alphabets and numbers given in choices and the answer. These are important to match the correctness of the answer.  "},
    //       ],
          
    //     }
    //   ],
    // });
  
    const image_data = await fs.readFile(image_file_path);
    const base64_image = image_data.toString('base64');
    const data_url = `data:image/png;base64,${base64_image}`; // Assuming PNG format

    const chatSession = model.startChat({
      generationConfig,
      safetySettings,
      history: [
        {
          role: "user",
          parts: [
            {text: data_url},
            {text: "Extract the text from the image."},
          ],
        }
      ],
    });

    const result = await chatSession.sendMessage("Please extract the text.");
    const result_text = result.response.text();
    greenLog(result_text);

    // const result = await chatSession.sendMessage("Please generate valid json.");


    // const result_text = result.response.text();
    // greenLog(result_text);

    // save json as text file 
    const outputDir = path.dirname(image_file_path);
    const fileNameWithoutExtension = path.basename(image_file_path, path.extname(image_file_path));

    // const outputFileName = `${fileNameWithoutExtension}__json_maybe.txt`;
    // const outputFilePath = path.join(outputDir, outputFileName);
    // await fs.writeFile(outputFilePath, result_text);

    // parse json proper and then save it 
    const result_json = parseJsonWithMarker(result_text);


    const outputFileNameJSON = `${fileNameWithoutExtension}.json`;
    const outputFilePathJSON = path.join(outputDir, outputFileNameJSON);

    const jsonString = JSON.stringify(result_json, null, 2); // null and 2 are for formatting
    magentaLog(jsonString)

    await fs.writeFile(outputFilePathJSON, jsonString);

  }
  
  // run("./files/Doc7_0_.txt");