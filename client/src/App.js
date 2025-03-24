/*
    Data Baes
    2/28/2025

    Main component of React App. Handles UI, React components, and underlying logic of frontend
*/

import React, { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Sidebar from "./components/Sidebar/Sidebar";
import Header from "./components/Header/Header";
import Search from "./components/Search/Search";
import NotificationList from "./components/NotificationList/NotificationList";
import ClaimsAlert from "./components/ClaimsAlert/ClaimsAlert";
import Reminders from "./components/Reminders/Reminders";

function App() {
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook for programmatic navigation 


  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login button clicked! Sending request...");

    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email,
        password,
      });
      console.log("Login Success Response:", response.data);
      setMessage(response.data.message);
      // Redirect to the main page after successful login
      navigate("/main"); // Navigate to the /main route
    } catch (error) {
      console.error(
        "Login error:",
        error.response ? error.response.data : error.message
      );
      setMessage(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: 10 }}>
          <label>Email</label>
          <br />
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: 10 }}>
          <label>Password</label>
          <br />
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Log In</button>
      </form>

      {message && <p style={{ marginTop: 10 }}>{message}</p>}
    </div>
  );
}

// Main component to handle routing
function Main() {
  // Sample data for notifications - link to API later
  const notifications = [
    {
      id: 1,
      source: "Slack",
      sender: "Sahana Satish",
      message: "Hey! the UI mock-up is up",
      time: "1 hour ago",
      icon: "slack"
    },
    {
      id: 2,
      source: "Claims",
      sender: "Claims Department",
      message: "Your payment of $50 is due tommorrow",
      time: "1 hour ago",
      details: "Hello this is to inform you....."
    }
  ];

  // Sample reminders - link to API later
  const reminders = [
    {
      id: 1,
      title: "Meeting",
      location: "ILC S121",
      date: "March 4th, 2025 at 4 pm"
    },
    {
      id: 2,
      title: "Lunch",
      location: "ILC S121",
      date: "March 4th, 2025 at 4 pm"
    }
  ];
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar component */}
      <Sidebar />

      {/* Main content area */}
      <div style={{ flexGrow: 1, padding: '20px', overflow: 'auto' }}>
        {/* Header component */}
        <Header />

        <div style={{
          display: 'flex',
          gap: '20px',
          height: 'calc(100vh - 120px)'
        }}>
          {/* Notifications section */}
          <div style={{ flexBasis: '70%' }}>
            {/* Search component */}
            <Search />

            {/* Notification list */}
            <NotificationList notifications={notifications} />
          </div>

          {/* Right sidebar - claims and reminders */}
          <div style={{ flexBasis: '30%' }}>
            {/* Claims alert */}
            <ClaimsAlert />

            {/* Reminders section */}
            <Reminders reminders={reminders} />
          </div>
        </div>
      </div>
    </div>
  );
}

function AppWrapper() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} /> {/* Login page */}
        <Route path="/main" element={<Main />} /> {/* Main page */}
      </Routes>
    </BrowserRouter>
  );
}

export default AppWrapper;