import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { Navigate } from 'react-router-dom'; // Import Navigate


const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize to false
    const [isLoading, setIsLoading] = useState(true); // Add a loading state

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await axios.get('http://localhost:3000/users/me', { withCredentials: true });
                setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            } finally {
                setIsLoading(false); // Authentication check is done
            }
        };

        checkAuth();
    }, []);

    if (isLoading) {
        return <div>Loading...</div>; // Or a loading spinner
    }

    if (!isLoggedIn) {
        return <Navigate to="/" replace />; // Use Navigate for redirect
    }

    return children; // Render the protected content
};

export default ProtectedRoute;











