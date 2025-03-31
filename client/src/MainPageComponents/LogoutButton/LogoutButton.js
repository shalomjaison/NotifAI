import React from 'react';
import './LogoutButton.css';
import axios from 'axios';

function LogoutButton() {

    const handleLogout = async () => {
        try {
            // Send a request to the server to clear the session/cookie
            await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });

            // Force a full page reload after logout
            window.location.href = "/"; // Redirect and reload
        } catch (error) {
            console.error("Logout error:", error);
            // Handle logout error (e.g., display an error message)
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Sign out</button>
    );
}

export default LogoutButton;


