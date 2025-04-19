require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.API_KEY || 'AIzaSyAaUqQY75E_DETDtF4QW-U5v7VihDtc9IA';

const genAI = new GoogleGenerativeAI(API_KEY);

const geminiPromptController = async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
        
        // Extract chat history from the request body, defaults to empty array if not provided
        const chatHistory = req.body.history || [];

        //user's new prompt message from the request body
        const msg = req.body.prompt;

        // starting chat session with gemini model providing chat history
        const chat = model.startChat({
            history: chatHistory
        });

        // send user's msg
        const result = await chat.sendMessage(msg);

        // getting back gemini's response
        const response = await result.response;

        // extract generated text content from response
        const text = response.text();

        // send generated text back to client as JSON
        res.send({"generatedText":text});

    }
    catch (error) {
        console.log("uh oh, error with gemini prompt")
        return res.status(500).json({ error: "rip"})
    }
}

module.exports = {
    geminiPrompt: geminiPromptController
}