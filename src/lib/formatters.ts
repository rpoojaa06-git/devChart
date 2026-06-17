// Formatting utilities for dates, times, and other data types

/**
 * Format date to readable string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: string | Date | undefined): string {
  if (!date) return 'No date';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format date with time (e.g., "Jan 15, 2024 at 2:30 PM")
 */
export function formatDateTime(date: string | Date | undefined): string {
  if (!date) return 'No date';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format date as relative time (e.g., "2 days ago", "in 3 hours")
 */
export function formatRelativeTime(date: string | Date | undefined): string {
  if (!date) return 'No date';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffMs = dateObj.getTime() - now.getTime();
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);

  if (diffMins < -1) {
    const pastMins = Math.abs(diffMins);
    if (pastMins < 60) return `${pastMins} minute${pastMins > 1 ? 's' : ''} ago`;
    if (pastMins < 1440) {
      const hours = Math.round(pastMins / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    const days = Math.round(pastMins / 1440);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  }

  if (diffMins > 1) {
    if (diffMins < 60) return `in ${diffMins} minute${diffMins > 1 ? 's' : ''}`;
    if (diffMins < 1440) {
      const hours = Math.round(diffMins / 60);
      return `in ${hours} hour${hours > 1 ? 's' : ''}`;
    }
    const days = Math.round(diffMins / 1440);
    return `in ${days} day${days > 1 ? 's' : ''}`;
  }

  return 'Just now';
}

/**
 * Get due date status (overdue, due soon, due later)
 */
export function getDueDateStatus(dueDate: string | Date | undefined): {
  status: 'overdue' | 'due-soon' | 'due-later' | 'none';
  label: string;
} {
  if (!dueDate) {
    return { status: 'none', label: 'No due date' };
  }

  const dateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  
  if (isNaN(dateObj.getTime())) {
    return { status: 'none', label: 'Invalid date' };
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dueDay = new Date(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate());
  
  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { status: 'overdue', label: `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) > 1 ? 's' : ''}` };
  }

  if (diffDays === 0) {
    return { status: 'due-soon', label: 'Due today' };
  }

  if (diffDays <= 3) {
    return { status: 'due-soon', label: `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}` };
  }

  return { status: 'due-later', label: `Due ${formatDate(dueDate)}` };
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

/**
 * Capitalize first letter of string
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format priority for display
 */
export function formatPriority(priority: string): { label: string; color: string } {
  const priorityMap: Record<string, { label: string; color: string }> = {
    high: { label: 'High Priority', color: 'bg-red-100 text-red-800 border-red-300' },
    medium: { label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
    low: { label: 'Low Priority', color: 'bg-green-100 text-green-800 border-green-300' },
  };

  return priorityMap[priority.toLowerCase()] || { label: capitalize(priority), color: 'bg-gray-100 text-gray-800 border-gray-300' };
}

/**
 * Format status for display
 */
export function formatStatus(status: string): { label: string; icon: string } {
  const statusMap: Record<string, { label: string; icon: string }> = {
    todo: { label: 'To Do', icon: '📋' },
    inprogress: { label: 'In Progress', icon: '🔄' },
    done: { label: 'Done', icon: '✅' },
  };

  return statusMap[status.toLowerCase()] || { label: capitalize(status), icon: '•' };
}

/**
 * Get color class for priority
 */
export function getPriorityColor(priority: string): string {
  const colorMap: Record<string, string> = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    low: 'text-green-600 bg-green-50 border-green-200',
  };

  return colorMap[priority.toLowerCase()] || 'text-gray-600 bg-gray-50 border-gray-200';
}
/**
 * Get a display name from a value that may be a plain string or a populated
 * Mongoose reference object (e.g. { _id, name } or { _id, title }).
 */
export function getDisplayName(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value.name || value.title || '';
}