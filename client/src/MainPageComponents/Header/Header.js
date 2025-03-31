import React, { useEffect, useState } from 'react';
import './Header.css';
import LogoutButton from '../LogoutButton/LogoutButton';
import axios from 'axios';
import { useLocation } from 'react-router-dom'; // Import useLocation

const Header = () => {
  const [username, setUsername] = useState('');
  const location = useLocation(); // Get the current location

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/users/me', { withCredentials: true });
        setUsername(response.data.user.fname);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [location.pathname]); // Re-fetch data when the location changes

  return (
    <header className="header-container">
      <h1 className="header-title">
          {username ? `Hi ${username} <3` : 'Uh oh you have no name!'}
      </h1>

      <div className="header-actions">
        <LogoutButton />
        
        <div className="header-sort-by">
          <span className="header-sort-by-text">Sort By</span>
          {/* Filter icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </div>

        <div className="header-profile-image-container">
          {/* Placeholder for profile image */}
          <div className="header-profile-image-placeholder">
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



