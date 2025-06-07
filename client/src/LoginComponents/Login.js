import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { deploymentMode, backendPort, backendHost, backendBaseURL } from '../App';
import { useStatusMessage } from "../StatusMessageProvider";
import { Bell, Users, MessageSquareWarning,  Inbox} from 'lucide-react';

function Login() {
    const {notify} = useStatusMessage();
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

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
                email: username,
                password,
            }, { withCredentials: true });
            
            localStorage.setItem("statusMessage", JSON.stringify({message: "Successfully Logged In!", type: "success"}));
            window.location.href="/main";
        } catch(error) {
            notify("Failed to Log In", "error");
        }
    }

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
            
        </div>
    </div>
    );
}

export default Login;