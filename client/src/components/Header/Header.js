import React from 'react';

const Header = () => {
  return (
    <header style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: '30px',
      position: 'relative'
    }}>
      <h1 style={{
        fontSize: '42px',
        fontWeight: 'bold',
        margin: 0,
        fontFamily: 'Verdana'
      }}>
        NotifAI
      </h1>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', position: 'absolute', right: 0 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          padding: '8px 16px',
          backgroundColor: 'white'
        }}>
          <span style={{ marginRight: '5px' }}>Sort By</span>
          {/* Filter icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </div>

        <div style={{ width: '40px', height: '40px', borderRadius: '50%', overflow: 'hidden', backgroundColor: '#f3f4f6' }}>
          {/* Placeholder for profile image */}
          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
