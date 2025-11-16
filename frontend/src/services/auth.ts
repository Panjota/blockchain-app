import axios from 'axios';
import { LoginCredentials, RegisterCredentials, ApiResponse } from '../types';

const API_BASE_URL = '/api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Login failed');
    }
  },

  async register(credentials: RegisterCredentials): Promise<ApiResponse> {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.error || 'Registration failed');
    }
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user: any) {
    localStorage.setItem('user', JSON.stringify(user));
  }
};