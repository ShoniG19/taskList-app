export interface Task {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  priority: string;
  dueDate?: string;
}

export interface PaginatedTasks {
  tasks: Task[];
  page: number;
  totalPages: number;
  totalItems: number;
  completedCount: number;
  highPriorityCount: number;
  dueTodayCount: number;
}