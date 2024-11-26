import React from 'react';
import { useNavigate } from 'react-router-dom';

function RestaurantList({ restaurants }) {
    const navigate = useNavigate();

    if (restaurants.length === 0) return <p>No restaurants found.</p>;

    return (
        <div>
            {restaurants.map((restaurant) => (
                <div key={restaurant.id}>
                    <h3>{restaurant.name}</h3>
                    <p>Cuisine: {restaurant.cuisine_type}</p>
                    <p>Food Type: {restaurant.food_type}</p>
                    <p>Price: {restaurant.price_range}</p>
                    <p>Rating: ⭐ {restaurant.rating}</p>
                    <button onClick={() => navigate(`/restaurant/${restaurant.id}`)}>View Details</button>
                </div>
            ))}
        </div>
    );
}

export default RestaurantList;
