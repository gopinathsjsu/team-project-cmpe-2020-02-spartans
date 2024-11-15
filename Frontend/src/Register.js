
import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Register.css';

function Register() {
    const [isBusinessOwner, setIsBusinessOwner] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        businessName: '',
        address: '',
        contact: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const toggleRegistrationType = () => {
        setIsBusinessOwner(!isBusinessOwner);
        setFormData({
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            businessName: '',
            address: '',
            contact: ''
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Data:', formData);
    };

    return (
        <div className="container register-container d-flex justify-content-center align-items-center mt-5">
            <div className="card p-4 shadow-lg register-card">
                <h2 className="text-center mb-4">Register as {isBusinessOwner ? "Business Owner" : "User"}</h2>
                
                <button className="btn btn-outline-primary toggle-btn mb-3" onClick={toggleRegistrationType}>
                    Switch to {isBusinessOwner ? "User" : "Business Owner"} Registration
                </button>
                
                <form onSubmit={handleSubmit}>
                    {/* Shared Fields */}
                    <div className="form-group mb-3">
                        <label>Username</label>
                        <input type="text" className="form-control" name="username" value={formData.username} onChange={handleInputChange} required />
                    </div>
                    
                    <div className="form-group mb-3">
                        <label>Email</label>
                        <input type="email" className="form-control" name="email" value={formData.email} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group mb-3">
                        <label>Password</label>
                        <input type="password" className="form-control" name="password" value={formData.password} onChange={handleInputChange} required />
                    </div>

                    <div className="form-group mb-3">
                        <label>Confirm Password</label>
                        <input type="password" className="form-control" name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} required />
                    </div>

                    {/* Business Owner Only Fields */}
                    {isBusinessOwner && (
                        <>
                            <div className="form-group mb-3">
                                <label>Business Name</label>
                                <input type="text" className="form-control" name="businessName" value={formData.businessName} onChange={handleInputChange} required />
                            </div>
                            
                            <div className="form-group mb-3">
                                <label>Address</label>
                                <input type="text" className="form-control" name="address" value={formData.address} onChange={handleInputChange} required />
                            </div>

                            <div className="form-group mb-3">
                                <label>Contact Number</label>
                                <input type="text" className="form-control" name="contact" value={formData.contact} onChange={handleInputChange} required />
                            </div>
                        </>
                    )}

                    <button type="submit" className="btn btn-primary w-100 mt-3">Register</button>
                </form>
            </div>
        </div>
    );
}

export default Register;
