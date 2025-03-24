import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    console.log("Login button clicked! Sending request...");

    try {
      const response = await axios.post("http://localhost:3000/users/login", {
        email: username, // Using username input for email
        password,
      });
      console.log("Login Success Response:", response.data);
      setMessage(response.data.message);
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
    <div className="login-container">
      {/* Brand section with illustration */}
      <div className="brand-section">
        <h1 className="brand-name">NotifAI</h1>
        <img 
          src="/images/Login_clipart.png" 
          alt="Person working on laptop" 
          className="illustration"
        />
      </div>

      {/* Login form section */}
      <div className="login-form-section">
        <div className="company-logo">
          {/* Replace with your actual logo */}
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M24 12L36 20V36L24 44L12 36V20L24 12Z" fill="#6c5ce7" />
            <path d="M24 12L36 20V36L24 44V12Z" fill="#5b4bc4" />
            <path d="M24 44L12 36V20L24 12V44Z" fill="#8075e5" />
            <path d="M24 22L32 28V34L24 40L16 34V28L24 22Z" fill="#3ae374" />
          </svg>
        </div>

        <h2 className="login-header">Login</h2>
        
        <div className="signup-prompt">
          <span>Don't have an account yet?</span>
          <a href="/signup">Sign Up</a>
        </div>
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <a href="/forgot-password" className="forgot-password">
              Forgot Password?
            </a>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-options">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="keepLoggedIn"
                checked={keepLoggedIn}
                onChange={(e) => setKeepLoggedIn(e.target.checked)}
              />
              <label htmlFor="keepLoggedIn">Keep me logged in</label>
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default Login;