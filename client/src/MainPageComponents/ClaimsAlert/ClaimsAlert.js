import React from 'react';
import './ClaimsAlert.css';

const ClaimsAlert = () => {
  return (
    <div className="claims-alert-container">
      <div className="claims-alert-header">
        <div>
          <h3 className="claims-alert-title">
            Claims Priority Message
          </h3>
          <span className="claims-alert-timestamp">Just now</span>
        </div>
        <button className="claims-alert-close-button">
          ×
        </button>
      </div>

      <div className="claims-alert-content">
        <div className="claims-alert-icon-container">
          {/* Bell icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <p className="claims-alert-message">
          You have $50 due tommorrow
        </p>
      </div>

      <button className="claims-alert-open-button">
        Open
      </button>
    </div>
  );
};

export default ClaimsAlert;

