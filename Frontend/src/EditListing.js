import React, { useState, useEffect } from 'react';
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
    });

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
                setFormData({
                    name: data.name,
                    hours_of_operation: data.hours_of_operation,
                    website: data.website,
                    phone_number: data.phone_number,
                    description: data.description,
                    photos: null, // Photos will be uploaded separately
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

    const handleFileChange = (e) => {
        setFormData({ ...formData, photos: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const accessToken = sessionStorage.getItem('accessToken');
            const form = new FormData();
            Object.keys(formData).forEach((key) => {
                if (formData[key]) {
                    form.append(key, formData[key]);
                }
            });

            const response = await fetch(`http://127.0.0.1:8000/api/restaurants/${id}/`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: form,
            });

            if (response.ok) {
                alert('Restaurant updated successfully!');
                navigate('/manage-listings');
            } else {
                throw new Error('Failed to update restaurant.');
            }
        } catch (err) {
            console.error(err);
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
