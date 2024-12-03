import React, { useState } from 'react';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddListing.css';
import api from './api';

function AddListing() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        cuisine_type: [],
        food_type: [],
        price_range: '',
        hours_of_operation: '',
        website: '',
        phone_number: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const CUISINE_CHOICES = [
        { value: 1, label: 'Greek' },
        { value: 2, label: 'Mexican' },
        { value: 3, label: 'Italian' },
        { value: 4, label: 'Chinese' },
    ];

    const FOOD_TYPE_CHOICES = [
        { value: 1, label: 'Vegan' },
        { value: 2, label: 'Vegetarian' },
        { value: 3, label: 'Gluten-free' },
    ];

    const PRICE_RANGE_CHOICES = [
        { value: '$', label: 'Low ($)' },
        { value: '$$', label: 'Moderate ($$)' },
        { value: '$$$', label: 'Expensive ($$$)' },
    ];

    const handleSelectChange = (selected, field) => {
        const updatedValues = selected.map((option) => option.label); 
        setFormData({ ...formData, [field]: updatedValues });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        console.log('Submitting Data:', formData);
        const response = await api.post('/restaurants/add/', formData);
            if (response.status === 201) {
                setSuccessMessage('Restaurant listing added successfully!');
                setFormData({
                    name: '',
                    address: '',
                    city: '',
                    state: '',
                    zip_code: '',
                    cuisine_type: [],
                    food_type: [],
                    price_range: '',
                    hours_of_operation: '',
                    website: '',
                    phone_number: '',
                });
            }
        } catch (error) {
            if (error.response && error.response.data) {
            setErrorMessage(error.response.data.error || 'Failed to add listing.');
            } else {
                setErrorMessage('An error occurred. Please try again later.');
            }
        }
    };

    return (
        <div className="add-listing-container d-flex flex-column align-items-center">
            <div className="card listing-card shadow-lg p-4 mt-5">
                <h2 className="text-center mb-4">Add a New Restaurant</h2>
                <form onSubmit={handleSubmit}>
                    {/* Business Name */}
                    <div className="form-group mb-3">
                        <label>Restaurant Name</label>
                        <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Address */}
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

                    {/* City */}
                    <div className="form-group mb-3">
                        <label>City</label>
                        <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* State */}
                    <div className="form-group mb-3">
                        <label>State</label>
                        <input
                            type="text"
                            className="form-control"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Zip Code */}
                    <div className="form-group mb-3">
                        <label>Zip Code</label>
                        <input
                            type="text"
                            className="form-control"
                            name="zip_code"
                            value={formData.zip_code}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Cuisine Type */}
                    <div className="form-group mb-3">
                        <label>Cuisine Type</label>
                        <Select
                            options={CUISINE_CHOICES}
                            isMulti
                            onChange={(selected) => handleSelectChange(selected, 'cuisine_type')}
                            placeholder="Select Cuisine Types"
                        />
                    </div>

                    {/* Food Type */}
                    <div className="form-group mb-3">
                        <label>Food Type</label>
                        <Select
                            options={FOOD_TYPE_CHOICES}
                            isMulti
                            onChange={(selected) => handleSelectChange(selected, 'food_type')}
                            placeholder="Select Food Types"
                        />
                    </div>

                    {/* Price Range */}
                    <div className="form-group mb-3">
                        <label>Price Range</label>
                        <select
                            className="form-control"
                            name="price_range"
                            value={formData.price_range}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Price Range</option>
                            {PRICE_RANGE_CHOICES.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Hours of Operation */}
                    <div className="form-group mb-3">
                        <label>Hours of Operation</label>
                        <input
                            type="text"
                            className="form-control"
                            name="hours_of_operation"
                            value={formData.hours_of_operation}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Website */}
                    <div className="form-group mb-3">
                        <label>Website</label>
                        <input
                            type="url"
                            className="form-control"
                            name="website"
                            value={formData.website}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Phone Number */}
                    <div className="form-group mb-3">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            className="form-control"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Add Restaurant
                    </button>
                </form>
                {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger mt-4">{errorMessage}</div>}
            </div>
        </div>
    );
}

export default AddListing;
