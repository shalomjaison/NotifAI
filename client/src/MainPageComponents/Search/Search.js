import React, { useState } from 'react';
import './Search.css';

const Search = ({ onSearch = () => {}, placeholder = "Search" }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value); // Pass the search term to the parent component
  };

  // Clear search input
  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        {/* Search icon SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6b7280"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="search-icon"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder={placeholder}
          className="search-input"
          value={searchTerm}
          onChange={handleInputChange}
        />
        {searchTerm && (
          <button 
            onClick={clearSearch}
            className="clear-button"
            aria-label="Clear search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#6b7280"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Search;