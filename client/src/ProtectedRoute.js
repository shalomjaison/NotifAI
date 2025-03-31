import { useEffect, useState } from 'react';
import axios from 'axios';
import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation

const ProtectedRoute = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(null); // Initialize to null
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState(null); // Add userData state
    const location = useLocation(); // Get the current location

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("Checking authentication...");
                const response = await axios.get('http://localhost:3000/users/me', { withCredentials: true });
                console.log("User is authenticated.");
                setIsLoggedIn(true);
                setUserData(response.data.user); // Store user data
            } catch (error) {
                console.log("User is not authenticated.");
                setIsLoggedIn(false);
                setUserData(null); // Clear user data on logout or failed auth
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
        // Pass userData as a prop to the children
        return React.cloneElement(children, { userData });
    }

    return null; // Add this line
};

export default ProtectedRoute;














