import React, { useEffect,useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddListing.css';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { refreshAccessToken } from './auth';

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
        cuisine_type: '',
        food_type: '',
        price_range: '',
        hours_of_operation: '',
        website: '',
        phone_number: '',
    });

    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const CUISINE_CHOICES = [
        { value: 'greek', label: 'Greek' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'italian', label: 'Italian' },
        { value: 'chinese', label: 'Chinese' },
    ];

    const FOOD_TYPE_CHOICES = [
        { value: 'vegan', label: 'Vegan' },
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'non_veg', label: 'Non-Vegetarian' },
    ];

    const PRICE_RANGE_CHOICES = [
        { value: '$', label: 'Low ($)' },
        { value: '$$', label: 'Moderate ($$)' },
        { value: '$$$', label: 'Expensive ($$$)' },
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await api.post('/restaurants/add/', formData);
        if (response.status === 201) {
            setSuccessMessage('Restaurant listing added successfully!');
            setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                zip_code: '',
                cuisine_type: '',
                food_type: '',
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
                        <select
                            className="form-control"
                            name="cuisine_type"
                            value={formData.cuisine_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Cuisine Type</option>
                            {CUISINE_CHOICES.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Food Type */}
                    <div className="form-group mb-3">
                        <label>Food Type</label>
                        <select
                            className="form-control"
                            name="food_type"
                            value={formData.food_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Food Type</option>
                            {FOOD_TYPE_CHOICES.map((choice) => (
                                <option key={choice.value} value={choice.value}>
                                    {choice.label}
                                </option>
                            ))}
                        </select>
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
        </>
    );
}

export default AddListing;
