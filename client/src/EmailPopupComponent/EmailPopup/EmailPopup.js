import React from "react";
import "./EmailPopup.css";

function EmailPopup({
  subject,
  fromEmail,
  toEmail,
  content,
  onBack,
  onDelete,
}) {
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
      </div>

      {/* Body of the email */}
      <div className="email-popup-message-body">{content}</div>
    </div>
  );
}

export default EmailPopup;
