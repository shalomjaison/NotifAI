// tests/controllers/geminiPromptController.test.js

// --- Dependencies ---
const request = require('supertest');
const { app, startServer, stopServer } = require('../../server/server'); // Adjust path as needed
require('dotenv').config(); // Load .env variables like API_KEY

// --- Configuration & Constants ---
const API_ENDPOINT = '/genAI/gemini-prompt'; // Define the endpoint path here
// Set a longer timeout for Jest if needed for live API calls (e.g., 30 seconds)
// jest.setTimeout(30000);

// --- Test Suite Setup ---
beforeAll(async () => {
    // Allow time for any async setup during server start if necessary
    // await new Promise(resolve => setTimeout(resolve, 500));
    await startServer();
    console.log(`Server started for LIVE tests targeting ${API_ENDPOINT}.`);

    // Sanity check for API Key
    if (!process.env.API_KEY || !process.env.API_KEY.startsWith('AIza')) {
        console.warn(`\n\n[Warning] API_KEY environment variable not found or looks invalid. Live tests against ${API_ENDPOINT} will likely fail.\n`);
        // Optionally throw error to prevent running tests without a key:
        // throw new Error('API_KEY environment variable is required for live tests.');
    } else {
        console.log('API_KEY detected.');
    }
});

afterAll(async () => {
    stopServer();
    console.log(`Server stopped after LIVE tests for ${API_ENDPOINT}.`);
});

// --- Test Suite ---
describe(`POST ${API_ENDPOINT} (Live API)`, () => {

    test('should return 200 and generated text for a valid on-topic prompt', async () => {
        const payload = {
            prompt: "Suggest three professional subject lines for an email introducing myself to a potential client."
        };

        const response = await request(app)
            .post(API_ENDPOINT)
            .send(payload);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('generatedText');
        expect(typeof response.body.generatedText).toBe('string');
        expect(response.body.generatedText.length).toBeGreaterThan(0);
        console.log(`[Test: On-topic] Received (status ${response.status}): ${response.body?.generatedText?.substring(0, 80) || 'N/A'}...`);
    });

    test('should return 200 and the refusal message for an off-topic prompt', async () => {
        const payload = {
            prompt: "What is the current capital of Australia?"
        };
        // This expected text comes directly from the personaPrompt in your controller
        const expectedRefusalSubstring = "I'm sorry, I can only assist with topics related to NotifAI.";

        const response = await request(app)
            .post(API_ENDPOINT)
            .send(payload);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('generatedText');
        expect(response.body.generatedText).toContain(expectedRefusalSubstring);
        console.log(`[Test: Off-topic] Received (status ${response.status}): ${response.body?.generatedText}`);
    });

    test('should return 200 and generated text when valid history is provided', async () => {
        const payload = {
            prompt: "Rephrase the previous response to be more concise.",
            history: [
                { role: "user", parts: [{ text: "Explain the purpose of NotifAI." }] },
                { role: "model", parts: [{ text: "NotifAI acts as a centralized platform for managing various types of in-app notifications (news, policy, claims) to create a unified experience across different products." }] }
            ]
        };

        const response = await request(app)
            .post(API_ENDPOINT)
            .send(payload);

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('generatedText');
        expect(typeof response.body.generatedText).toBe('string');
        expect(response.body.generatedText.length).toBeGreaterThan(0);
        console.log(`[Test: With History] Received (status ${response.status}): ${response.body?.generatedText?.substring(0, 80) || 'N/A'}...`);
    });

    test('should return 200 and generated text when history field is omitted', async () => {
        const payload = {
            prompt: "How do I filter notifications in NotifAI?"
        };

        const response = await request(app)
            .post(API_ENDPOINT)
            .send(payload); // No history field

        // Assertions
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('generatedText');
        expect(typeof response.body.generatedText).toBe('string');
        expect(response.body.generatedText.length).toBeGreaterThan(0);
        console.log(`[Test: No History Sent] Received (status ${response.status}): ${response.body?.generatedText?.substring(0, 80) || 'N/A'}...`);
    });

    test('should handle potentially problematic prompts (e.g., empty string)', async () => {
        const payload = {
            prompt: "" // Empty prompt
        };

        const response = await request(app)
            .post(API_ENDPOINT)
            .send(payload);

        // Live API behavior might vary: could be 200 (with default reply), 400 (API error), or 500 (server error)
        expect([200, 400, 500]).toContain(response.status);
        console.log(`[Test: Empty Prompt] Received status: ${response.status}`);
        if (response.status === 200) {
            expect(response.body).toHaveProperty('generatedText');
        } else if (response.status === 500) {
            expect(response.body).toEqual({ error: "rip" }); // Check specific server error
        }
        // If 400, the body might contain specific API error details from Google
        console.log(`[Test: Empty Prompt] Received body:`, response.body);
    });

    test('should handle requests with missing prompt field', async () => {
        const payload = {}; // Empty payload, missing 'prompt'

        const response = await request(app)
            .post(API_ENDPOINT)
            .send(payload);

        // Similar to empty prompt, outcome depends on API/library/controller robustness
        expect([200, 400, 500]).toContain(response.status);
         console.log(`[Test: Missing Prompt] Received status: ${response.status}`);
         if (response.status === 200) {
            expect(response.body).toHaveProperty('generatedText');
        } else if (response.status === 500) {
             expect(response.body).toEqual({ error: "rip" });
        }
        console.log(`[Test: Missing Prompt] Received body:`, response.body);
    });

});