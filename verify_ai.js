const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
require('dotenv').config();

async function test() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent("Hi");
        console.log("Success:", result.response.text());
    } catch (e) {
        fs.writeFileSync('error.log', JSON.stringify(e, null, 2) + "\n" + e.message);
        console.log("Error written to error.log");
    }
}

test();
