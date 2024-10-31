// src/api.js
import axios from 'axios';


// Add a response interceptor to the Axios instance
axios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        // Redirect to login page if unauthorized
        if (error.response.status === 401) {
          localStorage.clear();
          if (typeof window !== 'undefined') {
            localStorage.setItem('message_403', error.response.data.message);
            window.location.href = '/login'; // Redirects to login page
          }
        } else if (error.response.status === 403) {
            localStorage.setItem('message_403', error.response.data.message);
            window.location.href = '/login'; 
        }
      }
      return Promise.reject(error);
    }
  );

  
// Configure the default Axios instance
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Create an Axios instance or use the default one
const api = axios.create();


export default axios; 
export { api };
