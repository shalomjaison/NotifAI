import "./genAI.css";
import React, { useState } from 'react';
import axios from 'axios';


const GenAI = () => {
    const [prompt, setPrompt] = useState('');
    const [response, setResponse] = useState('');


    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    }

    const promptHandler = async () => {
        setResponse('');
        try {
            const result = await axios.post("http://localhost:3000/genAI/gemini-prompt", {
                prompt: prompt
            })
            setResponse(result.data.generatedText)
        } catch (error) {
            console.log("uh oh we have an error with the prompt")
        } 
    }

    return (
        <div className="promptContainer">
            <textarea
                className="genai-prompt-textarea"
                placeholder="Enter prompt for gen AI" 
                rows="10" 
                cols="60" 
                value={prompt}
                onChange={handlePromptChange} 
            />
            <button id="semd" onClick={promptHandler}>send</button>
            <div className="gemini-response-display">
                <h4>Gemini Response:</h4>
                <pre>{response}</pre>
            </div>
        </div>
    )
}

export default GenAI;