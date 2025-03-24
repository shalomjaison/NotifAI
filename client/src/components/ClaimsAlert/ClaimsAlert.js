import React from 'react';

const ClaimsAlert = () => {
  return (
    <div style={{
      backgroundColor: '#fee2e2',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '24px',
      border: '1px solid #fecaca'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '8px'
      }}>
        <div>
          <h3 style={{
            margin: '0',
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#b91c1c'
          }}>
            Claims Priority Message
          </h3>
          <span style={{ fontSize: '14px', color: '#b91c1c' }}>Just now</span>
        </div>
        <button style={{
          backgroundColor: 'transparent',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          color: '#b91c1c'
        }}>
          ×
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          backgroundColor: '#fef2f2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {/* Bell icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
        </div>
        <p style={{
          margin: '0',
          fontSize: '14px',
          color: '#b91c1c'
        }}>
          You have $50 due tommorrow
        </p>
      </div>

      <button style={{
        backgroundColor: '#ef4444',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        padding: '6px 16px',
        fontSize: '14px',
        cursor: 'pointer'
      }}>
        Open
      </button>
    </div>
  );
};

export default ClaimsAlert;
