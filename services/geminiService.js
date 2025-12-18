const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

async function askHealthQuestion(question, languageName, history = []) {
    // If processing an image for Vax Card
    if (question.isImageScan && question.imagePart) {
        const imagePrompt = `Analyze this image. It appears to be a vaccination card or health document.
        Extract the following details if visible:
        1. Patient Name
        2. Vaccine Name
        3. Date of Dose 1
        4. Date of Dose 2 (or 'Pending')
        5. Next Due Date (if any)
        
        Output format: JSON object with keys: patientName, vaccineName, dose1Date, dose2Date, nextDueDate. 
        If not a readable card, return { "error": "Unreadable" }.`;

        const result = await model.generateContent([imagePrompt, question.imagePart]);
        const text = result.response.text();
        // naive extraction of JSON from text block
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) return { text: jsonMatch[0], isJson: true };
        return { text: text, isJson: false };
    }

    const chat = model.startChat({
        history: history,
        generationConfig: {
            maxOutputTokens: 500,
        },
    });

    const systemPrompt = `You are a helpful health assistant. 
    Language: Answer in ${languageName}.
    
    CRITICAL RULES:
    1. You must ONLY answer health-related queries. If the user asks about anything else (e.g., coding, general knowledge, movies, etc.), you must strictly refuse to answer and warn them to ask only health-related questions.
    2. NEVER prescribe medicines.
    3. Suggest only home remedies, preventive advice, and lifestyle changes.
    4. If the user describes symptoms that appear severe, life-threatening, or extreme (e.g., chest pain, breathing difficulty, severe bleeding, high fever in kids, unconsciousness), your VERY FIRST word in the response MUST be "SEVERE_SYMPTOM_DETECTED". Then briefly explain why it's severe and advise seeing a doctor immediately.
    5. Keep answers concise and SMS-friendly (under 160 words if possible).
    `;

    try {
        const result = await chat.sendMessage(systemPrompt + "\nUser Question: " + question);
        const response = result.response.text();

        let isSevere = false;
        let cleanResponse = response;

        if (response.includes("SEVERE_SYMPTOM_DETECTED")) {
            isSevere = true;
            cleanResponse = response.replace("SEVERE_SYMPTOM_DETECTED", "").trim();
        }

        return { text: cleanResponse, isSevere };
    } catch (error) {
        console.error("Gemini Error:", error);
        return { text: "Sorry, I am having trouble connecting to the health database right now.", isSevere: false };
    }
}

module.exports = { askHealthQuestion };
