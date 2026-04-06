import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Alamat Backend kamu
});

// Otomatis kirim Token JWT di setiap request kalau user sudah login
API.interceptors.request.use((req) => {
    const token = localStorage.getItem('token');
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

export default API;