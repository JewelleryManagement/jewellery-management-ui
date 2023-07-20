import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:8080', // Replace with your server's URL
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

export default instance;