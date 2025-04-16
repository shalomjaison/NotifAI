require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.API_KEY || 'AIzaSyAaUqQY75E_DETDtF4QW-U5v7VihDtc9IA';

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});

    const prompt = "Whisper sweet nothings to me like I am meaningful to u";

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log(text);
}

run();