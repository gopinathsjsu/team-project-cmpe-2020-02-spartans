import Select from 'react-select';
import React, { useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddListing.css';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from './auth';
import Footer from './Footer';

function AddListing() {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [listings, setListings] = useState([]);
    const [ownerInfo, setOwnerInfo] = useState({ name: "John Doe", email: "john.doe@example.com" });
    const [role, setRole] = useState(null);
    useEffect(() => {
        const accessToken = sessionStorage.getItem('accessToken');
        const userRole = sessionStorage.getItem('role');
        setIsAuthenticated(!!accessToken);
        setRole(userRole);

        if (accessToken) {
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

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            setListings(data);
        } catch (err) {
            console.error('Failed to fetch listings:', err);
        }
    };

    const handleLogout = () => {
        sessionStorage.clear(); // Clear session data
        setIsAuthenticated(false);
        setRole(null);
        navigate('/'); // Redirect to home page
    };

    const handleRestaurantClick = (restaurantId) => {
        navigate(`/restaurant/${restaurantId}`);
    };

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
        photos_to_upload: []
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
        setFormData((prevData) => ({
            ...prevData,
            [field]: updatedValues.length === 1 ? [updatedValues[0]] : updatedValues,
        }));
    }; 

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };  

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        console.log("adding file");
        console.log(files)
        console.log(...files)


        setFormData((prev) => ({
            ...prev,
            photos_to_upload: [...prev.photos_to_upload, ...files], // Add new files to the existing photos array
        }));
        console.log(formData);

    };

    const handleRemovePhoto = (index) => {
        console.log("removing file");
        setFormData((prev) => ({
            ...prev,
            photos_to_upload: prev.photos_to_upload.filter((_, i) => i !== index),
        }));
        console.log(formData);

    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const form = new FormData();

            // Append each cuisine_type and food_type value individually
            formData.cuisine_type.forEach((value) => form.append("cuisine_type[]", value));
            formData.food_type.forEach((value) => form.append("food_type[]", value));

            // Append other fields
            Object.keys(formData).forEach((key) => {
                if (key === "photos_to_upload") {
                    console.log("formdata for  loop",formData);
                    
                    formData.photos_to_upload.forEach((file) => form.append('photos', file));
                } else if (!["cuisine_type", "food_type"].includes(key)) {
                    form.append(key, formData[key]);
                }
            });

            console.log("Submitting Data:", Array.from(form.entries()));

            const response = await api.post("/restaurants/add/", form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }});
            if (response.status === 201) {
                alert("Restaurant added successfully!");
                setFormData({
                    name: "",
                    address: "",
                    city: "",
                    state: "",
                    zip_code: "",
                    cuisine_type: [],
                    food_type: [],
                    price_range: "",
                    hours_of_operation: "",
                    website: "",
                    phone_number: "",
                    description: "",
                    photos_to_upload: [],
                });
                navigate("/BusinessOwnerDashboard");
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to add restaurant. Please check your input.");
        }
    };

    return (
        
            <>
                {/* Navbar */}
                <header className="index-header">
                    <nav className="navbar">
                        <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                        <div className="nav-links">
                            <button onClick={() => navigate('/')} className="nav-item">Home</button>
                            {role === 'user' && (
                                <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                            )}
                            {role === 'owner' && (
                                <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner</button>
                            )}
                            {role === 'admin' && (
                                <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin</button>
                            )}
                            <button onClick={() => navigate('/about')} className="nav-item">About Us</button>
                            {isAuthenticated ? (
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

                    {/* Description */}
                    <div className="form-group mb-3">
                        <label>Description</label>
                        <textarea
                            className="form-control"
                            name="description"
                            rows="4"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide a description of your restaurant"
                        ></textarea>
                    </div>

                    <div className="form-group mb-3">
                        <label htmlFor="photos">Upload Photos</label>
                        <input
                            type="file"
                            id="photos"
                            name="photos"
                            multiple
                            onChange={handleFileChange}
                            className="form-control"
                            accept="image/*"
                        />
                        <div className="mt-2">
                            {formData.photos_to_upload.map((file, index) => (
                                <div key={index} className="d-flex align-items-center">
                                    <span className="me-2">{file.name}</span>
                                    <button
                                        type="button"
                                        className="btn btn-danger btn-sm"
                                        onClick={() => handleRemovePhoto(index)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-3">
                        Add Restaurant
                    </button>
                </form>
                {successMessage && <div className="alert alert-success mt-4">{successMessage}</div>}
                {errorMessage && <div className="alert alert-danger mt-4">{errorMessage}</div>}
            </div>
            
        </div>
        <div>
                {/* Main Content */}
                <Footer />
            </div>
        </>
    );
}

export default AddListing;
