import "./genAI.css";
// Make sure useEffect is imported
import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';

const initialHistory = [];

const GenAI = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');
    const [chatHistory, setChatHistory] = useState(initialHistory);
    const [isLoading, setIsLoading] = useState(false);
    const textareaRef = useRef(null);
    const [focusRequested, setFocusRequested] = useState(false);

    useEffect(() => {
        if (focusRequested && textareaRef.current) {
            textareaRef.current.focus();
            setFocusRequested(false);
        }
    }, [focusRequested]); 

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    }

    const promptHandler = async () => {
        const currentPrompt = prompt;
        if (!currentPrompt.trim()) return;

        setIsLoading(true);
        setResponse('');
        setPrompt('');

        try {
            const result = await axios.post("http://localhost:3000/genAI/gemini-prompt", {
                prompt: currentPrompt,
                history: chatHistory
            });

            const aiResponseText = result.data.generatedText;
            setResponse(aiResponseText);

            setChatHistory(prevHistory => [
                ...prevHistory,
                { role: "user", parts: [{ text: currentPrompt }] },
                { role: "model", parts: [{ text: aiResponseText }]}
            ]);

        } catch (error) {
            console.error("uh oh, error sending prompt:", error);
            setResponse("uh oh, error fetching response");
            setPrompt(currentPrompt); // restore prompt on error
        } finally {
            setIsLoading(false);
            setFocusRequested(true);
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            promptHandler();
        }
    }

    return (
        <div className="promptContainer">
            <div className="gemini-response-display">
                <h4>Gemini Response:</h4>
                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {isLoading ? "Generating response..." : response}
                </pre>
            </div>
            <textarea
                className="genai-prompt-textarea"
                placeholder="Ask for help!"
                rows="10"
                cols="60"
                value={prompt}
                onChange={handlePromptChange}
                onKeyDown={handleKeyDown}
                disabled={isLoading} 
                ref={textareaRef}
            />
            <button
                id="send"
                onClick={promptHandler}
                disabled={isLoading || !prompt.trim()}
            >
                {isLoading ? 'Sending...' : 'Send'}
            </button>
        </div>
    )
}

export default GenAI;
