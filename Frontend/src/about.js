import React,{ useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './aboutpage.css'; // Custom CSS for the About Page
import Footer from './Footer';

function AboutPage() {
  const [searchQuery, setSearchQuery] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [cuisine, setCuisine] = useState([]);
    const [foodType, setFoodType] = useState([]);
    const [priceRange, setPriceRange] = useState('');
    const [rating, setRating] = useState('');
    const [restaurants, setRestaurants] = useState([]);
    const navigate = useNavigate();
    const isLoggedIn = !!sessionStorage.getItem("accessToken");
    const role = sessionStorage.getItem("role");

    const handleLogout = () => {
        sessionStorage.clear(); // Clear session data
        navigate("/"); // Redirect to the home page
    };
  return (
    <div className="about-container">
      <nav className="navbar">
                    <div className="logo" onClick={() => navigate('/')}>🍽️ Restaurant Finder</div>
                    <div className="nav-links">
                        <button onClick={() => navigate('/')} className="nav-item">Home</button>
                        
                        {/* Conditionally render based on user role */}
                        {role === "user" && (
                            <button onClick={() => navigate('/profile')} className="nav-item">My Profile</button>
                        )}
                        {role === "owner" && (
                            <button onClick={() => navigate('/BusinessOwnerDashboard')} className="nav-item">Business Owner Dashboard</button>
                        )}
                        {role === "admin" && (
                            <button onClick={() => navigate('/AdminDashboard')} className="nav-item">Admin Dashboard</button>
                        )}

                        <button onClick={() => navigate('/about')} className="nav-item">About Us</button>

                        {/* Show login/register or logout button based on login status */}
                        {!isLoggedIn ? (
                            <>
                                <button onClick={() => navigate('/login')} className="login-btn">Login</button>
                                <button onClick={() => navigate('/register')} className="login-btn">Register</button>
                            </>
                        ) : (
                            <button onClick={handleLogout} className="login-btn">Logout</button>
                        )}
                    </div>
                </nav>
      {/* Hero Section */}
      <div className="hero-section text-center py-5 bg-primary text-white">
        <h1>About Restaurant Finder</h1>
        <p>Discover and explore the best dining experiences near you.</p>
      </div>

      {/* Mission Section */}
      <div className="mission-section text-center py-5 bg-light">
        <div className="container">
        
          <h2>Our Mission</h2>
          <p className="lead">
            Restaurant Finder is dedicated to helping people find great restaurants in their area. Whether you're craving vegan, vegetarian, or just looking for a new spot to try, our platform helps you discover the best places to eat based on your preferences.
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section text-center py-5">
        <div className="container">
          <h2>Key Features</h2>
          <div className="row">
            <div className="col-md-4 feature-item">
              <h3>Browse Listings</h3>
              <p>Search through a variety of restaurants based on location, cuisine, and more.</p>
            </div>
            <div className="col-md-4 feature-item">
              <h3>Personalized Experience</h3>
              <p>Customize your search by food preferences such as vegan, vegetarian, or non-vegetarian options.</p>
            </div>
            <div className="col-md-4 feature-item">
              <h3>Restaurant Owners Dashboard</h3>
              <p>Restaurant owners can easily manage their listings and interact with customers through the platform.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="team-section text-center py-5 bg-light">
        <div className="container">
          <h2>Meet the Team</h2>
          <p className="lead">Our team is passionate about making dining experiences easier and more enjoyable for everyone.</p>
          <div className="row">
            <div className="col-md-3">
              <div className="team-member">
                <img src={require('./Eric.png')} alt="ERIC PHAM" className="img-fluid rounded-circle" />
                <h4>ERIC PHAM</h4>
                
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src="https://via.placeholder.com/150" alt="Jane Smith" className="img-fluid rounded-circle" />
                <h4>FAISAL BUDHWANI</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src="https://via.placeholder.com/150" alt="Samuel Green" className="img-fluid rounded-circle" />
                <h4>HAROON RAZZACK</h4>
              </div>
            </div>
            <div className="col-md-3">
              <div className="team-member">
                <img src= {require('./SID.jpeg')} alt="Samuel Green" className="img-fluid rounded-circle" />
                <h4>SIDDHARTH KULKARNI</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div>
                {/* Main Content */}
                <Footer />
            </div>
    </div>
  );
}

export default AboutPage;