import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    const [searchHistory, setSearchHistory] = useState([]);
    const navigate = useNavigate();

    const cuisinesOptions = [
        { value: 1, label: 'Greek' },
        { value: 2, label: 'Mexican' },
        { value: 3, label: 'Italian' },
        { value: 4, label: 'Chinese' },
    ];

    const foodTypeOptions = [
        { value: 1, label: 'Vegan' },
        { value: 2, label: 'Vegetarian' },
        { value: 3, label: 'Gluten-free' },
    ];

    const cuisineMap = {
        1: 'Greek',
        2: 'Mexican',
        3: 'Italian',
        4: 'Chinese',
    };

    useEffect(() => {
        const savedParams = localStorage.getItem('searchParams');
        const savedResults = localStorage.getItem('searchResults');

        if (savedParams) {
            const params = JSON.parse(savedParams);
            setSearchQuery(params.searchQuery);
            setZipCode(params.zipCode);
            setCuisine(params.cuisine);
            setFoodType(params.foodType);
            setPriceRange(params.priceRange);
            setRating(params.rating);
        }

        if (savedResults) {
            setRestaurants(JSON.parse(savedResults));
        }
    }, []);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        const cuisineNames = cuisine.map((c) =>
            cuisinesOptions.find((option) => option.value === c.value)?.label
        );
        const foodTypeNames = foodType.map((f) =>
            foodTypeOptions.find((option) => option.value === f.value)?.label
        );
        let minRating = '';
        let maxRating = '';
        if (rating) {
            const parsedRating = parseInt(rating, 10); 
            if (!isNaN(parsedRating)) {
                minRating = parsedRating;
                maxRating = parsedRating < 5 ? parsedRating + 0.99 : parsedRating;
            }
        }
        console.log("Searching for:", searchQuery, zipCode, cuisine, foodType, priceRange, rating);

        const searchParams = {
            searchQuery,
            zipCode,
            cuisine,
            foodType,
            priceRange,
            rating,
        };

        localStorage.setItem('searchParams', JSON.stringify(searchParams));

        try {
            const queryParams = new URLSearchParams({
                query: searchQuery,
                zip_code: zipCode,
                cuisine_type: cuisineNames.join(','),
                food_type: foodTypeNames.join(','),
                price_range: priceRange,
                min_rating: minRating || '',
                max_rating: maxRating || '',
            }).toString();

            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/search/?${queryParams}`);
            if (!response.ok) {
                throw new Error("Failed to fetch restaurants");
            }
            const data = await response.json();
            localStorage.setItem('searchResults', JSON.stringify(data));
            const filteredRestaurants = data.filter(restaurant => restaurant.price_range && restaurant.price_range !== 'N/A');
            setRestaurants(filteredRestaurants);
        } catch (error) {
            console.error("Error fetching restaurants:", error);
        }
    };

    // Get login status and role
    const isLoggedIn = !!sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
        setSearchHistory(savedHistory);
    }, []);

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
                        
                        {/* Conditionally render based on user role */}
                        {role === "user" && (
                            <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        )}
                        {role === "owner" && (
                            <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner Dashboard</button>
                        )}
                        {role === "admin" && (
                            <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin Dashboard</button>
                        )}

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
                            
            <div className="restaurant-list">
                {restaurants.length > 0 ? (
                    [...restaurants]
                        .sort((a, b) => b.rating - a.rating) // Sort by rating (descending order)
                        .map((restaurant, index) => (
                            <div className="restaurant-card" key={index}>
                                <h3>{restaurant.name}</h3>
                                <p>Address: {restaurant.address || 'N/A'}</p>
                                <p>
                                    Cuisine: {restaurant.cuisine_type && restaurant.cuisine_type.length > 0
                                        ? restaurant.cuisine_type.join(', ')
                                        : 'Information not available'}
                                </p>
                                <p>
                                    Food Type: {restaurant.food_type && restaurant.food_type.length > 0
                                        ? restaurant.food_type.join(', ')
                                        : 'Information not available'}
                                </p>
                                <p>Price: {restaurant.price_range || 'N/A'}</p>
                                <p>Rating: ⭐ {restaurant.rating}</p>
                                <button onClick={() => {
                                    if (restaurant.source === 'google') {
                                        navigate(`/restaurant/google/${restaurant.place_id}`);
                                        console.log("Navigating to:", restaurant.source === 'google' ? `/restaurant/google/${restaurant.place_id}` : `/restaurant/${restaurant.id}`);
                                    } else {
                                        navigate(`/restaurant/${restaurant.id}`);
                                    }
                                    
                                }}>View Details</button>
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
