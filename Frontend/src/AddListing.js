// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './AddListing.css';


// function AddListing() {
//     const [formData, setFormData] = useState({
//         name: '',
//         address: '',
//         contact: '',
//         hours: '',
//         category: '',
//         website: '',
//         description: '',
//         photos: null,
//         menu: '',
//         priceRange: '',
//         amenities: [],
//         features: [],
//         paymentOptions: [],
//         reservationLink: '',
//         deliveryOptions: '',
//         healthSafety: '',
//         policies: ''
//     });

//     const handleChange = (e) => {
//         const { name, value, files } = e.target;
//         if (name === "photos") {
//             setFormData({ ...formData, photos: files });
//         } else {
//             setFormData({ ...formData, [name]: value });
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Handle form submission, e.g., API call to save listing
//         console.log(formData);
//     };

//     return (
//         <div className="container add-listing-container p-4">
//             <h2 className="text-center mb-4">Add New Listing</h2>
//             <form onSubmit={handleSubmit} className="add-listing-form">
                
//                 <div className="mb-3">
//                     <label className="form-label">Business Name</label>
//                     <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Address</label>
//                     <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Contact Information</label>
//                     <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Operating Hours</label>
//                     <input type="text" className="form-control" name="hours" value={formData.hours} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Category</label>
//                     <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Website Link</label>
//                     <input type="url" className="form-control" name="website" value={formData.website} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Business Description</label>
//                     <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Upload Photos</label>
//                     <input type="file" className="form-control" name="photos" multiple onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Menu / Services Offered</label>
//                     <textarea className="form-control" name="menu" value={formData.menu} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Price Range</label>
//                     <input type="text" className="form-control" name="priceRange" value={formData.priceRange} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Amenities</label>
//                     <input type="text" className="form-control" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="E.g., Wi-Fi, Parking" />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Special Features</label>
//                     <input type="text" className="form-control" name="features" value={formData.features} onChange={handleChange} placeholder="E.g., Live Music, Pet-Friendly" />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Payment Options</label>
//                     <input type="text" className="form-control" name="paymentOptions" value={formData.paymentOptions} onChange={handleChange} placeholder="E.g., Cash, Credit Card" />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Reservation Options</label>
//                     <input type="text" className="form-control" name="reservationLink" value={formData.reservationLink} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Delivery / Takeout Options</label>
//                     <textarea className="form-control" name="deliveryOptions" value={formData.deliveryOptions} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Health & Safety Protocols</label>
//                     <textarea className="form-control" name="healthSafety" value={formData.healthSafety} onChange={handleChange} />
//                 </div>

//                 <div className="mb-3">
//                     <label className="form-label">Business Policies</label>
//                     <textarea className="form-control" name="policies" value={formData.policies} onChange={handleChange} />
//                 </div>

//                 <button type="submit" className="btn btn-primary w-100">Submit Listing</button>
//             </form>
//         </div>
//     );
// }

// export default AddListing;


import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AddListing.css';

function AddListing() {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact: '',
        hours: '',
        category: '',
        website: '',
        description: '',
        photos: null,
        menu: '',
        priceRange: '',
        amenities: [],
        features: [],
        paymentOptions: [],
        reservationLink: '',
        deliveryOptions: '',
        healthSafety: '',
        policies: ''
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setFormData({
            ...formData,
            [name]: name === "photos" ? files : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="add-listing-container d-flex flex-column align-items-center">
            <div className="card listing-card shadow-lg p-4 mt-5">
                <h2 className="text-center mb-4">Create a New Listing</h2>
                <form onSubmit={handleSubmit}>
                    {/* Business Name */}
                    <div className="form-group mb-3">
                        <label>Business Name</label>
                        <input type="text" className="form-control" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    
                    {/* Address */}
                    <div className="form-group mb-3">
                        <label>Address</label>
                        <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} required />
                    </div>

                    {/* Contact */}
                    <div className="form-group mb-3">
                        <label>Contact Information</label>
                        <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleChange} required />
                    </div>

                    {/* Hours */}
                    <div className="form-group mb-3">
                        <label>Operating Hours</label>
                        <input type="text" className="form-control" name="hours" value={formData.hours} onChange={handleChange} />
                    </div>

                    {/* Category */}
                    <div className="form-group mb-3">
                        <label>Category</label>
                        <input type="text" className="form-control" name="category" value={formData.category} onChange={handleChange} />
                    </div>

                    {/* Description */}
                    <div className="form-group mb-3">
                        <label>Business Description</label>
                        <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} />
                    </div>

                    {/* Photos */}
                    <div className="form-group mb-3">
                        <label>Upload Photos</label>
                        <input type="file" className="form-control" name="photos" multiple onChange={handleChange} />
                    </div>

                    {/* Amenities */}
                    <div className="form-group mb-3">
                        <label>Amenities</label>
                        <input type="text" className="form-control" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="E.g., Wi-Fi, Parking" />
                    </div>

                    <div className="mb-3">
                     <label className="form-label">Website Link</label>
                  <input type="url" className="form-control" name="website" value={formData.website} onChange={handleChange} />
             </div>

             <div className="mb-3">
                   <label className="form-label">Menu / Services Offered</label>
                  <textarea className="form-control" name="menu" value={formData.menu} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Price Range</label>
                    <input type="text" className="form-control" name="priceRange" value={formData.priceRange} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Amenities</label>
                    <input type="text" className="form-control" name="amenities" value={formData.amenities} onChange={handleChange} placeholder="E.g., Wi-Fi, Parking" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Special Features</label>
                    <input type="text" className="form-control" name="features" value={formData.features} onChange={handleChange} placeholder="E.g., Live Music, Pet-Friendly" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Payment Options</label>
                    <input type="text" className="form-control" name="paymentOptions" value={formData.paymentOptions} onChange={handleChange} placeholder="E.g., Cash, Credit Card" />
                </div>

                <div className="mb-3">
                    <label className="form-label">Reservation Options</label>
                    <input type="text" className="form-control" name="reservationLink" value={formData.reservationLink} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Delivery / Takeout Options</label>
                    <textarea className="form-control" name="deliveryOptions" value={formData.deliveryOptions} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Health & Safety Protocols</label>
                    <textarea className="form-control" name="healthSafety" value={formData.healthSafety} onChange={handleChange} />
                </div>

                <div className="mb-3">
                    <label className="form-label">Business Policies</label>
                    <textarea className="form-control" name="policies" value={formData.policies} onChange={handleChange} />
                </div>

                    {/* Submission */}
                    <button type="submit" className="btn btn-primary w-100 mt-4 animate-submit">Add Listing</button>
                </form>
            </div>
        </div>
    );
}

export default AddListing;


