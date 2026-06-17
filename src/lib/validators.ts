// Input validation utilities for the club collaboration platform

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Validate task creation form data
 */
export function validateTask(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.title || typeof data.title !== 'string' || data.title.trim().length === 0) {
    errors.title = 'Task title is required and must be at least 1 character';
  } else if (data.title.length > 200) {
    errors.title = 'Task title must be less than 200 characters';
  }

  if (!data.description || typeof data.description !== 'string' || data.description.trim().length === 0) {
    errors.description = 'Description is required';
  } else if (data.description.length > 2000) {
    errors.description = 'Description must be less than 2000 characters';
  }

  if (!data.priority || !['high', 'medium', 'low'].includes(data.priority)) {
    errors.priority = 'Valid priority is required (high, medium, or low)';
  }

  if (data.dueDate) {
    const dueDate = new Date(data.dueDate);
    if (isNaN(dueDate.getTime())) {
      errors.dueDate = 'Invalid due date format';
    } else if (dueDate < new Date()) {
      errors.dueDate = 'Due date cannot be in the past';
    }
  }

  if (data.project && typeof data.project === 'string' && data.project.length > 100) {
    errors.project = 'Project name must be less than 100 characters';
  }

  if (data.assignedTo && typeof data.assignedTo === 'string' && data.assignedTo.length > 100) {
    errors.assignedTo = 'Assignee name must be less than 100 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate comment form data
 */
export function validateComment(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.text || typeof data.text !== 'string' || data.text.trim().length === 0) {
    errors.text = 'Comment text is required';
  } else if (data.text.length > 1000) {
    errors.text = 'Comment must be less than 1000 characters';
  }

  if (!data.taskId || typeof data.taskId !== 'string' || data.taskId.trim().length === 0) {
    errors.taskId = 'Valid task ID is required';
  }

  if (!data.userId || typeof data.userId !== 'string' || data.userId.trim().length === 0) {
    errors.userId = 'Valid user ID is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate member form data
 */
export function validateMember(data: any): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
    errors.name = 'Member name is required';
  } else if (data.name.length > 100) {
    errors.name = 'Name must be less than 100 characters';
  }

  if (!data.role || typeof data.role !== 'string' || data.role.trim().length === 0) {
    errors.role = 'Role is required';
  } else if (data.role.length > 50) {
    errors.role = 'Role must be less than 50 characters';
  }

  if (data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.email = 'Please enter a valid email address';
    }
  }

  if (data.skills && typeof data.skills === 'string' && data.skills.length > 500) {
    errors.skills = 'Skills description must be less than 500 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validate search query
 */
export function validateSearchQuery(query: string): boolean {
  return typeof query === 'string' && query.trim().length > 0 && query.length <= 100;
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .substring(0, 2000);
}
