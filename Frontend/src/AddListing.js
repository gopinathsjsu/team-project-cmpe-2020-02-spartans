import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddListing.css';
import { useNavigate } from 'react-router-dom';

function AddListing() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        hours: '',
        category: '',
        website: '',
        description: '',
        photos: null,
        priceRange: '',
    });
    const [error, setError] = useState(null); // Error handling
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: name === "photos" ? files : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
            alert('You must be logged in to perform this action.');
            navigate('/login');
            return;
        }

        const formDataToSend = new FormData();
        for (let key in formData) {
            if (key === 'photos' && formData[key]) {
                Array.from(formData[key]).forEach((file) => formDataToSend.append('photos', file));
            } else {
                formDataToSend.append(key, formData[key]);
            }
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/api/accounts/owner/add-listing/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formDataToSend,
            });

            if (!response.ok) {
                throw new Error('Failed to add listing. Please check your inputs.');
            }

            alert('Listing added successfully!');
            navigate('/BusinessOwnerDashboard'); // Redirect to dashboard
        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="add-listing-container d-flex flex-column align-items-center">
            <div className="card listing-card shadow-lg p-4 mt-5">
                <h2 className="text-center mb-4">Create a New Listing</h2>
                {error && <p className="text-danger text-center">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group mb-3">
                        <label>Business Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Address</label>
                        <input
                            type="text"
                            className="form-control"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Contact Information</label>
                        <input
                            type="text"
                            className="form-control"
                            name="contact"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Operating Hours</label>
                        <input
                            type="text"
                            className="form-control"
                            name="hours"
                            value={formData.hours}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Category</label>
                        <input
                            type="text"
                            className="form-control"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Business Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Upload Photos</label>
                        <input
                            type="file"
                            className="form-control"
                            name="photos"
                            multiple
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group mb-3">
                        <label>Price Range</label>
                        <select
                            className="form-control"
                            name="priceRange"
                            value={formData.priceRange}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Price Range</option>
                            <option value="$">Low ($)</option>
                            <option value="$$">Moderate ($$)</option>
                            <option value="$$$">Expensive ($$$)</option>
                        </select>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-4" disabled={isSubmitting}>
                        {isSubmitting ? 'Submitting...' : 'Add Listing'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddListing;
