// const { gemini_run } = require("./conv-history.js");
import {run} from "./index";

async function runGemini() {
    let filePath = "";
    
    process.stdin.setEncoding('utf8');
    process.stdin.on('data', function(data) {
        filePath += data;
    });

    process.stdin.on('end', async function() {
        try {
            await run(filePath.trim());
            console.log("gemini_run completed successfully");
        } catch (error) {
            console.error("Error running gemini_run:", error);
        }
    });
}

runGemini();