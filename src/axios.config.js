import axios from 'axios';
import store from "@/store/store";

const instance = axios.create({
    baseURL: process.env.VUE_APP_BASE_BACKEND_URL,
    timeout: 5000,
    headers: { 'Content-Type': 'application/json' },
});

instance.interceptors.request.use(
    (config) => {
      const token = store.getters["auth/getToken"]
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

export default instance;