import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Select from 'react-select';
import './Index1.css';
import Footer from './Footer';

function Index() {
    const [searchQuery, setSearchQuery] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [cuisine, setCuisine] = useState([]);
    const [foodType, setFoodType] = useState([]);
    const [priceRange, setPriceRange] = useState('');
    const [rating, setRating] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();

    // Google Maps Configuration
    const mapContainerStyle = { width: '100%', height: '300px' };
    const center = { lat: 37.7749, lng: -122.4194 }; // Example coordinates (San Francisco)

    const cuisinesOptions = [
        { value: 'greek', label: 'Greek' },
        { value: 'mexican', label: 'Mexican' },
        { value: 'italian', label: 'Italian' },
        { value: 'chinese', label: 'Chinese' },
    ];

    const foodTypeOptions = [
        { value: 'vegetarian', label: 'Vegetarian' },
        { value: 'vegan', label: 'Vegan' },
        { value: 'gluten-free', label: 'Gluten-free' },
    ];

    // Handle Search Submit
    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        let minRating = '';
        let maxRating = '';
        if (rating) {
            const parsedRating = parseInt(rating, 10); // Convert rating to an integer
            if (!isNaN(parsedRating)) {
                minRating = parsedRating;
                maxRating = parsedRating < 5 ? parsedRating + 0.99 : parsedRating;
            }
        }
        console.log("Searching for:", searchQuery, zipCode, cuisine, foodType, priceRange, rating);

        try {
            // Build query parameters
            const queryParams = new URLSearchParams({
                name: searchQuery,
                zip_code: zipCode,
                cuisine_type: cuisine.map((c) => c.value).join(","),
                food_type: foodType.map((f) => f.value).join(","),
                price_range: priceRange,
                min_rating: minRating || '',
                max_rating: maxRating || '',
            }).toString();

            // Make the API call
            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/search/?${queryParams}`);

            // Check if the response is OK
            if (!response.ok) {
                throw new Error("Failed to fetch restaurants");
            }

            // Parse the JSON response
            const data = await response.json();

            // Update the restaurants state with the API response
            setRestaurants(data);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Get login status and role
    const isLoggedIn = !!sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");

    const handleLogout = () => {
        sessionStorage.clear(); // Clear session data
        navigate("/"); // Redirect to the home page
    };

    return (
        <div className="index-container">
            <header className="index-header">
            <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/')} className="nav-item">Home</button>
                        <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner</button>
                        <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin</button>
                        <button onClick={() => navigate('/about')} className="nav-item">About Us</button>

                        {/* Show login/register or logout button based on login status */}
                        {!isLoggedIn ? (
                            <>
                                <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                                <button onClick={() => navigate('/register')} className="login-btn">Register</button>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="login-btn">Logout</button>
                        )}
                    </div>
                </nav>
                <h1>Restaurant Finder</h1>
                <p>Discover the best places to eat around you</p>
                
            </header>

            <div className="search-section">
                <form onSubmit={handleSearchSubmit} className="search-form">
                    <input 
                        type="text" 
                        placeholder="Search by name..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <input 
                        type="text" 
                        placeholder="Zip Code" 
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="zip-input"
                    />
                    <Select 
                        options={cuisinesOptions} 
                        isMulti 
                        placeholder="Cuisine Type" 
                        onChange={(selected) => setCuisine(selected)}
                        className="select-dropdown"
                    />
                    <Select 
                        options={foodTypeOptions} 
                        isMulti 
                        placeholder="Food Type" 
                        onChange={(selected) => setFoodType(selected)}
                        className="select-dropdown"
                    />
                    <select onChange={(e) => setPriceRange(e.target.value)} className="select-dropdown">
                        <option value="">Price Range</option>
                        <option value="$">Low</option>
                        <option value="$$">Medium</option>
                        <option value="$$$">High</option>
                    </select>
                    <select onChange={(e) => setRating(e.target.value)} className="select-dropdown">
                        <option value="">Rating</option>
                        {[1, 2, 3, 4, 5].map(num => (
                            <option key={num} value={num}>{num} Star{num > 1 ? 's' : ''}</option>
                        ))}
                    </select>
                    <button type="submit" className="search-btn">Search</button>
                </form>
            </div>

            <div className="map-section">
                <LoadScript googleMapsApiKey="AIzaSyC8ArnRrgrsSp34RuGVOqGbbh0JuXBj2ug">
                    <GoogleMap mapContainerStyle={mapContainerStyle} center={center} zoom={10}>
                        {restaurants.map((restaurant, index) => (
                            <Marker 
                                key={index} 
                                position={{ lat: restaurant.latitude, lng: restaurant.longitude }}
                                title={restaurant.name}
                            />
                        ))}
                    </GoogleMap>
                </LoadScript>
            </div>
                            
            <div className="restaurant-list">
                {restaurants.length > 0 ? (
                    [...restaurants]
                        .sort((a, b) => b.rating - a.rating) // Sort by rating (descending order)
                        .map((restaurant, index) => (
                            <div className="restaurant-card" key={index}>
                                <h3>{restaurant.name}</h3>
                                <p>Cuisine: {restaurant.cuisine_type}</p>
                                <p>Food Type: {restaurant.food_type}</p>
                                <p>Price: {restaurant.price_range}</p>
                                <p>Rating: ⭐ {restaurant.rating}</p>
                                <button onClick={() => navigate(`/restaurant/${restaurant.id}`)}>View Details</button>
                            </div>
                        ))
                ) : (
                    <p>No restaurants found matching your criteria.</p>
                )}
            </div>


            <div>
                {/* Main Content */}
                <Footer />
            </div>
        </div>
    );
}

export default Index;
