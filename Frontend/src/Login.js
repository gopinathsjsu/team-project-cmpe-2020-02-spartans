import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Function to handle login submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        setSuccess(''); // Clear previous success message

        // Basic validation
        if (!email || !password) {
            setError('Please fill out all fields');
            return;
        }

        try {
            // Send login request to the backend
            const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', {
                email: email.trim(),
                password: password.trim(),
            });

            // Store tokens in localStorage
            localStorage.setItem('accessToken', response.data.access);
            localStorage.setItem('refreshToken', response.data.refresh);

            // Handle successful login
            setSuccess('Login successful!');
            console.log('User Role:', response.data.role); // Log the user role if provided

            // Redirect or load next component
            // Example: window.location.href = '/dashboard';
        } catch (err) {
            if (err.response && err.response.data) {
                setError(err.response.data.error || 'Invalid email or password');
            } else {
                setError('An unexpected error occurred. Please try again.');
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
