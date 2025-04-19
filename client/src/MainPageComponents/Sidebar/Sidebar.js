import React, { useState } from 'react';
import './Sidebar.css';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('messages');

  const handleItemClick = (item) => {
    setActiveItem(item);
  };

  return (
    <div className="sidebar-container">
      {/* Top logo */}
      <div className="sidebar-logo-container">
        <div className="sidebar-logo-circle">
          <img
            src="/images/duck_creek_logo.jpg" // Path to your image from the public folder
            alt="Logo"
            className="sidebar-logo-image"
          />
        </div>
      </div>

      {/* Menu button */}
      <div className="sidebar-menu-button-container">
        <button className="sidebar-menu-button">
          {/* Menu icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Edit button */}
      <div className="sidebar-edit-button-container">
        <button className="sidebar-edit-button">
          {/* Edit icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
          </svg>
        </button>
      </div>

      {/* Navigation items */}
      <div className="sidebar-nav-items">
        {/* All Messages */}
        <button
          className={`sidebar-nav-item ${activeItem === 'messages' ? 'active' : ''}`}
          onClick={() => handleItemClick('messages')}
        >
          {activeItem === 'messages' && <div className="sidebar-nav-item-active-indicator"></div>}
          {/* Message Square icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <div className="sidebar-nav-item-text-container">
            <span>All</span>
            <span>Messages</span>
          </div>
        </button>

        {/* Mail */}
        <button
          className={`sidebar-nav-item ${activeItem === 'mail' ? 'active' : ''}`}
          onClick={() => handleItemClick('mail')}
        >
          {activeItem === 'mail' && <div className="sidebar-nav-item-active-indicator"></div>}
          {/* Mail icon SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          <span className="sidebar-nav-item-text">Mail</span>
        </button>

        {/* Teams */}
        <button
          className={`sidebar-nav-item ${activeItem === 'teams' ? 'active' : ''}`}
          onClick={() => handleItemClick('teams')}
        >
          {activeItem === 'teams' && <div className="sidebar-nav-item-active-indicator"></div>}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          <span className="sidebar-nav-item-text">Teams</span>
        </button>

        {/* Slack */}
        <button
          className={`sidebar-nav-item ${activeItem === 'slack' ? 'active' : ''}`}
          onClick={() => handleItemClick('slack')}
        >
          {activeItem === 'slack' && <div className="sidebar-nav-item-active-indicator"></div>}
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2c-1.1 0-2 .9-2 2v4.5H17c1.1 0 2-.9 2-2v-2.5c0-1.1-.9-2-2-2h-2.5Z" />
            <path d="M4.5 9.5c-1.1 0-2 .9-2 2v2.5c0 1.1.9 2 2 2H7c1.1 0 2-.9 2-2v-4.5H4.5Z" />
            <path d="M9.5 22c1.1 0 2-.9 2-2v-4.5H7c-1.1 0-2 .9-2 2V20c0 1.1.9 2 2 2h2.5Z" />
            <path d="M19.5 14.5c1.1 0 2-.9 2-2v-2.5c0-1.1-.9-2-2-2H17c-1.1 0-2 .9-2 2v4.5h4.5Z" />
          </svg>
          <span className="sidebar-nav-item-text">Slack</span>
        </button>
      </div>

      {/* Add button at bottom */}
      <button className="sidebar-add-button">
        {/* Plus icon SVG */}
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
    </div>
  );
};

export default Sidebar;
