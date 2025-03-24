import React from 'react';
import './Search.css';

const Search = () => {
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
          placeholder="Search"
          className="search-input"
        />
      </div>
    </div>
  );
};

export default Search;

