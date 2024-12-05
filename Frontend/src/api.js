import axios from 'axios';
import { refreshAccessToken } from './auth';

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor
api.interceptors.request.use(
    async (config) => {
        let accessToken = localStorage.getItem('accessToken');

        // Check if access token is expired
        if (!accessToken || isTokenExpired(accessToken)) {
            accessToken = await refreshAccessToken();
        }

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Check if token is expired
const isTokenExpired = (token) => {
    try {
        const [, payload] = token.split('.');
        const decoded = JSON.parse(atob(payload));
        return decoded.exp * 1000 < Date.now();
    } catch (error) {
        console.error('Failed to parse token:', error);
        return true;
    }
};

const API_BASE_URL = 'http://127.0.0.1:8000/api/restaurants';

export const getGooglePlaceDetails = async (placeId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/google_place/${placeId}/`);
        return response.data;
    } catch (error) {
        console.error("Error fetching Google Place details:", error);
        throw error;
    }
};

export default api;
