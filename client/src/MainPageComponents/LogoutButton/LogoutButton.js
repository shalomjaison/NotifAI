import React from 'react';
import './LogoutButton.css';
import axios from 'axios';

function LogoutButton() {
    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
            window.location.href= "/"; // Redirect to the login page using React Router
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Sign out</button>
    );
}

export default LogoutButton;



