import React, { useState } from 'react';
import './NewMessage.css';
import SearchRecipient from '../SearchRecipient/SearchRecipient';

const NewMessage = () => {
    
    const [subject, setSubject] = useState('');
    const [emailType, setEmailType] = useState('');
    const [recipient, setRecipient] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const messageData = {
            userid: currentUserId,
            type: emailType,
            title: subject,
            body: message,
            recipients: [recipient],
          };
        
          if (emailType === 'news') {
            messageData.newsDetails = { headline: subject };
          } else if (emailType === 'claim') {
            messageData.claimDetails = { claimNumber: '123ABC' };
          } else if (emailType === 'policy') {
            messageData.policyDetails = { policyId: 'POL456' };
          }

        try {
            const response = await fetch('http://localhost:9500/notifications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageData)
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const result = await response.json();
            console.log('Message sent:', result);

            setSubject('');
            setEmailType('');
            setRecipient('');
            setMessage('');

        } catch (error) {
            console.error('Error sending message:', error);
        }
    };


    return (
        <div className='new-mail-wrapper'>
        <form onSubmit={handleSubmit}>
            <div className="new-mail-title">
                <div className="new-mail-container">
                    <p>New Message</p>
                </div>
            </div>
            <input
                type="text"
                placeholder="Subject"
                className="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
            />

            <div className="email-type-container">
                <div className="email-type-text-container">
                    <p className="email-type-text">Type: </p>
                </div>
                {['news', 'policy', 'claim'].map((type) => (
                    <div className="email-option" key={type}>
                        <input
                            type="radio"
                            name="emailType"
                            className="emailType"
                            id={type}
                            value={type}
                            checked={emailType === type}
                            onChange={(e) => setEmailType(e.target.value)}
                            required
                        />
                        <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                    </div>
                ))}
                
            </div>

            <div className="search-recipient-container-box">
                <SearchRecipient onSearch={setRecipient}/>
            </div>

            <textarea
                id="message"
                className="message-content-textbox"
                rows="4"
                cols="40"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
            ></textarea>
        
            <button type="submit" className="send-button">Send</button>

        </form>
        </div>
      );
};

export default NewMessage;