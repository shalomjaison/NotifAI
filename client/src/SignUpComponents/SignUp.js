import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SignUp.css";

function SignUp() {
  const navigate = useNavigate();

  // Form field states
  const [fname, setFirstName] = useState("");
  const [lname, setLastName]   = useState("");
  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [role, setRole] = useState(""); 

  // For error/success messages
  const [message, setMessage]     = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    // Basic check: do the passwords match?
    if (password !== confirmPwd) {
      setMessage("Passwords do not match!");
      return;
    }

    try {
      // Make a POST request to /users/signup
      const response = await axios.post("http://localhost:3000/users/signup", {
        fname,
        lname,
        username,
        email,
        password,
        role, // pass the selected role (might be "" or "employee" or "customer")
      });

      if (response.status === 201) {
        // On success, show message and navigate to login (or any other page)
        setMessage(response.data.message);
        navigate("/");
      }
    } catch (error) {
      console.error("SignUp error:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Sign up failed.");
    }
  };

  return (
    
    <div className="signup-container">

      {/* You can keep your brand section too if you want the "NotifAI" brand + illustration */}
      <div className="brand-section">
        <h1 className="brand-name">NotifAI</h1>
        <img
          src="/images/Login_clipart.png"
          alt="Person working on a laptop"
          className="illustration"
        />
      </div>


       {/* Right side form */}
       <div className="signup-form-section">
        <h2 className="signup-header">Sign Up</h2>
        <form onSubmit={handleSignUp}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-control"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>

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
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              placeholder="Confirm Password"
              value={confirmPwd}
              onChange={(e) => setConfirmPwd(e.target.value)}
              required
            />
          </div>

          {/* Optional: Role selection */}
          <div className="form-group">
            <label htmlFor="roleSelect" style={{ marginBottom: "0.5rem" }}>
              Choose Your Role (optional):
            </label>
            <select
              id="roleSelect"
              className="form-control"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="">(default: customer)</option>
              <option value="customer">Customer</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

export default SignUp;