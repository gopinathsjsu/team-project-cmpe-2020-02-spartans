import React, { useEffect, useState } from "react";
import axios from "axios";

const RestaurantList = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch restaurants from the API
        axios
            .get("http://127.0.0.1:8000/api/restaurants/")
            .then((response) => {
                setRestaurants(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching restaurants:", error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div>
            <h1>Restaurant List</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Cuisine Type</th>
                        <th>Food Type</th>
                        <th>Price Range</th>
                        <th>Hours</th>
                    </tr>
                </thead>
                <tbody>
                    {restaurants.map((restaurant, index) => (
                        <tr key={index}>
                            <td>{restaurant.name}</td>
                            <td>{restaurant.address}</td>
                            <td>{restaurant.cuisine_type}</td>
                            <td>{restaurant.food_type}</td>
                            <td>{restaurant.price_range}</td>
                            <td>{restaurant.hours_of_operation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RestaurantList;
