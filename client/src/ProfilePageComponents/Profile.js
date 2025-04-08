// src/pages/Profile.js
import React, { useEffect, useState } from 'react';
import './Profile.css';
import axios from 'axios';

// const user = {
//     firstName: "John",
//     lastName: "Doe",
//     role: "Customer",
//     email: "johndoe@gmail.com"
// };
function Profile() {
    const [user, setUser] = useState(null); // to hold user data
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://localhost:3000/users/profile', {
            withCredentials: true,
          });
          console.log("Response status:", response.status);
          console.log("User data:", response.data);
    
          setUser(response.data.user || response.data);
        } catch (err) {
          console.error("Fetch error:", err);
        }
      };
    
      fetchData();
    }, []);
    return (
        <div className='profile-page'>
            <h1 className='notifai-text'>NOTIFAI</h1>
            <h2 className='section-title'>Personal Page</h2>
            <div className='profile-card'>
                <div className="card-title">Profile</div>
                <div className='avatar'></div>
                <div className='profile-info'>
                    <div className="info-row">
                        <span className="label">First Name</span>
                        <span className="value">{user?.fname || 'Loading...'}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Last Name</span>
                        <span className="value">{user?.lname || 'Loading...'}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Role</span>
                        <span className="value">{user?.role || 'Loading...'}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Email Address</span>
                        <span className="value">{user?.email || 'Loading...'}</span>
                    </div>
                </div>
            </div>
            <div className="sub-sections">
                <div className="card">
                    <div className="card-title">Other Info</div>
                    <div className="card-content password-row">
                        <span className="label">Password</span>
                        <span className="value">********</span>
                        <a href="#" className="change-link">Change Password</a>
                    </div>
                </div>
                <div className="card">
                    <div className="card-title">Languages</div>
                    <div className="card-content">🌐 English</div>
                </div>
            </div>
        </div>
    )
}

export default Profile;