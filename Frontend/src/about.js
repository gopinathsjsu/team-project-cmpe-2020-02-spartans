import React from 'react';
import './aboutpage.css'; // Custom CSS for the About Page

function AboutPage() {
  return (
    <div className="about-container">
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
            <div className="col-md-4">
              <div className="team-member">
                <img src="https://via.placeholder.com/150" alt="John Doe" className="img-fluid rounded-circle" />
                <h4>John Doe</h4>
                <p>Founder & CEO</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="team-member">
                <img src="https://via.placeholder.com/150" alt="Jane Smith" className="img-fluid rounded-circle" />
                <h4>Jane Smith</h4>
                <p>Lead Developer</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="team-member">
                <img src="https://via.placeholder.com/150" alt="Samuel Green" className="img-fluid rounded-circle" />
                <h4>Samuel Green</h4>
                <p>Product Manager</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="cta-section text-center py-5 bg-primary text-white">
        <div className="container">
          <h2>Get Started Today!</h2>
          <p>Sign up and start exploring the best restaurants around you.</p>
          <a href="/register" className="btn btn-light btn-lg">Sign Up Now</a>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
