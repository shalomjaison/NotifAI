import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { deploymentMode, backendPort, backendHost, backendBaseURL } from '../App';
import { useStatusMessage } from "../StatusMessageProvider";
import { Bell, Users, MessageSquareWarning,  Inbox} from 'lucide-react';

function Login() {
    const {notify} = useStatusMessage();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isSignup, setIsSignup] = useState(false);
    const [fname, setFirstName] = useState("");
    const [lname, setLastName] = useState("");
    const [confirmPwd, setConfirmPwd] = useState("");
    const [role, setRole] = useState(""); 
    const [email, setEmail] = useState("");

    const whyPoints = [
        {
            title: "Everything - In One Place!",
            desc: "NotifAI organizes your scattered inboxes into a single, searchable hub—so you always know where to look.",
            icon: <Inbox />
        },
        {
            title: "Never Miss An Update",
            desc: "With every notification clearly tagged by type—policy, claims, or news—you’ll never miss a deadline or decision again.",
            icon: <MessageSquareWarning />
        },
        {
            title: "Built For The Entire Organization",
            desc: "Whether you're a policyholder, provider, or admin, NotifAI keeps the right people informed at the right time.",
            icon: <Users />
        }

    ]

    useEffect(()=>{
        const stored = localStorage.getItem("statusMessage");
        if (stored) {
          const {message, type} = JSON.parse(stored)
          notify(message, type)
          localStorage.removeItem("statusMessage");
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await axios.post(backendBaseURL + "/users/login", {
                email,
                password,
            }, { withCredentials: true });
            notify("Successfully Logged In!", "success");
            localStorage.setItem("statusMessage", JSON.stringify({message: "Successfully Logged In!", type: "success"}));
            window.location.href="/main";
        } catch(error) {
            notify("Failed to Log In", "error");
        }
    }

      const handleSignUp = async (e) => {
        e.preventDefault();

        // Basic check: do the passwords match?
        if (password !== confirmPwd) {
            notify("Passwords do not match!", "info");
            return;
        }

        if (password.length < 2) {
            notify("Password must be at least 2 characters.", "info");
            return;
        }
        
        const roleToSend = role || "customer";
        try {
        // Make a POST request to /users/signup
        const response = await axios.post(backendBaseURL + "/users/signup", {
            fname,
            lname,
            username,
            email,
            password,
            role:roleToSend, // pass the selected role (might be "" or "employee" or "customer")
        });

        if (response.status === 201) {
            // On success, show message and navigate to login (or any other page)
            notify("Successfully Signed Up!", "success");
            window.location.href="/";
        }
        } catch (error) {
        console.error("SignUp error:", error.response?.data || error.message);
        notify(error.response?.data?.message || "Sign up failed.", "error");
        }
    };

    return (
    <div className="auth-page">
        <div className="left-pane">
            <div className="company-logo">
                <div className="company-icon"><Bell/></div>
                <div className="company-name">NOTIFAI</div>
            </div>
            
            <div className="company-primary-text">Insurance Notifications That Make Sense</div>
            <div className="company-secondary-text">No more missed updates, No more clutter. Just the right message, at the right time, in one secure place.</div>
            <div className="company-secondary-text">NotifAI is your centralized inbox for all insurance communication - built to keep you informed and controlled.</div>
            <div className="why-section">
                <div className="company-feature-text">Why NotifAI?</div>
                <div className="company-deliverables">
                    {whyPoints.map(point => {
                        return (
                        <div className="company-deliverable" key={point.title}>
                            <div className="deliv-icon">{point.icon}</div>
                            <div className="deliv-info">
                                <div className="deliv-main-text">{point.title}</div>
                                <div className="deliv-desc">{point.desc}</div>
                            </div>
                        </div>);
                    })}
                </div>
            </div>
        </div>
        <div class="right-pane">
            <div className="form-container">
                <h2 className="form-title">{isSignup?`Sign Up`:`Sign In`}</h2>
                <form onSubmit={isSignup? handleSignUp: handleLogin}>
                    {isSignup && (
                        <label>
                        First Name
                        <input
                            type="text"
                            value={fname}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                        </label>
                    )}

                    {isSignup && (
                        <label>
                        Last Name
                        <input
                            type="text"
                            value={lname}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                        </label>
                    )}

                    {isSignup && (
                        <label>
                        Username
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        </label>
                    )}

                    <label>
                        Email
                        <input 
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    
                    <label>
                        Password
                        <input 
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    
                    {isSignup && (
                        <label>
                            Confirm Password
                            <input 
                                type="password"
                                placeholder="Confirm Password"
                                value={confirmPwd}
                                onChange={(e) => setConfirmPwd(e.target.value)}
                                required
                            />
                        </label>
                    )}

                    {isSignup && (
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
                            <option value="" disabled hidden>Choose your role</option>
                            <option value="customer">Customer</option>
                            <option value="employee">Employee</option>
                            </select>
                        </div>
                    )}

                    <button type="submit" className="submit-button">
                        {isSignup ? "Sign Up" : "Log In"}
                    </button>
                </form>
                <p className="form-footer">
                    {isSignup?`Already have an account? `:`Don't have an account? `} 
                    <span className="link" onClick={() => setIsSignup(!isSignup)}>{isSignup?`Sign In`: `Sign Up`}</span>
                </p>
            </div>
        </div>
    </div>
    );
}

export default Login;