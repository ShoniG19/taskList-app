import api from '../utils/api';
import type { Task, PaginatedTasks } from '../types/task';

const API_URL = import.meta.env.VITE_API_URL;

export const fetchTasks = async (
  page: number = 1,
  limit: number = 10,
  sort: "dueDate" | "priority" | "alphabetical" = "dueDate",
  sortDirection: "asc" | "desc" = "asc"
): Promise<PaginatedTasks> => {
  const res = await api.get(`${API_URL}/tasks`, {
    params: { page, limit, sort, sortDirection },
  });
  return res.data;
};

export const createTask = async (title: string): Promise<Task> => {
  const res = await api.post(`${API_URL}/tasks`, { title });
  return res.data;
};

export const updateTask = async (id:number, task: Task): Promise<Task> => {
  const res = await api.put(`${API_URL}/tasks/${id}`, task);
  return res.data;
};

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`${API_URL}/tasks/${id}`);
};
