// apiClient.js
import axios from 'axios';
import { Platform } from 'react-native'; // 1. Importa 'Platform'

// 2. Define las URLs para cada plataforma
const API_URL_WEB = 'http://localhost:3000/api';         // Para el navegador
const API_URL_MOBILE = 'http://192.168.1.14:3000/api'; // ¡Usa tu IP de Wi-Fi aquí!

// 3. Elige la URL correcta basado en la plataforma
const API_URL = Platform.OS === 'web' ? API_URL_WEB : API_URL_MOBILE;

// 4. Crea el cliente de Axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;