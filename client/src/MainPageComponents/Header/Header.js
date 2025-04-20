import React, { useEffect, useState } from 'react';
import './Header.css';
import LogoutButton from '../LogoutButton/LogoutButton';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Header = ({ userData }) => {
  const navigate = useNavigate(); // Initialize useNavigate
  const [menuOpen, setMenuOpen] = useState(false);
  const handleProfileClick = () => {
    window.location.href= "/profile";
    setMenuOpen(false);
  };
  useEffect(() => {
    if (!userData) {
      console.log("No user data found, redirecting to login");
      window.location.href = "/"; // Redirect to the login page;
    }
  }, [userData, navigate]);

  console.log("menuOpen:", menuOpen);
  return (
    <header className="header-container">
      <h1 className="header-title">
        NOTIFAI
      </h1>

      <div className="header-actions">
        <div className="header-profile-image-container" onClick={() => {
            console.log("Toggling dropdown");
            setMenuOpen(!menuOpen);
        }}>
          {/* Placeholder for profile image */}
          <div className="header-profile-image-placeholder">
            {/*Avatar Icon*/}
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          {menuOpen && (
            <div className='header-dropdown'>
              <div className="header-profile-image-placeholder">
                {/*Avatar Icon*/}
                <svg xmlns="http://www.w3.org/2000/svg" width="90" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <p className='dropdown-greeting'>Hi, {userData?.fname || "User"}!</p>
              <button className="dropdown-btn" onClick={handleProfileClick}>
                Manage your Account
              </button>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
