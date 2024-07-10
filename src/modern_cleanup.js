/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 *
 * See the getting started guide for more information
 * https://ai.google.dev/gemini-api/docs/get-started/node
 */

const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const fs = require('fs');

import { removeCodeTicks } from "./parse_json";
import { appendObjectToJsonFile, customInterpolate, pickRandomFromJsonFileSync } from "./append_json"

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

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
]

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: "you are an expert data formatter. You can format daata into new shape as needed.",
    safetySettings
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
    // responseMimeType: 'application/json', // fails only if this option is sent. 

};


async function run(json_question, sample) {

    const newline_char = "`\n\n`";
    const single_newline_char = "`\n`";
    

    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings

        history: [
            {
                role: "user",
                parts: [
                    { text: customInterpolate `
                        "INPUT_TEXT: ${sample.question} \"\nINSTRUCTION:  . create ${newline_char} elements where new paragraph start. break lines using  ${single_newline_char} element. Keep a sentence in a line. If a sentence logically should not have newline characters, remove them. All choices in above Multiple choice question begin from one of the four letters a, b, c, d. Keep choices in new line. From the end of the string, there would be Answer: string. Remove that part if found."
                        Additionally, do not include any <br> tags or any other html tag in output.
                     `},
                ],
            },
            {
                role: "model",
                parts: [
                    { text: `OUTPUT:: ${sample.cleaned_question}\n` },
                ],
            },
            // {
            //     role: "user",
            //     parts: [
            //         { text: "use same instruction as above: \n\nINPUT: \"The members of the constituent assembly which drafted the\\nConstitution of India were\\na) Nominated\\nthe British Parliament.\\nb)Nominated by the Governor General:\\nc) Elected by the legislative assemblies of various provinces:\\nd)Elected by the Indian National Congress. Muslim League:\\nAnswer: (c) Elected by the legislative assemblies of various\\nprovinces\"\n\nOUTPUT: " },
            //     ],
            // },
            // {
            //     role: "model",
            //     parts: [
            //         { text: "```\nThe members of the constituent assembly which drafted the Constitution of India were\n\na) Nominated the British Parliament.\nb) Nominated by the Governor General:\nc) Elected by the legislative assemblies of various provinces:\nd) Elected by the Indian National Congress. Muslim League:\n\n```\n" },
            //     ],
            // },
        ],
    });

    const result = await chatSession.sendMessage(`
        \n---- \n above are examples.
         use same instruction as above:
        INPUT_TEXT: ${json_question.question} 
        OUTPUT:: `);
    const resulting_json = removeCodeTicks(result.response.text());

    // console.log(json_question.question);
    console.log(resulting_json);
    console.log("\n <<<<<<< ");

    return resulting_json;
}

async function read() {
    const output_file = "cleaned_combined_mh_questions.json";
    let data = JSON.parse(fs.readFileSync('./files3/combined_data_orig.json'));
    //   for (const item of data) {
    for (let i = 0; i < Object.keys(data).length; i++) {
        
        const sample =  pickRandomFromJsonFileSync(output_file);
        
        console.log(sample);
        console.log("\n\t >>>>>>>");

        const result_gemini = await run(data[i], sample);
        if (result_gemini === null) {
            console.warn(`Question ${data[i].question} could not be tagged.`);
        } else {
            Object.assign(data[i], { cleaned_question: result_gemini });

            // backup mechanism in case of failure

            appendObjectToJsonFile(output_file, data[i]);
        }

    }

    // fs.writeFileSync( output_file, JSON.stringify(data, null, 2));
}

read()
