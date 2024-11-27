import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import { refreshAccessToken } from './auth.js';

function AdminDashboard() {
    const [view, setView] = useState(''); // State to track current view ('' by default)
    const [allListings, setAllListings] = useState([]); // State for all listings
    const [duplicateListings, setDuplicateListings] = useState([]); // State for duplicate listings
    const [isLoading, setIsLoading] = useState(false); // Loading state
    const [error, setError] = useState(null); // Error state

    // Fetch all listings (Manage Listings)
    const fetchAllListings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/restaurants/');
            if (!response.ok) throw new Error('Failed to fetch listings');
            const data = await response.json();
            setAllListings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch duplicate listings
    const fetchDuplicateListings = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/admin/duplicates/');
            if (!response.ok) throw new Error('Failed to fetch duplicate listings');
            const data = await response.json();
            setDuplicateListings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Group duplicate listings by shared attributes
    const groupDuplicates = (listings) => {
        const groups = {};
        listings.forEach((listing) => {
            const key = `${listing.name}-${listing.address}-${listing.city}-${listing.state}-${listing.zip_code}`;
            if (!groups[key]) {
                groups[key] = [];
            }
            groups[key].push(listing);
        });
        return groups;
    };
    
    const groupedDuplicates = groupDuplicates(duplicateListings);

    const handleDeleteListing = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this listing? This action cannot be undone.');
        if (!confirmDelete) return;
    
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            alert('You must be logged in to perform this action.');
            return;
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`, // Include token
                },
            });
            if (!response.ok) throw new Error('Failed to delete the listing');
            alert('Listing deleted successfully.');
            setAllListings((prev) => prev.filter((listing) => listing.id !== id));
        } catch (err) {
            console.error('Error deleting listing:', err);
            alert('Failed to delete listing. Please try again.');
        }
    };
    
    const handleDeleteDuplicateListing = async (id) => {
        const confirmDelete = window.confirm(
            'Are you sure you want to delete this duplicate listing? This action cannot be undone.'
        );
        if (!confirmDelete) return;
    
        let accessToken = localStorage.getItem('accessToken'); // Retrieve the access token
    
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/admin/delete-listing/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
    
            // If the token is expired, refresh it
            if (response.status === 401) {
                console.log('Access token expired. Refreshing...');
                accessToken = await refreshAccessToken();
                if (!accessToken) return; // Stop if refreshing the token failed
    
                // Retry the request with the new token
                response = await fetch(`http://127.0.0.1:8000/api/admin/delete-listing/${id}/`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                });
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Failed to delete the listing');
            }
    
            // Update the UI after successful deletion
            alert('Duplicate listing deleted successfully.');
            setDuplicateListings((prev) => prev.filter((listing) => listing.id !== id));
        } catch (err) {
            console.error('Error deleting duplicate listing:', err);
            alert('Failed to delete listing. Please try again.');
        }
    };    

    useEffect(() => {
        // Fetch listings only when needed
        if (view === 'manage') fetchAllListings();
        if (view === 'duplicates') fetchDuplicateListings();
    }, [view]); // Triggered when `view` changes

    return (
        <div className="container admin-dashboard">
            <h2 className="text-center mt-4 mb-4">Admin Dashboard</h2>

            {/* Admin Action Buttons */}
            <div className="card mb-4 p-4 shadow">
                <h3>Admin Actions</h3>
                <div className="d-flex flex-column flex-md-row justify-content-around mt-3">
                    <button
                        onClick={() => setView('manage')}
                        className={`btn btn-primary admin-option mb-3 ${view === 'manage' ? 'active' : ''}`}
                    >
                        ⚙️ Manage Listings
                    </button>
                    <button
                        onClick={() => setView('duplicates')}
                        className={`btn btn-warning admin-option mb-3 ${view === 'duplicates' ? 'active' : ''}`}
                    >
                        🔍 Check Duplicate Listings
                    </button>
                </div>
            </div>

            {/* Conditional Rendering of Content Based on View */}
            {view === 'manage' && (
                <div className="card p-4 shadow">
                    <h3>Manage Listings</h3>
                    {isLoading ? (
                        <p>Loading listings...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : allListings.length > 0 ? (
                        <ul className="list-group">
                            {allListings.map((listing) => (
                                <li key={listing.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        <strong>{listing.name}</strong> - {listing.address}, {listing.city}, {listing.state}, {listing.zip_code}
                                    </span>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => handleDeleteListing(listing.id)}
                                    >
                                        🗑️ Delete Listing
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No listings found.</p>
                    )}
                </div>
            )}

{view === 'duplicates' && (
                <div className="card p-4 shadow">
                    <h3>Potential Duplicate Listings</h3>
                    {isLoading ? (
                        <p>Loading duplicate listings...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : Object.keys(groupedDuplicates).length > 0 ? (
                        <div>
                            {Object.entries(groupedDuplicates).map(([groupKey, listings]) => (
                                <div key={groupKey} className="mb-4">
                                    <h5 className="text-primary">{listings[0].name}</h5>
                                    <p>
                                        Address: {listings[0].address}, {listings[0].city}, {listings[0].state}, {listings[0].zip_code}
                                    </p>
                                    <table className="table table-bordered">
                                        <thead>
                                            <tr>
                                                <th>ID</th>
                                                <th>Website</th>
                                                <th>Phone Number</th>
                                                <th>Rating</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {listings.map((listing) => (
                                                <tr key={listing.id}>
                                                    <td>{listing.id}</td>
                                                    <td>{listing.website}</td>
                                                    <td>{listing.phone_number}</td>
                                                    <td>{listing.rating}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-danger btn-sm"
                                                            onClick={() => handleDeleteDuplicateListing(listing.id)}
                                                        >
                                                            🗑️ Delete
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No duplicate listings found.</p>
                    )}
                </div>
            )}

            {!view && (
                <div className="text-center mt-4">
                    <p>Select an action above to get started.</p>
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;
