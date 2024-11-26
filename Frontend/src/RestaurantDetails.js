import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetails.css';

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`);
                if (!response.ok) {
                    throw new Error('Failed to fetch restaurant details');
                }
                const data = await response.json();
                setRestaurant(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching restaurant details:', error);
                setLoading(false);
            }
        };

        fetchRestaurant();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!restaurant) {
        return <p>Restaurant not found.</p>;
    }

    return (
        <div className="details-container">
            <div className="details-header">
                <h1>{restaurant.name}</h1>
            </div>
            <p className="details-text">Cuisine Type: {restaurant.cuisine_type}</p>
            <p className="details-text">Food Type: {restaurant.food_type}</p>
            <p className="details-text">Price: {restaurant.price_range}</p>
            <p className="details-text">Rating: ⭐ {restaurant.rating}</p>
            <p className="details-address">
                Address: {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zip_code}
            </p>
            <p className="details-hours">Hours: {restaurant.hours_of_operation || 'Not Available'}</p>
            <p className="details-contact">
                Contact: {restaurant.phone_number || 'Not Available'}
            </p>
            <p className="details-contact">
                Website:{' '}
                {restaurant.website ? (
                    <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                        {restaurant.website}
                    </a>
                ) : (
                    'Not Available'
                )}
            </p>
        </div>
    );
};

export default RestaurantDetails;
