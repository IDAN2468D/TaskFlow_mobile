import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// For local development, automatically resolve local IP from Expo
let API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    API_URL = `http://${ip}:3000`;
  } else {
    API_URL = Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  }
}

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    if (token && token.trim() !== '') {
      config.headers.Authorization = `Bearer ${token.trim()}`;
    }
  } catch (e) {
    console.warn('Failed to fetch auth token from SecureStore');
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data && typeof error.response.data === 'string' && error.response.data.includes('<!DOCTYPE html>')) {
      return Promise.reject({
        ...error,
        message: `Server returned an HTML error page (Status: ${error.response.status}). Check backend logs.`,
        isHtmlError: true
      });
    }
    return Promise.reject(error);
  }
);

export default api;
