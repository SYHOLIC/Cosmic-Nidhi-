export const API_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
   window.location.hostname !== 'localhost' &&
   window.location.hostname !== '127.0.0.1'
    ? 'https://cosmic-nidhi-backend.onrender.com/api'
    : 'http://localhost:5000/api');

export default API_URL;
