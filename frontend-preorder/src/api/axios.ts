import axios from 'axios';

// Ini adalah alamat server backend Anda
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export default api;