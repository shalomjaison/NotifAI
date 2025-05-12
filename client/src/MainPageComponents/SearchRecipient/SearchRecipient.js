import React, { useState } from 'react';
import './SearchRecipient.css';
import axios from 'axios';
import { backendBaseURL } from '../../App';

const SearchRecipient = ({ onSearch = () => {}}) => {
  const [inputValue, setInputValue] = useState('');
  const [recipients, setRecipients] = useState([]);
  const [invalidUsernames, setInvalidUsernames] = useState([]);

  const validUsername = async (username) => {
    try {
      console.log(`Validating username: ${username}`);
      
      const res = await axios.get(`${backendBaseURL}/users/exists/${username}`, {
        withCredentials: true,
      });
      console.log(`API Response:`, res.data);
  
      return res.data.exists;
    } catch (err) {
      console.error('Validation error:', err);
      
      return false;
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const addRecipient = async () => {
    const value = inputValue.trim();
    if (value && !recipients.includes(value)) {
      const isValid = await validUsername(value);
      if (isValid) {
        const newRecipients = [...recipients, value];
        setRecipients(newRecipients);
        setInvalidUsernames(invalidUsernames.filter((name) => name !== value));
        onSearch(newRecipients);
      } else {
        setInvalidUsernames([...invalidUsernames, value]);
      }
    }
    setInputValue('');
  };

  const handleKeyDown = async (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const trimmed = inputValue.trim();
      if (trimmed === '' || recipients.includes(trimmed)) return;

      await addRecipient();
    }
  };

  const removeRecipient = (name) => {
    const updated = recipients.filter(n => n !== name);
    setRecipients(updated);
    onSearch(updated);
  };

  return (
    <div className="search-input-username-wrapper multi">
      {recipients.map((name, index) => (
        <div
          key={index}
          className={`recipient-chip ${invalidUsernames.includes(name) ? 'invalid' : ''}`}
        >
          {name}
          <button onClick={() => removeRecipient(name)} className="remove-recipient">×</button>
        </div>
      ))}
      <input
        type="text"
        placeholder={recipients.length === 0 ? 'To: Enter Username' : ''}
        className="search-username-input"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default SearchRecipient;