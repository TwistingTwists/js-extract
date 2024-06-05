const { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } = require("@google/generative-ai");
// import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";

const fs = require('fs').promises;
const path = require("path");
import { delay } from "./utils";
// const { delay } = require("./utils");
// import { PolyfillTextDecoderStream } from './polyfill.ts'



// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function gemini_run(text_file_path) {
    console.log(text_file_path)
    const text_file_content = await fs.readFile(text_file_path, 'utf-8');
    const system_prompt = "you are an expert educator.  Making students learn concepts progressively is your expertise. You break down a concept in sub-concepts (or subtopics) in increasing level of difficulty.";


    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 5,
        maxOutputTokens: 8192,
        responseMimeType: "text/plain",
    };


    const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
     ];
     


    // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)

    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash",
        systemInstruction: system_prompt,
        safetySettings: safetySettings

    });


    
    const chatSession = model.startChat({
        history: [
            {
                role: "user",
                parts: [{ text: "I will give you a text file related to a chapter." }],
            },
            {
                role: "model",
                parts: [{ text: "Great to hear that. What would you like to know?" }],
            },
        ],
        generationConfig: generationConfig
    });


    const prompts = [
        `
        ${text_file_content}
        
        ----- 
        From the text file above, 
        Identify the main concepts to be taught to the studetns. 
        Only list the main concepts and subconcepts (as subtopics) . do not add any descrption around it.
        nest subtopics and topics.
        `,
        `make 10 MCQs (multiple choice questions) from the above chapter. Highlight the topic name MCQ belongs to. also, write correct answer with one line explanation after the answer.`,
        "Make 10 more", // Add more prompts here
    ];

    const outputDir = path.dirname(text_file_path);
    // Get the file name without the extension
    const fileNameWithoutExtension = path.basename(text_file_path, path.extname(text_file_path));


    // Loop through prompts and write responses to a file
    for (let i = 0; i < prompts.length; i++) {
        const prompt = prompts[i];
        if (i !== 0) {
            console.log(`Prompt ${i + 1}: ${prompt}\n`);
        }

        let result_text = '';
        var stream = false;
        let currentMessage = prompt;
        console.log("STREAMING NOW")
        if (stream) {
            const result = await chatSession.sendMessageStream(currentMessage);
            console.log("STREAM result ".result);

            for await (const chunk of result.stream) {
            console.log(chunk);

            const chunkText = chunk.text();
            console.log(chunkText);
            result_text += chunkText;
            }

        //   for await (const item of result.stream) {
        //         console.log(">> ", item.candidates[0].content.parts[0].text);
        //     } 
        //     const aggregatedResponse = await result.response;
        //     result_text += aggregatedResponse.text();
        } else {
            const result = await chatSession.sendMessage(currentMessage);
            result_text += result.response.text();
            console.log(result_text);
            console.log("----------------------"); // Separate responses
        }
      
        // const result = await chat.sendMessage(prompt);
        // const response = await result.response;
        // const text = response.text();
        
        // Write the response to a file

        const outputFileName = `${fileNameWithoutExtension}-${i + 1}.txt`;
        const outputFilePath = path.join(outputDir, outputFileName);

        await fs.writeFile(outputFilePath, result_text);

        await delay(1600); 
    }

}


// run("./ix-sst/iess401.txt");


