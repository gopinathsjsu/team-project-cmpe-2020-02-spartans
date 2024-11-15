import React, { useState } from 'react';

function SearchRestaurants() {
    const [searchTerm, setSearchTerm] = useState('');
    const [restaurants, setRestaurants] = useState([]);

    const handleSearch = async () => {
        // Replace with API call
        const response = await fetch(`/api/restaurants?search=${searchTerm}`);
        const data = await response.json();
        setRestaurants(data);
    };

    return (
        <div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search restaurants by name, cuisine, etc."
            />
            <button onClick={handleSearch}>Search</button>
            <ul>
                {restaurants.map((restaurant) => (
                    <li key={restaurant.id}>{restaurant.name}</li>
                ))}
            </ul>
        </div>
    );
}

export default SearchRestaurants;
