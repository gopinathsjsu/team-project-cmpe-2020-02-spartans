import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const role = sessionStorage.getItem("role");
    const isLoggedIn = !!sessionStorage.getItem("accessToken");

    useEffect(() => {
        // Fetch user data when component mounts
        const fetchUserProfile = async () => {
            try {
                const token = sessionStorage.getItem("accessToken");
                if (!token) {
                    throw new Error("No access token found. Please log in.");
                }

                const response = await fetch('http://127.0.0.1:8000/api/accounts/account-details/', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch user data.");
                }

                const data = await response.json();
                setUser(data);
            } catch (error) {
                console.error("Error fetching user profile:", error);
                setErrorMessage(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        // Clear session storage and redirect to login page
        sessionStorage.clear();
        navigate('/login');
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (errorMessage) {
        return <div>Error: {errorMessage}</div>;
    }

    return (
        <div className="profile-container">
            {/* Navbar Section */}
            <header className="profile-header">
                <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/')} className="nav-item">Home</button>

                        {/* Conditionally render based on user role */}
                        {role === "user" && (
                            <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        )}
                        {role === "owner" && (
                            <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner Dashboard</button>
                        )}
                        {role === "admin" && (
                            <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin Dashboard</button>
                        )}

                        <button onClick={() => navigate('/about')} className="nav-item">About Us</button>

                        {/* Show login/register or logout button based on login status */}
                        {!isLoggedIn ? (
                            <>
                                <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                                <button onClick={() => navigate('/register')} className="login-btn">Register</button>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="login-btn">Logout</button>
                        )}
                    </div>
                </nav>
            </header>

            {/* Profile Details Section */}
            <h1>My Profile</h1>
            {user && (
                <div className="profile-details">
                    <p><strong>Name:</strong> {user.first_name} {user.last_name}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Joined on:</strong> {new Date(user.date_joined).toLocaleDateString()}</p>

                    <button onClick={() => navigate('/profile/edit')} className="btn btn-primary">
                        Edit Profile
                    </button>
                    <button onClick={handleLogout} className="btn btn-secondary">
                        Log Out
                    </button>
                </div>
            )}
        </div>
    );
};

export default Profile;