require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.API_KEY || 'AIzaSyAaUqQY75E_DETDtF4QW-U5v7VihDtc9IA';

const genAI = new GoogleGenerativeAI(API_KEY);

const geminiPromptController = async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});


        const userRequest = req.body.prompt;
        console.log("user's prompt:", userRequest)
    
        const prompt = `
        Analyze the following user request and extract the email Subject and Body.
        Format the output strictly as:
        Subject: [The extracted subject (you would have to determine whats in thesubject)]
        Body: [The extracted message body (you would have to determine whats in the body)]
    
        Do not include any other explanation or text.
    
        User Request: "${userRequest}"
        `;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);

        return res.status(200).json({ generatedText: text });


    }
    catch (error) {
        console.log("uh oh, error with gemini prompt")
        return res.status(500).json({ error: "rip"})
    }
}

module.exports = {
    geminiPrompt: geminiPromptController
}