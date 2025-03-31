import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize to null
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation(); // Get the current location

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("Checking authentication...");
                await axios.get('http://localhost:3000/users/me', { withCredentials: true });
                console.log("User is authenticated.");
                setIsLoggedIn(true);
            } catch (error) {
                console.log("User is not authenticated.");
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [location.pathname]); // Re-run checkAuth when the location changes

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isLoggedIn === false) {
        window.location.href = "/";
        return null;
    }
    
    if (isLoggedIn === true) {
        return children;
    }

    return null; // Add this line
};

export default ProtectedRoute;













