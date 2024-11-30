import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BusinessOwnerDashboard.css';


function BusinessOwnerDashboard() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [listings, setListings] = useState([]);
    const [ownerInfo, setOwnerInfo] = useState({ name: "John Doe", email: "john.doe@example.com" });

    useEffect(() => {
        // Check if the user is logged in
        const loggedIn = true; // Replace with actual authentication check
        setIsAuthenticated(loggedIn);

        // Fetch listings owned by this business owner if logged in
        if (loggedIn) {
            fetchListings();
        }
    }, []);

    const fetchListings = () => {
        // API call to get the business listings
        // Example: setListings([{ name: "Restaurant 1", address: "123 Street", contact: "123-456-7890", description: "Best food in town" }]);
    };

    const handleLogin = () => {
        // Logic for login (e.g., redirect to login page or open login modal)
        // After login, setIsAuthenticated(true);
        navigate('/login');
    };

    const handleAddListing = () => {
        navigate('/add-listing');
    };

    const handleUpdateInfo = () => {
        navigate('/update-info');
    };

    const handleAddUpdateDescription = () => {
        navigate('/add-update-description');
    };

    const handleAddUpdatePhotos = () => {
        navigate('/add-update-photos');
    };

    return (
        <div className="dashboard-container container-fluid p-4">
            {!isAuthenticated ? (
                <div className="text-center">
                    <h3>Please Log In</h3>
                    <button onClick={handleLogin} className="btn btn-primary">Log In as Business Owner</button>
                </div>
            ) : (
                <>
                <header className="index-header">
            <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/')} className="nav-item">Home</button>
                        <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        <button onClick={() => navigate('/login')} className="nav-item">Business Owner</button>
                        <button onClick={() => navigate('/login')} className="nav-item">Admin</button>
                        <button onClick={() => navigate('/about')} className="nav-item">About Us</button>
                        <button onClick={() => navigate('/login')} className="login-btn">Login </button>
                        <button onClick={() => navigate('/register')} className="login-btn">Register </button>
                    </div>
                </nav>
                <h1>Restaurant Finder</h1>
                <p>Discover the best places to eat around you</p>
                
            </header>
                    <div className="dashboard-header text-center mb-4">
                        <h2>Welcome, {ownerInfo.name}</h2>
                        <p className="text-muted">Email: {ownerInfo.email}</p>
                    </div>
                    
                    <div className="actions-section row mb-5">
                        <div className="col-md-4">
                            <div className="action-card" >
                                <span role="img" aria-label="add">🏢</span>
                                <h5 ><button onClick={() => navigate('/AddListing')}>Add New Listing</button></h5>
            
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="action-card">
                                <span role="img" aria-label="update">📝</span>
                                <h5><button onClick={() => navigate('/UpdateInfo')}>Update Business Info</button></h5>
                            </div>
                        </div>
                        
                        <div className="col-md-4">
                            <div className="action-card" onClick={() => navigate('/view-listings')}>
                                <span role="img" aria-label="view">📋</span>
                                <h5>View Your Listings</h5>
                            </div>
                        </div>
                    </div>

                    <div className="listings-section">
                        <h4>Your Listings</h4>
                        {listings.length > 0 ? (
                            <div className="listing-cards row">
                                {listings.map((listing, index) => (
                                    <div key={index} className="col-md-4 mb-3">
                                        <div className="listing-card card">
                                            <div className="card-body">
                                                <h5 className="card-title">{listing.name}</h5>
                                                <p className="card-text">{listing.description}</p>
                                                <p><strong>Address:</strong> {listing.address}</p>
                                                <p><strong>Contact:</strong> {listing.contact}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p>No listings found.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default BusinessOwnerDashboard;
