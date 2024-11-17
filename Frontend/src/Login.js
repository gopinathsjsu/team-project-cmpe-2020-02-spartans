import React, { useState } from 'react';
import './Login.css';
import $ from 'jquery'; // For jQuery

function Login() {
    // State to manage input values
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle login submission
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear any previous errors

        // Basic validation check
        if (!email || !password) {
            setError('Please fill out all fields');
            return;
        }

        // Simulate a successful login
        alert('Login successful!');
        // Here, you could add code to call an API with the login credentials
    };

    // jQuery Effect to focus on input
    $(document).ready(function () {
        $('input').on('focus', function () {
            $(this).css('background-color', '#eef');
        }).on('blur', function () {
            $(this).css('background-color', '#fff');
        });
    });

    return (
//         <header class="component__09f24__RV1xd y-css-mhg9c5">
// <div class="header-container__09f24__NyE_t y-css-mhg9c5">
// <div class="inner-container__09f24__SzdG6 vertical-align__09f24__Oyd9P y-css-mhg9c5">


// <div class=" y-css-f38p0a" data-testid="hamburger">


// <button aria-label="" type="submit" class="y-css-1tzylno" data-activated="false" value="submit" data-button="true">



// <span class="y-css-1kbxh17"><span alt="" aria-hidden="true" role="img" class="icon--24-hamburger-v2 y-css-toqdhf">


// <svg width="24" height="24" class="icon_svg">
// <path d="M20 13H4a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2Zm0 6H4a1 1 0 0 1 0-2h16a1 1 0 0 1 0 2Zm0-12H4a1 1 0 0 1 0-2h16a1 1 0 1 1 0 2Z">
// </path>
// </svg>
// </span>
// </span>
// </button>
// </div>
// <div class="logo-nav-container__09f24__kgDvV y-css-mhg9c5">
// <div class="vertical-align__09f24__Oyd9P y-css-mhg9c5">
// <div class=" y-css-wokqsq">
// <div class="logo__09f24__ip022 logo-image__09f24__SXMH_ y-css-mhg9c5" id="logo" data-analytics-label="logo">
// <a href="/" class="logo-link__09f24__fS20h y-css-gem07k">Yelp</a>
// </div>
// </div>
// <div class="logo-title__09f24__Vxi08 y-css-944tjs">
// <h4 class="y-css-1tbcauc">for business</h4>
// </div>
// </div>
// </div>
// <div class="vertical-align__09f24__Oyd9P y-css-mhg9c5">
// <div class="vertical-align__09f24__Oyd9P y-css-l2r2jk">
// <div class=" y-css-vlys83">
// <span alt="" aria-hidden="true" role="img" class="icon--24-support-outline-v2 y-css-1u7t9bb">
// <svg width="24" height="24" class="icon_svg">
// <path d="M19.78 4.22C15.484-.074 8.52-.073 4.225 4.222c-4.295 4.296-4.295 11.26 0 15.556 4.295 4.295 11.259 4.296 15.555.002a11 11 0 0 0 0-15.56ZM17.62 5l-2.15 2.11a6 6 0 0 0-6.94 0L6.38 5a9 9 0 0 1 11.24 0ZM8 12a4 4 0 1 1 6.83 2.83 4.1 4.1 0 0 1-5.66 0A4 4 0 0 1 8 12ZM5 6.38l2.11 2.15a6 6 0 0 0 0 6.94L5 17.62A9 9 0 0 1 5 6.38ZM6.38 19l2.15-2.14a6 6 0 0 0 6.94 0L17.62 19a9 9 0 0 1-11.24 0ZM19 17.62l-2.14-2.15a6 6 0 0 0 0-6.94L19 6.38a9 9 0 0 1 0 11.24Z">
// </path>
// </svg>
// </span>
// </div>
// <div class=" y-css-mhg9c5">
// <a class=" marketing-number-link__09f24__EkpIu" href="tel:8777679357">
// <p class=" y-css-jf9frv" data-font-weight="semibold">(877) 767-9357</p>
// </a></div></div></div></div><div class="vertical-align__09f24__Oyd9P y-css-mhg9c5"></div></div>
        <div className="login-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                {error && <div className="error">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
}

export default Login;
