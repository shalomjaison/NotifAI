import React, { useState } from 'react';
import './SearchRecipient.css';

const SearchRecipient = ({ onSearch = () => {}}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
      <div className="search-input-wrapper">
        
        <input
          type="text"
          placeholder="To: Enter Username"
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
  );
};

export default SearchRecipient;