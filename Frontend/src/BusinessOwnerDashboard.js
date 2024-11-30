import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './BusinessOwnerDashboard.css';
import { refreshAccessToken } from './auth';

function BusinessOwnerDashboard() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [listings, setListings] = useState([]);
    const [ownerInfo, setOwnerInfo] = useState({ name: "John Doe", email: "john.doe@example.com" });

    useEffect(() => {
        const loggedIn = !!sessionStorage.getItem('accessToken');
        setIsAuthenticated(loggedIn);

        if (loggedIn) {
            fetchListings();
        } else {
            alert('You are not logged in. Redirecting to login.');
            navigate('/login');
        }
    }, [navigate]);

    const fetchListings = async () => {
        try {
            let accessToken = sessionStorage.getItem('accessToken');
            if (!accessToken) {
                accessToken = await refreshAccessToken();
                if (!accessToken) {
                    navigate('/login');
                    return;
                }
            }

            const response = await fetch('http://127.0.0.1:8000/api/accounts/owner/listings/', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.status === 401) {
                const newAccessToken = await refreshAccessToken();
                if (newAccessToken) {
                    const retryResponse = await fetch('http://127.0.0.1:8000/api/accounts/owner/listings/', {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${newAccessToken}`,
                        },
                    });

                    if (retryResponse.ok) {
                        const retryData = await retryResponse.json();
                        setListings(retryData);
                        return;
                    }
                }
                alert('Session expired. Redirecting to login.');
                navigate('/login');
                return;
            }

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setListings(data);
        } catch (err) {
            console.error('Failed to fetch listings:', err);
        }
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}`); // Navigate to the restaurant page
    };

    return (
        <div className="dashboard-container container-fluid p-4">
            {!isAuthenticated ? (
                <div className="text-center">
                    <h3>Please Log In</h3>
                    <button onClick={() => navigate('/login')} className="btn btn-primary">Log In as Business Owner</button>
                </div>
            ) : (
                <>
                    <div className="dashboard-header text-center mb-4">
                        <h2>Welcome, {ownerInfo.name}</h2>
                        <p className="text-muted">Email: {ownerInfo.email}</p>
                    </div>

                    <div className="actions-section row mb-5">
                        <div className="col-md-4">
                            <div className="action-card">
                                <span role="img" aria-label="add">🏢</span>
                                <h5>
                                    <button onClick={() => navigate('/AddListing')}>Add New Listing</button>
                                </h5>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="action-card">
                                <span role="img" aria-label="update">📝</span>
                                <h5>
                                    <button onClick={() => navigate('/UpdateInfo')}>Update Business Info</button>
                                </h5>
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
                                    <div
                                        key={index}
                                        className="col-md-4 mb-3"
                                        onClick={() => handleRestaurantClick(listing.id)} // Add click handler
                                        style={{ cursor: 'pointer' }} // Add pointer cursor for clickable effect
                                    >
                                        <div className="listing-card card">
                                            <div className="card-body">
                                                <h5 className="card-title">{listing.name}</h5>
                                                <p className="card-text">{listing.description}</p>
                                                <p><strong>Address:</strong> {listing.address}</p>
                                                <p><strong>Contact:</strong> {listing.phone_number}</p>
                                                <p><strong>Rating:</strong> {listing.average_rating || 'No ratings yet'}</p>
                                                <p><strong>Reviews:</strong> {listing.review_count || 0}</p>
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
