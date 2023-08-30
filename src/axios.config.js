import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://3.123.158.214:8080',
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

export default instance;