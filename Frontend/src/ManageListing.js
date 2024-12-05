import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from './auth';
import './ManageListing.css';
import Footer from './Footer';

function ManageListings() {
    const navigate = useNavigate();
    const [listings, setListings] = useState([]);

    useEffect(() => {
        fetchListings();
    }, []);

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

            if (response.ok) {
                const data = await response.json();
                setListings(data);
            } else {
                throw new Error(`Failed to fetch listings. Status: ${response.status}`);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditClick = (restaurantId) => {
        navigate(`/manage-listings/edit/${restaurantId}`);
    };

    return (
        <div className="container">
            <h2>Manage Listings</h2>
            <div className="listings-section">
                {listings.length > 0 ? (
                    <div className="row">
                        {listings.map((listing) => (
                            <div key={listing.id} className="col-md-4">
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{listing.name}</h5>
                                        <p><strong>Hours:</strong> {listing.hours_of_operation}</p>
                                        <p><strong>Website:</strong> <a href={listing.website}>{listing.website}</a></p>
                                        <p><strong>Phone:</strong> {listing.phone_number}</p>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleEditClick(listing.id)}
                                        >
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No listings found. Add your first restaurant!</p>
                )}
            </div>
            <div>
                {/* Main Content */}
                <Footer />
            </div>
        </div>
    );
}

export default ManageListings;
