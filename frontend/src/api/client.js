import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://unguka-2ygk.onrender.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Network Error';
    return Promise.reject(new Error(message));
  }
);

export default apiClient;