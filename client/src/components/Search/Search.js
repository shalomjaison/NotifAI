import React from 'react';

const Search = () => {
  return (
    <div style={{
      backgroundColor: '#f3f4f6',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '8px 16px'
      }}>
        {/* Search icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search"
          style={{
            border: 'none',
            outline: 'none',
            width: '100%',
            fontSize: '14px'
          }}
        />
      </div>
    </div>
  );
};

export default Search;
