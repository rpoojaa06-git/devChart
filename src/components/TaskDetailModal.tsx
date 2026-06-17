'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types';
import { formatDate, getDueDateStatus, formatPriority, getDisplayName } from '@/lib/formatters';
import CommentSection from './CommentSection';

interface TaskDetailModalProps {
  taskId: string;
  onClose: () => void;
}

export default function TaskDetailModal({ taskId, onClose }: TaskDetailModalProps) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch task');
        const data = await response.json();
        setTask(data);
        setError('');
      } catch (err: any) {
        setError(err.message || 'Failed to load task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [taskId]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-screen overflow-y-auto">
          <p className="text-slate-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 w-full max-w-2xl">
          <p className="text-red-600 mb-4">{error || 'Task not found'}</p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-300 text-slate-900 rounded-lg hover:bg-slate-400 transition"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const dueDateStatus = getDueDateStatus(task.dueDate);
  const priorityInfo = formatPriority(task.priority);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-teal-600 to-cyan-600 p-6 flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{task.title}</h2>
            <div className="flex gap-2 flex-wrap">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityInfo.color}`}>
                {priorityInfo.label}
              </span>
              {task.status && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('inprogress', 'In Progress')}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-lg p-2 transition"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-500 uppercase mb-2">Description</h3>
            <p className="text-slate-700 leading-relaxed">{task.description}</p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Due Date */}
            {task.dueDate && (
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">Due Date</h4>
                <p className={`${dueDateStatus.status === 'overdue' ? 'text-red-600 font-semibold' : 'text-slate-700'}`}>
                  {formatDate(task.dueDate)}
                </p>
                <p className="text-xs text-slate-500 mt-1">{dueDateStatus.label}</p>
              </div>
            )}

            {/* Assigned To */}
            {task.assignedTo && (
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">Assigned To</h4>
                <p className="text-slate-700">{getDisplayName(task.assignedTo)}</p>
              </div>
            )}

            {/* Project */}
            {task.project && (
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">Project</h4>
                <p className="text-slate-700">{getDisplayName(task.project)}</p>
              </div>
            )}

            {/* Event */}
            {task.event && (
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">Event</h4>
                <p className="text-slate-700">{getDisplayName(task.event)}</p>
              </div>
            )}

            {/* Created At */}
            {task.createdAt && (
              <div>
                <h4 className="text-sm font-semibold text-slate-500 uppercase mb-1">Created</h4>
                <p className="text-slate-700">{formatDate(task.createdAt)}</p>
              </div>
            )}
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-500 uppercase mb-2">Tags</h4>
              <div className="flex gap-2 flex-wrap">
                {task.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <CommentSection taskId={taskId} userId="current-user" userName="You" />
        </div>
      </div>
    </div>
  );
}