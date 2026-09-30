const getBaseApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim()) {
    let clean = envUrl.trim().replace(/\/+$/, '');
    if (!clean.endsWith('/api')) {
      clean += '/api';
    }
    return clean;
  }
  if (
    typeof window !== 'undefined' &&
    window.location.hostname !== 'localhost' &&
    window.location.hostname !== '127.0.0.1'
  ) {
    return 'https://cosmic-nidhi-backend.onrender.com/api';
  }
  return 'http://localhost:5000/api';
};

export const API_URL = getBaseApiUrl();

export default API_URL;

