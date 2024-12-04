import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from './auth';
import Footer from './Footer';

function AdminDashboard() {
    const [view, setView] = useState(''); // State to track current view
    const [allListings, setAllListings] = useState([]);
    const [duplicateListings, setDuplicateListings] = useState([]);
    const [oldListings, setOldListings] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [role, setRole] = useState(null); // Role state
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Login status
    const navigate = useNavigate();

    // Fetch user role and login status
    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        const userRole = sessionStorage.getItem('role');
        setRole(userRole);
        setIsLoggedIn(!!accessToken);

        if (!accessToken || userRole !== 'admin') {
            alert('You are not authorized to access this page.');
            navigate('/login'); // Redirect if not logged in as admin
        }
    }, [navigate]);

    // Fetch all listings
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

    const fetchOldListings = async () => {
        const accessToken = sessionStorage.getItem('accessToken');
        setIsLoading(true);
        setError(null);

        // token refresh
        if (!accessToken) {
            const newToken = await refreshAccessToken();
            if (!newToken) return; 
            accessToken = newToken;
        }

        try {
            console.log('Access Token:', accessToken);
            const response = await fetch('http://127.0.0.1:8000/api/admin/old-listings/', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) throw new Error('Failed to fetch old listings');
            const data = await response.json();
            setOldListings(data);
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

        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
            alert('You must be logged in to perform this action.');
            return;
        }

        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/delete-listing/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete the listing');
            alert('Listing deleted successfully.');
            setAllListings((prev) => prev.filter((listing) => listing.id !== id));
            setDuplicateListings((prev) => prev.filter((listing) => listing.id !== id));
        } catch (err) {
            console.error('Error deleting listing:', err);
            alert('Failed to delete listing. Please try again.');
        }
    };

    const handleDeleteOldListing = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this old listing? This action cannot be undone.');
        if (!confirmDelete) return;
    
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
            alert('You must be logged in to perform this action.');
            return;
        }
        console.log('Access Token:', accessToken);
    
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/admin/delete-old-listing/${id}/`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (!response.ok) throw new Error('Failed to delete the listing');
            alert('Listing deleted successfully.');
            setOldListings((prev) => prev.filter((listing) => listing.id !== id));
        } catch (err) {
            console.error('Error deleting old listing:', err);
            alert('Failed to delete old listing. Please try again.');
        }
    };    

    useEffect(() => {
        if (view === 'manage') fetchAllListings();
        if (view === 'duplicates') fetchDuplicateListings();
        if (view === 'old-listings') fetchOldListings();
    }, [view]);

    const handleLogout = () => {
        sessionStorage.clear(); // Clear session data
        navigate('/'); // Redirect to the home page
    };

    return (
        <div className="container admin-dashboard">
            <header className="index-header">
                <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/')} className="nav-item">Home</button>
                        {role === 'user' && (
                            <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        )}
                        {role === 'owner' && (
                            <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner Dashboard</button>
                        )}
                        {role === 'admin' && (
                            <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin Dashboard</button>
                        )}
                        <button onClick={() => navigate('/about')} className="nav-item">About Us</button>
                        {isLoggedIn ? (
                            <button onClick={handleLogout} className="login-btn">Logout</button>
                        ) : (
                            <>
                                <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                                <button onClick={() => navigate('/register')} className="login-btn">Register</button>
                            </>
                        )}
                    </div>
                </nav>
            </header>
            <h2 className="text-center mt-4 mb-4">Admin Dashboard</h2>

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
                    <button
                        onClick={() => setView('old-listings')}
                        className={`btn btn-danger admin-option mb-3 ${view === 'old-listings' ? 'active' : ''}`}
                    >
                        🗑️ Delete Old Listings
                    </button>
                </div>
            </div>

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
                                        <strong>{listing.name}</strong> - {listing.address}
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
                    <h3>Duplicate Listings</h3>
                    {isLoading ? (
                        <p>Loading duplicate listings...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : Object.keys(groupedDuplicates).length > 0 ? (
                        <div>
                            {Object.entries(groupedDuplicates).map(([key, duplicates], index) => (
                                <div key={index} className="mb-4">
                                    <h5 className="text-warning">Group {index + 1}</h5>
                                    <ul className="list-group">
                                        {duplicates.map((listing) => (
                                            <li key={listing.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <span>
                                                    <strong>{listing.name}</strong> - {listing.address}, {listing.city}, {listing.state} {listing.zip_code}
                                                </span>
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() => handleDeleteListing(listing.id)}
                                                >
                                                    🗑️ Delete Listing
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>No duplicate listings found.</p>
                    )}
                </div>
            )}

            {view === 'old-listings' && (
                <div className="card p-4 shadow">
                    <h3>Old Listings</h3>
                    {isLoading ? (
                        <p>Loading old listings...</p>
                    ) : error ? (
                        <p className="text-danger">{error}</p>
                    ) : oldListings.length > 0 ? (
                        <ul className="list-group">
                            {oldListings.map((listing) => (
                                <li key={listing.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <span>
                                        <strong>{listing.name}</strong> - {listing.address}, {listing.city}, {listing.state} {listing.zip_code}
                                    </span>
                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleDeleteOldListing(listing.id)}
                                    >
                                        🗑️ Delete Old Listing   
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No old listings found.</p>
                    )}
                </div>
            )}

            {!view && (
                <div className="text-center mt-4">
                    <p>Select an action above to get started.</p>
                </div>
            )}
            <div>
                {/* Main Content */}
                <Footer />
            </div>
        </div>
    );
}

export default AdminDashboard;
