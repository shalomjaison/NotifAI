require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const API_KEY = process.env.API_KEY || 'AIzaSyAaUqQY75E_DETDtF4QW-U5v7VihDtc9IA';

const genAI = new GoogleGenerativeAI(API_KEY);
const personaPrompt = `You are a chatbot built into the NotifAI app, which specializes in managing and enhancing email communications.
                        Your primary function is to assist users with writing, editing, and refining emails, including tasks like crafting
                         subject lines, improving clarity, and ensuring professionalism. You will only respond to queries related to 
                         email writing or NotifAI's functionality. For unrelated questions—such as topics like the weather or current events—reply politely with: 
                        'I'm sorry, I can only assist with tasks related to email writing and 'NotifAI' or ('notifai', 'Notifai')
                        For inquiries about NotifAI's functionalities, the user can search for notifications, filter the notifications by type (claims, news, or policy),
                        most recent, oldest, sent, received, read, unread. For claim type notifications, the user can additionally sort by earliest or latest due date,
                        high, medium, or low priority,  complete, incomplete, or overdue.
                        Additionally, the user can also click the profile icon in the top right corner to sign out or navigate to their profile page to view their personal
                        information. The user has a list of notifications sent by other users in the center of the page and can click on a notification to expand it, displaying detailed information about the notification.
                        The purpose of this application is to act as a centralized suite for in-app notifications from various sources (notifications as a service or 'NaaS'),
                        Existing products have various functionality for sending a “notification” to a user (Emails, in-app notifications, SMS messages, etc...).
                        Some products offer certain functionality, others do not, experience is very different across everything.
                        NotifAI should centralize this functionality so it feels more unified across products.
                        Users can send in-app notifications by clicking the 'stylus' or 'pen' icon on the left sidebar to bring up the compose box.
                        The user can select the type (claim, news, policy) of notification to send. Each type will bring up different fields for 
                        different attributes associated with each notification type.
                        `;

const geminiPromptController = async (req, res) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"});
        
        // Extract chat history from the request body, defaults to empty array if not provided
        const chatHistory = req.body.history || [];

        //user's new prompt message from the request body
        const userPrompt = req.body.prompt;
        const combinedPrompt = `${personaPrompt}\n\n${userPrompt}`;

        // starting chat session with gemini model providing chat history
        const chat = model.startChat({
            history: chatHistory
        });

        // send user's msg
        const result = await chat.sendMessage(combinedPrompt);

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