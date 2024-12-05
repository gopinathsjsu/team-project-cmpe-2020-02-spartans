import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import Footer from './Footer';

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setIsLoading(true);

        if (!email || !password) {
            setError("Please fill out all fields");
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/accounts/login/", {
                email: email.trim(),
                password: password.trim(),
            });

            sessionStorage.setItem("accessToken", response.data.access);
            sessionStorage.setItem("refreshToken", response.data.refresh);
            sessionStorage.setItem("role", response.data.role);

            setSuccess("Login successful!");

            if (response.data.role === "user") {
                navigate("/");
            } else if (response.data.role === "owner") {
                navigate("/BusinessOwnerDashboard");
            } else if (response.data.role === "admin") {
                navigate("/AdminDashboard");
            } else {
                setError("Unknown role. Contact support.");
            }
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || "Invalid email or password");
            } else {
                setError("An unexpected error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
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
                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? "Logging in..." : "Login"}
                </button>
            </form>
           
        </div>
        
    );
}

export default Login;
