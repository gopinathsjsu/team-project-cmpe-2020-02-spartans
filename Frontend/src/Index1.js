




import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Select from 'react-select';
import './Index1.css';
import Footer from './Footer';
import BusinessOwnerDashboard from './BusinessOwnerDashboard';
import AdminDashboard from './BusinessOwnerDashboard';
import Register from './Register';
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

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        console.log("Searching for:", searchQuery, zipCode, cuisine, foodType, priceRange, rating);
        // Implement search logic here (API call or filter based on criteria)
    };

    return (
        <div className="index-container">
            <header className="index-header">
                <h1>Restaurant Finder</h1>
                <p>Discover the best places to eat around you</p>
                <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/')} className="nav-item">Home</button>
                        <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner</button>
                        <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin</button>
                        <button onClick={() => navigate('/about')} className="nav-item">About Us</button>
                        <button onClick={() => navigate('/login')} className="login-btn">Login </button>
                        <button onClick={() => navigate('/register')} className="login-btn">Register </button>
                    </div>
                </nav>
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
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
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
                {restaurants.map((restaurant, index) => (
                    <div className="restaurant-card" key={index}>
                        <h3>{restaurant.name}</h3>
                        <p>Cuisine: {restaurant.cuisine}</p>
                        <p>Price: {restaurant.price}</p>
                        <p>Rating: ⭐ {restaurant.rating}</p>
                        <button onClick={() => navigate(`/restaurant/${restaurant.id}`)}>View Details</button>
                    </div>
                ))}
            </div>
            <div>
            {/* Main Content */}
            <Footer />
        </div>
        </div>
    );
}

export default Index;
