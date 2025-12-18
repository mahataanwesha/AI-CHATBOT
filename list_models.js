const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

async function list() {
    // There isn't a direct listModels in the high-level SDK helper, 
    // but we can access the underlying client or use a fetch.
    // Actually, checking docs, the GoogleGenerativeAI class doesn't expose listModels directly easily?
    // Wait, typically we don't list.

    // But let's try 'gemini-pro' again. The previous fail for gemini-pro was also 404?
    // See step 93: FAILED with gemini-pro: 404 Not Found.

    // This is very strange for a fresh key.
    // It suggests the API itself is not enabled for the project associated with the key.

    // I'll try to use a fetch to the list models endpoint to see what raw response we get.
    const key = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        console.log("Written models to models.json");
    } catch (e) {
        console.error(e);
    }
}

list();
