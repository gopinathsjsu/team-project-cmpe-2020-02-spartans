import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors
        setSuccess(""); 

        // Basic validation
        if (!email || !password) {
            setError("Please fill out all fields");
            return;
        }

        try {
            // Send login request to the backend
            const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
                email: email.trim(),
                password: password.trim(),
            });

            // Store tokens in localStorage
            localStorage.setItem("accessToken", response.data.access);
            localStorage.setItem("refreshToken", response.data.refresh);

            // Handle successful login
            setSuccess("Login successful!");

            // Redirect based on user role
            if (response.data.role === "user") {
                navigate("/"); // Redirect to Index
            } else if (response.data.role === "owner") {
                navigate("/BusinessOwnerDashboard"); // Redirect to BusinessOwnerDashboard
            } else if (response.data.role === "admin") {
                navigate("/AdminDashboard"); // Redirect to AdminDashboard
            } else {
                setError("Unknown role. Contact support.");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Invalid email or password");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return (
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}
                {success && <div className="success">{success}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default Login;
