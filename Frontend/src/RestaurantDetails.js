import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function RestaurantDetails() {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);

    useEffect(() => {
        async function fetchRestaurant() {
            const response = await fetch(`/api/restaurant/${id}`);
            const data = await response.json();
            setRestaurant(data);
        }
        fetchRestaurant();
    }, [id]);

    return (
        <div>
            {restaurant ? (
                <div>
                    <h2>{restaurant.name}</h2>
                    <p>{restaurant.description}</p>
                    <h3>Reviews:</h3>
                    <ul>
                        {restaurant.reviews.map((review, index) => (
                            <li key={index}>{review.comment}</li>
                        ))}
                    </ul>
                </div>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}

export default RestaurantDetails;
