import axios from 'axios';
import api from '../utils/api'; 
import type { LoginData, RegisterData, AuthResponse } from '../types/auth';

const API_URL = process.env.VITE_API_URL || 'http://localhost:3000/api';

export async function login(data: LoginData): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await axios.post(`${API_URL}/auth/register`, data);
  return response.data;
}

export async function getCurrentUser(): Promise<{ email: string; name: string; language: string; avatar?: string; isActive: boolean; createdAt: string }> {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
}

export async function updateUser(data: Partial<{ email: string; name: string; language: string; avatar?: string; isActive: boolean }>): Promise<void> {
  const response = await api.put(`${API_URL}/auth/update`, data);
  return response.data;
}

export const uploadAvatar = async (formData: FormData) => {
  const response = await api.put(`${API_URL}/auth/update-avatar`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export async function updatePassword(data: { currentPassword: string; newPassword: string }): Promise<void> {
  const response = await api.put(`${API_URL}/auth/update-password`, data);
  if(response.status === 400) {
    throw new Error('Current password is incorrect');
  }
  return response.data;
}

export async function deleteUser(): Promise<void> {
  const response = await api.delete(`${API_URL}/auth/delete`);
  return response.data;
}

export async function requestPasswordReset(email: string): Promise<{ message: string }> {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return response.data;
}

export async function resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
  const response = await axios.post(`${API_URL}/auth/reset-password`, {
    token,
    newPassword,
  });
  return response.data;
}
