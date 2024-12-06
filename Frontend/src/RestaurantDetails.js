import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './RestaurantDetails.css';
import { refreshAccessToken } from './auth';
import { useLocation } from 'react-router-dom';
import { getGooglePlaceDetails } from './api';
import ImageViewer from './ImageViewer';

import Navbar from './Navbar';
import Footer from './Footer';


const RestaurantDetails = () => {
    const { id, placeId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRating, setSelectedRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const location = useLocation();
    const { priceLevel } = location.state || {};
    const API_URL = process.env.REACT_APP_API_URL;
    // const [existing_photos, setExistingPhotos] = useState([]);

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

    useEffect(() => {
        if (placeId) {
            // for google places
            fetchGooglePlace();
        } else if (id) {
            // for local restaurant
            fetchRestaurant();
            fetchReviews();
        }
    }, [id, placeId]);

    const fetchRestaurant = async () => {
        try {
            const response = await fetch(`${API_URL}/restaurants/${id}/`);
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

    const fetchGooglePlace = async () => {
        try {
            console.log("Fetching Google Place details for:", placeId);
            const details = await getGooglePlaceDetails(placeId);
            console.log("Fetched Google Place details:", details);

            if (details.price_level === undefined) {
                console.log("Price level is not available for this place");
            }
    
            // Price level mapping object
            const priceLevelMapping = {
                1: '$',
                2: '$$',
                3: '$$$',
            };
    
            // Safely map price level (fallback to 'Not Available' if price_level is missing)
            const priceRange = details.price_level
                ? priceLevelMapping[details.price_level] || 'N/A'
                : 'Not Available';
                
    
            const normalizedDetails = {
                name: details.name,
                address: details.address,
                rating: details.rating,
                phone_number: details.phone_number || 'Not available',
                website: details.website || 'Not available',
                opening_hours: details.opening_hours ? details.opening_hours.join(', ') : 'Not available',
                cuisine_type: details.cuisine_type?.length > 0 ? details.cuisine_type : ['Information not available'],
                food_type: details.food_type?.length > 0 ? details.food_type : ['Information not availalble'],
                price_range: priceRange, 
                reviews: details.reviews || [],
                source: 'google',
                description: details.description || 'No description available',
                existing_photos: details.photos || [],
            };
    
            console.log("Normalized Details with Price Range:", normalizedDetails);
            setRestaurant(normalizedDetails);
        } catch (error) {
            console.error('Error fetching Google Place details:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchReviews = async () => {
        try {
            const response = await fetch(`${API_URL}/restaurants/${id}/reviews/`);
            if (!response.ok) {
                throw new Error('Failed to fetch reviews');
            }
            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error('Error fetching reviews:', error);
        }
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        let token = sessionStorage.getItem('accessToken'); // Retrieve token from local storage
        
        if (placeId) {
            // can't submit review for google places
            setErrorMessage('Reviews cannot be submitted for Google Places restaurants through this app.');
            return;
        }

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
            let response = await fetch(`${API_URL}/restaurants/${id}/reviews/add/`, {
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
                response = await fetch(`${API_URL}/restaurants/${id}/reviews/add/`, {
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
            const updatedRestaurantResponse = await fetch(`${API_URL}/restaurants/${id}/`);
            if (!updatedRestaurantResponse.ok) {
                throw new Error('Failed to fetch updated restaurant details');
            }
            const updatedRestaurant = await updatedRestaurantResponse.json();
            updatedRestaurant.cuisine_type = updatedRestaurant.cuisine_type.map(
                (id) => CUISINE_CHOICES.find((choice) => choice.id === id)?.name || 'Unknown'
            );
            updatedRestaurant.food_type = updatedRestaurant.food_type.map(
                (id) => FOOD_TYPE_CHOICES.find((choice) => choice.id === id)?.name || 'Unknown'
            );
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
        <>
        <div><Navbar/></div>
        
      
        <div className="details-container">
            <div className="details-header">
                <h1>{restaurant.name}</h1>
            </div>
    
            {/* Conditional Rendering Based on Source */}
            {restaurant.source === 'google' ? (
                // Google Places Restaurant Details
                <>
                    <p className="details-text">Cuisine Type: {restaurant.cuisine_type || 'Not Available'}</p>
                    <p className="details-text">Food Type: {restaurant.food_type || 'Not Available'}</p>
                    <p className="details-text">Price: {restaurant.priceLevel || restaurant.price_range || 'Not Available'  }</p>
                    <p className="details-text">Rating: ⭐ {restaurant.rating || 'Not Available'}</p>
                    <p className="details-description">Description: {restaurant.description || 'Not Available'}</p>
                    <p className="details-address">Address: {restaurant.address || 'Not Available'}</p>
                    <p className="details-hours">Opening Hours: {restaurant.opening_hours || 'Not Available'}</p>
                    <p className="details-contact">
                        Contact: {restaurant.phone_number || 'Not Available'}
                    </p>
                    <p className="details-contact">
                        Website: {restaurant.website ? (
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                                {restaurant.website}
                            </a>
                        ) : (
                            'Not Available'
                        )}
                    </p>
                    <div className="form-group mb-3">
                    <label>Photos</label>
                    <div className="d-flex flex-wrap">
                    {restaurant.photos && restaurant.photos.length > 0 ? (
                        restaurant.photos.map((photo, index) => (
                            <div key={index} className="m-2">
                                <ImageViewer 
                                    thumbnailUrl={photo.thumbnail_url}
                                    highResUrl={photo.high_res_url}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No photos available.</p>
                    )}
                    </div>
                    </div>
    
                    {/* Google Reviews Section */}
                    {restaurant.reviews && restaurant.reviews.length > 0 && (
                        <div className="reviews-container">
                            <h2>User Reviews</h2>
                            {restaurant.reviews.map((review, index) => (
                                <div key={index} className="review">
                                    <p>
                                        <strong>{review.author_name}</strong> - ⭐ {review.rating}
                                    </p>
                                    <p>{review.text}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                // Local Database Restaurant Details
                <>
                    <p className="details-text">Cuisine Type: {restaurant.cuisine_type?.join(', ') || 'Not Available'}</p>
                    <p className="details-text">Food Type: {restaurant.food_type?.join(', ') || 'Not Available'}</p>
                    <p className="details-text">Price: {restaurant.price_range || 'Not Available'}</p>
                    <p className="details-text">Rating: ⭐ {restaurant.rating || 'Not Available'}</p>
                    <p className="details-text">Description: {restaurant.description || 'Not Available'}</p>
                    <p className="details-address">
                        Address: {restaurant.address}, {restaurant.city}, {restaurant.state} {restaurant.zip_code}
                    </p>
                    <p className="details-hours">Hours: {restaurant.hours_of_operation || 'Not Available'}</p>
                    <p className="details-contact">
                        Contact: {restaurant.phone_number || 'Not Available'}
                    </p>
                    <p className="details-contact">
                        Website: {restaurant.website ? (
                            <a href={restaurant.website} target="_blank" rel="noopener noreferrer">
                                {restaurant.website}
                            </a>
                        ) : (
                            'Not Available'
                        )}
                    </p>
    
                    <div className="form-group mb-3">
                    <label>Photos</label>
                    <div className="d-flex flex-wrap">
                        {restaurant.photos.map((photo, index) => (
                            <div key={index} className="m-2">
                                <ImageViewer 
                                    thumbnailUrl={photo.thumbnail_url}
                                    highResUrl={photo.high_res_url}
                                />
                            </div>
                            
                        ))}
                    </div>
                    </div>
                    {/* Reviews Section */}
                    <div className="reviews-container">
                        <h2>User Reviews</h2>
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <div key={review.id} className="review">
                                    <p>
                                        <strong>{review.user}</strong> - ⭐ {review.rating}
                                    </p>
                                    <p>{review.review_text}</p>
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
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                />
                            </div>
                            <button type="submit" className="btn btn-primary">
                                Submit Review
                            </button>
                        </form>
                    </div>
                </>
            )}
        </div>
        <div><Footer/></div>
        </>
    );    
};

export default RestaurantDetails;
