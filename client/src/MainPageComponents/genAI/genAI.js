import "./genAI.css";
import React, { useState, useRef, useEffect, forwardRef } from 'react'; // 1. Import forwardRef
import axios from 'axios';
import ReactMarkdown from 'react-markdown'; // for text formatting


const GenAI =  forwardRef(({ chatHistory, setChatHistory, isLoading, setIsLoading }, ref) => {
    const [prompt, setPrompt] = useState('');
    const textareaRef = useRef(null);
    const chatDisplayRef = useRef(null); 
    const [focusRequested, setFocusRequested] = useState(false);


    useEffect(() => {
        if (focusRequested && textareaRef.current) {
            textareaRef.current.focus();
            setFocusRequested(false);
        }
    }, [focusRequested]);


    useEffect(() => {
        if (chatDisplayRef.current) {
            chatDisplayRef.current.scrollTop = chatDisplayRef.current.scrollHeight;
        }
    }, [chatHistory]); 

    const handlePromptChange = (event) => {
        setPrompt(event.target.value);
    }

    const promptHandler = async () => {
        const currentPrompt = prompt.trim(); 
        if (!currentPrompt) return;

        setIsLoading(true);
        setPrompt(''); 


        const newUserMessage = { role: "user", parts: [{ text: currentPrompt }] };

        const updatedHistoryForState = [...chatHistory, newUserMessage];
        const historyForAPI = chatHistory;
        setChatHistory(updatedHistoryForState);

        try {

            const historyForAPI = chatHistory; 

            const result = await axios.post("http://localhost:3000/genAI/gemini-prompt", {
                prompt: currentPrompt,
                history: historyForAPI 
            });

            const aiResponseText = result.data.generatedText;

            const aiMessage = { role: "model", parts: [{ text: aiResponseText }] };
            setChatHistory(prevHistory => [...prevHistory, aiMessage]);
            
        } catch (error) {
            console.error("uh oh, error sending prompt:", error);
            const errorMessage = { role: "model", parts: [{ text: "uh oh, error fetching response" }] };
            setChatHistory(prevHistory => [...prevHistory, errorMessage]);
        } finally {
            setIsLoading(false);
            setFocusRequested(true); // Request focus back to the textarea
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            promptHandler();
        }
    }

    return (
        <div className="promptContainer" ref={ref}>
            <div className="gemini-response-display" ref={chatDisplayRef}>
                {chatHistory.length === 0 && !isLoading && (
                    <div className="chat-placeholder">
                        Ask me for assistance! ♡
                    </div>
                )}

                {chatHistory.map((message, index) => (
                    <div key={index} className={`chat-message ${message.role === 'user' ? 'user-message' : 'model-message'}`}>

                        {message.role === 'user' && (
                            message.parts[0].text.split('\n').map((line, i) => (
                                <React.Fragment key={i}>
                                    {line}
                                    <br />
                                </React.Fragment>
                            ))
                        )}

                        {message.role === 'model' && (
                            <div>

                                <h4>
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    width={40}
                                    height={40}
                                    color={"#e9d5ff"}
                                    fill={"none"}
                                    id = "genAI2"
                                  >
                                <path d="M3 12C7.97056 12 12 7.97056 12 3C12 7.97056 16.0294 12 21 12C16.0294 12 12 16.0294 12 21C12 16.0294 7.97056 12 3 12Z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
                                </svg>
                                Gemini:</h4>
                                {/* Pass raw text to ReactMarkdown for formatting */}
                                <ReactMarkdown>
                                    {message.parts[0].text}
                                </ReactMarkdown>
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="chat-message model-message loading-indicator">
                        <span>Thinking...</span>
                    </div>
                )}
            </div>
            <div className="input-area-container">
                <textarea
                    className="genai-prompt-textarea"
                    placeholder="ó‿ó say sumthin"
                    rows="3" 
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
                    <i className="material-icons">send</i>
                </button>
            </div>
        </div>
    )
});

export default GenAI;

