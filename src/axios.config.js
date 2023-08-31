import axios from 'axios';

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_BACKEND_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

export default instance;