import React from 'react';
import './LogoutButton.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

function LogoutButton() {
    const navigate = useNavigate(); // Get the navigate function

    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:3000/users/logout', {}, { withCredentials: true });
            navigate("/"); // Redirect to the login page using React Router
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <button className="logout-button" onClick={handleLogout}>Sign out</button>
    );
}

export default LogoutButton;



