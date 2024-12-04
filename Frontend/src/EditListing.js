import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useParams, useNavigate } from 'react-router-dom';

function EditListing() {
    const { id } = useParams(); // Get restaurant ID from URL
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        hours_of_operation: '',
        website: '',
        phone_number: '',
        description: '',
        photos: null,
        cuisine_type: [],
        food_type: [],
    });

    const CUISINE_CHOICES = [
        { value: 1, label: 'Greek' },
        { value: 2, label: 'Mexican' },
        { value: 3, label: 'Italian' },
        { value: 4, label: 'Chinese' },
    ];

    const FOOD_TYPE_CHOICES = [
        { value: 1, label: 'Vegan' },
        { value: 2, label: 'Vegetarian' },
        { value: 3, label: 'Gluten-free' },
    ];

    useEffect(() => {
        fetchRestaurantDetails();
    }, [id]);

    const fetchRestaurantDetails = async () => {
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                const mappedCuisine = data.cuisine_type.map((name) =>
                    CUISINE_CHOICES.find((choice) => choice.label === name)
                );
                const mappedFoodType = data.food_type.map((name) =>
                    FOOD_TYPE_CHOICES.find((choice) => choice.label === name)
                );

                setFormData({
                    name: data.name,
                    hours_of_operation: data.hours_of_operation,
                    website: data.website,
                    phone_number: data.phone_number,
                    description: data.description,
                    photos: null, // Photos will be uploaded separately
                    cuisine_type: mappedCuisine,
                    food_type: mappedFoodType,
                });
            } else {
                throw new Error('Failed to fetch restaurant details.');
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSelectChange = (selected, field) => {
        setFormData({ ...formData, [field]: selected });
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, photos: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                if (key === "cuisine_type" || key === "food_type") {
                    formData[key]?.forEach((item) => form.append(key, item.value));
                } else if (formData[key]) {
                    form.append(key, formData[key]);
                }
            });
    
            console.log("Submitting Form Data:", Array.from(form.entries()));
    
            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: form,
            });
    
            if (response.ok) {
                alert('Restaurant updated successfully!');
                fetchRestaurantDetails(); // Re-fetch data to refresh the form
                navigate('/BusinessOwnerDashboard');
            } else {
                const errorData = await response.json();
                console.error("Error Details:", errorData);
                alert('Failed to update restaurant. Please check your input.');
            }
        } catch (err) {
            console.error('An error occurred:', err);
        }
    };    

    return (
        <div className="container">
            <h2>Edit Restaurant</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Cuisine Type</label>
                    <Select
                        options={CUISINE_CHOICES}
                        isMulti
                        value={formData.cuisine_type}
                        onChange={(selected) => handleSelectChange(selected, 'cuisine_type')}
                        placeholder="Select Cuisine Types"
                    />
                </div>
                <div className="form-group">
                    <label>Food Type</label>
                    <Select
                        options={FOOD_TYPE_CHOICES}
                        isMulti
                        value={formData.food_type}
                        onChange={(selected) => handleSelectChange(selected, 'food_type')}
                        placeholder="Select Food Types"
                    />
                </div>
                <div className="form-group">
                    <label>Hours of Operation</label>
                    <input
                        type="text"
                        name="hours_of_operation"
                        value={formData.hours_of_operation}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Website</label>
                    <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="text"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="form-control"
                    />
                </div>
                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="form-control"
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Photos</label>
                    <input
                        type="file"
                        name="photos"
                        onChange={handleFileChange}
                        className="form-control"
                    />
                </div>
                <button type="submit" className="btn btn-primary">Save Changes</button>
            </form>
        </div>
    );
}

export default EditListing;
