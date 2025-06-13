import axios from 'axios';
import api from '../utils/api'; 
import type { LoginData, RegisterData, AuthResponse } from '../types/auth';

const API_URL = 'http://localhost:3000/api'; 

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
}

export async function getCurrentUser(): Promise<{ email: string; name: string }> {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
}