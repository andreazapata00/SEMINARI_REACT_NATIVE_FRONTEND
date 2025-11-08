
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';


const tokenKey = 'userToken';

export async function saveToken(token) {
  if (Platform.OS === 'web') {
    try {
      localStorage.setItem(tokenKey, token);
    } catch (e) {
      console.error('Error guardando token en localStorage', e);
    }
  } else {
    await SecureStore.setItemAsync(tokenKey, token);
  }
}

export async function getToken() {
  if (Platform.OS === 'web') {
    try {
      return localStorage.getItem(tokenKey);
    } catch (e) {
      console.error('Error obteniendo token de localStorage', e);
      return null;
    }
  } else {
    return await SecureStore.getItemAsync(tokenKey);
  }
}

export async function deleteToken() {
  if (Platform.OS === 'web') {
    try {
      localStorage.removeItem(tokenKey);
    } catch (e) {
      console.error('Error borrando token de localStorage', e);
    }
  } else {
    await SecureStore.deleteItemAsync(tokenKey);
  }
}