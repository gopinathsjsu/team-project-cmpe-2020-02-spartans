import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AdminDashboard.css'; // Custom CSS for additional styling

function AdminDashboard() {
    const navigate = useNavigate();

    const handleRemoveListing = async () => {
        // API call to remove listing
    };

    const handleCheckDuplicates = async () => {
        // API call to check for duplicate listings
    };

    return (
        <div className="container admin-dashboard">
            <h2 className="text-center mt-4 mb-4">Admin Dashboard</h2>

            <div className="card mb-4 p-4 shadow">
                <h3>Admin Actions</h3>
                <div className="d-flex flex-column flex-md-row justify-content-around mt-3">
                    <button
                        onClick={() => navigate('/manage-listings')}
                        className="btn btn-primary admin-option mb-3"
                    >
                        <span role="img" aria-label="manage">⚙️</span> Manage Listings
                    </button>
                    <button
                        onClick={handleCheckDuplicates}
                        className="btn btn-warning admin-option mb-3"
                    >
                        <span role="img" aria-label="duplicates">🔍</span> Check Duplicate Listings
                    </button>
                    <button
                        onClick={handleRemoveListing}
                        className="btn btn-danger admin-option mb-3"
                    >
                        <span role="img" aria-label="remove">🗑️</span> Remove Closed Business Entries
                    </button>
                </div>
            </div>

            <div className="options-section">
                <h3>Admin Tools</h3>
                <p>Use these tools to maintain the quality of the listings:</p>
                <ul className="list-group">
                    <li className="list-group-item">
                        <span role="img" aria-label="check">✅</span> Review listings for duplicates.
                    </li>
                    <li className="list-group-item">
                        <span role="img" aria-label="remove">🗑️</span> Remove outdated or closed business entries.
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
