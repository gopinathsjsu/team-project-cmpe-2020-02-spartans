import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetails.css';
import { refreshAccessToken } from './auth';
import { useNavigate } from 'react-router-dom';

const RestaurantDetails = () => {
    const { id } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const CUISINE_CHOICES = [
        { id: 1, name: 'Greek' },
        { id: 2, name: 'Mexican' },
        { id: 3, name: 'Italian' },
        { id: 4, name: 'Chinese' },
    ];
    
    const FOOD_TYPE_CHOICES = [
        { id: 1, name: 'Vegan' },
        { id: 2, name: 'Vegetarian' },
        { id: 3, name: 'Gluten-free' },
    ];

    const fetchRestaurant = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`);
            if (!response.ok) {
                throw new Error('Failed to fetch restaurant details');
            }
            const data = await response.json();
            data.cuisine_type = data.cuisine_type.map(
                (id) => CUISINE_CHOICES.find((choice) => choice.id === id)?.name || 'Unknown'
            );
            data.food_type = data.food_type.map(
                (id) => FOOD_TYPE_CHOICES.find((choice) => choice.id === id)?.name || 'Unknown'
            );
            setRestaurant(data);
        } catch (error) {
            console.error('Error fetching restaurant details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/reviews/`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    useEffect(() => {
        fetchRestaurant();
        fetchReviews();
    }, [id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        let token = localStorage.getItem('accessToken'); // Retrieve token from local storage
    
        if (!token) {
            setErrorMessage('You must be logged in to submit a review.');
            return;
        }
    
        // Check if rating and review text are provided
        if (selectedRating === 0) {
            setErrorMessage('Please select a rating.');
            return;
        }
        if (reviewText.trim() === '') {
            setErrorMessage('Please write something for the review.');
            return;
        }
    
        const reviewData = {
            rating: selectedRating,
            review_text: reviewText,
        };
    
        try {
            let response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/reviews/add/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(reviewData),
            });
    
            // Handle expired token
            if (response.status === 401) {
                console.log("Access token expired. Attempting to refresh...");
                const newToken = await refreshAccessToken();
                if (!newToken) {
                    setErrorMessage('Session expired. Please log in again.');
                    return;
                }
                token = newToken;
    
                // Retry the request with the new token
                response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/reviews/add/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(reviewData),
                });
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend error response:', errorData);
    
                // Handle specific backend errors
                if (errorData.error === 'You have already reviewed this restaurant.') {
                    setErrorMessage('You have already submitted a review for this restaurant.');
                } else {
                    setErrorMessage(errorData.error || 'Failed to submit review. Please try again.');
                }
                return;
            }
    
            // Fetch updated restaurant details
            const updatedRestaurantResponse = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`);
            if (!updatedRestaurantResponse.ok) {
                throw new Error('Failed to fetch updated restaurant details');
            }
            const updatedRestaurant = await updatedRestaurantResponse.json();
            setRestaurant(updatedRestaurant); // Update restaurant details with new rating
    
            // Fetch updated reviews
            await fetchReviews();
    
            // Reset form state and display success message
            setSuccessMessage('Review submitted successfully!');
            setErrorMessage('');
            setSelectedRating(0);
            setReviewText('');
        } catch (error) {
            console.error('Error submitting review:', error);
            setErrorMessage('Failed to submit review. Please try again.');
        }
    };    

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= selectedRating ? 'selected' : ''}`}
                    onClick={() => setSelectedRating(i)}
                    style={{ cursor: 'pointer', fontSize: '24px' }}
                >
                    {i <= selectedRating ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

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
            <p className="details-text">Cuisine Type: {restaurant.cuisine_type?.join(', ')}</p>
            <p className="details-text">Food Type: {restaurant.food_type?.join(', ')}</p>
            <p className="details-text">Price: {restaurant.price_range}</p>
            <p className="details-text">Rating: ⭐ {restaurant.rating}</p>
            <p className="details-text">Description: {restaurant.description}</p>
            <p className="details-address">
                Address: {restaurant.address}, {restaurant.city}, {restaurant.state}{' '}
                {restaurant.zip_code}
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

            {/* Reviews Section */}
            <div className="reviews-container">
                <h2>User Reviews</h2>
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="review">
                            <p>
                                <strong>{review.user}</strong> - ⭐ {review.rating}
                            </p>
                            <p>{review.review_text}</p> {/* Ensure use of 'review_text' */}
                        </div>
                    ))
                ) : (
                    <p>No reviews yet. Be the first to review!</p>
                )}
            </div>

            {/* Review Form */}
            <div className="review-form-container">
                <h2>Submit a Review</h2>
                {successMessage && <p className="success-message">{successMessage}</p>}
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <form onSubmit={handleSubmitReview}>
                    <div className="form-group">
                        <label htmlFor="rating">Rating:</label>
                        <div className="stars">{renderStars()}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="reviewText">Review Text:</label>
                        <textarea
                            id="reviewText"
                            name="reviewText"
                            rows="4"
                            value={reviewText} // Updated state binding
                            onChange={(e) => setReviewText(e.target.value)} // Updated handler
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">
                        Submit Review
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RestaurantDetails;
