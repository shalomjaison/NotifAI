import React, { useState } from "react";
import "./EmailPopup.css";
import axios from 'axios';




function EmailPopup({
  subject,
  fromEmail,
  toEmail,
  content,
  onBack,
  onDelete,
  onGenAIClick,
  onSummaryReceived,
  onSummarizeStart,
  onSummarizeEnd,
  isLoading
}) {

  const [isFlashing, setIsFlashing] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false); 

  // Handler for the summarize button click
  const handleSummarizeClick = async () => {
    // Call the original function passed via props
    onGenAIClick();
    onSummarizeStart();

    // Trigger the flash animation
    setIsFlashing(true);

    setTimeout(() => {
      setIsFlashing(false);
    }, 600); 

    const summaryContent = {
      subject: subject,
      from: fromEmail,
      to: toEmail,
      content: content};

    const requestBody = {
      prompt: JSON.stringify(summaryContent),
      history: [] 
    };
    try {        
        const response = await axios.post('http://localhost:3000/genAI/gemini-prompt',
          requestBody, // Send the structured body
          { withCredentials: true }
      );

      console.log("summarize info sent to gemeni: " + response.data)

      if (response.data && response.data.generatedText) {
        onSummaryReceived(response.data.generatedText);
      } else {
        onSummaryReceived("Sorry! I couldn't generate a summary (empty response).");
      }
    } catch (error) {
      console.error("Error summarizing:", error.response?.data || error.consoleMessage);
    } finally {
      onSummarizeEnd();
    }
  };

  const showTooltip = () => setIsTooltipVisible(true);
  const hideTooltip = () => setIsTooltipVisible(false);




  return (
    <div className="email-popup-container">
      {/* Header bar with back button, subject, and delete icon */}
      <div className="email-popup-header">
        <button
          className="email-popup-back-button"
          onClick={onBack}
          title="Back"
        >
          ←
        </button>

        <div className="email-popup-subject-line">
          <strong>Subject Line:</strong> {subject}
        </div>
        <button
          className="email-popup-trash-button"
          onClick={onDelete}
          title="Delete Email"
        >
          {/* SVG Trash Icon */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14H7L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
            <path d="M10 6V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" />
          </svg>
        </button>
      </div>

      {/* From / To section */}
      <div className="email-popup-addresses">
        <div>
          <strong>From:</strong> {fromEmail}
        </div>
        <div>
          <strong>To:</strong> {toEmail}
        </div>
        <button
          className={`summarize ${isFlashing ? 'flash-active' : ''}`} 
          onClick={handleSummarizeClick}
          onMouseEnter={showTooltip} // Show tooltip on hover enter
          onMouseLeave={hideTooltip} // Hide tooltip on hover leave
          disabled={isLoading}
        >
          <img src="/images/sparkles.png" 
          alt="Summarize/Generate AI" 
          />
          {isTooltipVisible && (
            <span className="custom-tooltip">
              Summarize with AI ✧˖°.
            </span>
          )}
        </button>
      </div>

      {/* Body of the email */}
      <div className="email-popup-message-body">
        <p>{content}</p>
      </div>
    </div>
  );
}

export default EmailPopup;
