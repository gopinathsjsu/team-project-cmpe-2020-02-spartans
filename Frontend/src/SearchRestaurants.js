import React, { useState } from 'react';
import RestaurantList from './RestaurantList';

function SearchRestaurants() {
    const [searchQuery, setSearchQuery] = useState('');
    const [cuisineType, setCuisineType] = useState('');
    const [priceRange, setPriceRange] = useState('');
    const [rating, setRating] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    const handleSearchSubmit = async (e) => {
        e.preventDefault();
        try {
            const queryParams = new URLSearchParams({
                name: searchQuery,
                cuisine_type: cuisineType,
                price_range: priceRange,
                rating: rating,
            }).toString();

            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/search/?${queryParams}`);
            if (!response.ok) throw new Error('Failed to fetch restaurants');
            const data = await response.json();
            setRestaurants(data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Cuisine Type"
                    value={cuisineType}
                    onChange={(e) => setCuisineType(e.target.value)}
                />
                <select onChange={(e) => setPriceRange(e.target.value)}>
                    <option value="">Price Range</option>
                    <option value="$">Low</option>
                    <option value="$$">Medium</option>
                    <option value="$$$">High</option>
                </select>
                <select onChange={(e) => setRating(e.target.value)}>
                    <option value="">Rating</option>
                    <option value="1">1 Star</option>
                    <option value="2">2 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="5">5 Stars</option>
                </select>
                <button type="submit">Search</button>
            </form>

            {/* Display RestaurantList Component */}
            <RestaurantList restaurants={restaurants} />
        </div>
    );
}

export default SearchRestaurants;
