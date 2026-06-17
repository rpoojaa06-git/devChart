/**
 * Shared TypeScript type definitions for the club collaboration platform
 */

/**
 * Task entity type
 */
export interface PopulatedRef {
  _id: string;
  name?: string;
  title?: string;
  [key: string]: any;
}

export interface Task {
  _id?: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  project?: string | PopulatedRef | null;
  event?: string | PopulatedRef | null;
  assignedTo?: string | PopulatedRef;
  dueDate?: string | Date;
  status: 'todo' | 'inprogress' | 'done';
  createdAt?: string | Date;
  updatedAt?: string | Date;
  commentCount?: number;
  tags?: string[];
}

/**
 * Comment entity type
 */
export interface Comment {
  _id?: string;
  taskId: string;
  userId: string;
  text: string;
  timestamp?: string | Date;
  userName?: string;
}

/**
 * Member entity type
 */
export interface Member {
  _id?: string;
  name: string;
  role: string;
  email?: string;
  skills?: string;
  joinedAt?: string | Date;
}

/**
 * Project entity type
 */
export interface Project {
  _id?: string;
  name: string;
  description?: string;
  status?: string;
  createdAt?: string | Date;
}

/**
 * Event entity type
 */
export interface Event {
  _id?: string;
  title: string;
  description?: string;
  date: string | Date;
  location?: string;
  createdAt?: string | Date;
}

/**
 * Announcement entity type
 */
export interface Announcement {
  _id?: string;
  title: string;
  content: string;
  priority?: 'high' | 'medium' | 'low';
  createdAt?: string | Date;
}

/**
 * Activity entity type
 */
export interface Activity {
  _id?: string;
  action: string;
  details?: string;
  timestamp?: string | Date;
}

/**
 * API response wrapper
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string>;
}

/**
 * Dashboard statistics
 */
export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  todoTasks: number;
  completionRate: number;
  upcomingDeadlines: number;
  overdueTasks: number;
  totalMembers: number;
}

/**
 * Filter options for tasks
 */
export interface TaskFilterOptions {
  status?: 'todo' | 'inprogress' | 'done' | 'all';
  priority?: 'high' | 'medium' | 'low' | 'all';
  assignedTo?: string;
  project?: string;
  searchQuery?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}
