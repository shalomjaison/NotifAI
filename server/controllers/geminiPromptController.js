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
        Your job is to write emails. If the user request is 
        unrelated to composing an email 
        (if the user is trying to start an unrelated conversation or if the
        user request does not contain the keyword "email"), 
        please kindly tell the user that they can only request assistance with emails.
        Analyze the following user request.  Write the email
        using your own generation if the user request does not provide enough context.
        If you did not deny the request,
        then format it strictly as:
        Subject:
        Body:

        Do not provide any further explanation or words.
    
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