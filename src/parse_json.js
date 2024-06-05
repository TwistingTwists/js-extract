export function parseJsonWithMarker(input) {
    // Split the input string into lines
    const lines = input.split('\n');
    
    // Filter out lines that contain non-JSON markers
    const jsonLines = lines.filter(line => !line.trim().startsWith('```'));
    
    // Join the remaining lines to form a JSON string
    const jsonString = jsonLines.join('\n');
    
    try {
        // Parse the JSON string
        // console.log("jsonString",jsonString)
        const jsonObject = JSON.parse(jsonString);
        return jsonObject;
    } catch (error) {
        console.error("Invalid JSON string:", error);
        return null;
    }
}

// Example input
const input = `\`\`\`json
{"name": 1}
\`\`\``;

// const parsedObject = parseJsonWithMarker(input);
// console.log(parsedObject);
