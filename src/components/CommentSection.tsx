'use client';

import { useState, useEffect } from 'react';
import { Comment } from '@/types';
import { formatDateTime } from '@/lib/formatters';

interface CommentSectionProps {
  taskId: string;
  userId: string;
  userName: string;
}

export default function CommentSection({
  taskId,
  userId,
  userName,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/comments?taskId=${taskId}`);
        if (!response.ok) throw new Error('Failed to fetch comments');
        const data = await response.json();
        setComments(data);
        setError('');
      } catch (err) {
        setError('Failed to load comments');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [taskId]);

  // Submit comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    try {
      setSubmitting(true);
      setError('');

      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          taskId,
          userId,
          userName,
          text: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add comment');
      }

      const comment = await response.json();
      setComments([comment, ...comments]);
      setNewComment('');
    } catch (err: any) {
      setError(err.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Comments</h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmitComment} className="mb-6">
        <div className="flex gap-3">
          <div className="flex-1">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              rows={3}
              disabled={submitting}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-sm text-slate-500">{newComment.length}/1000</span>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition"
          >
            {submitting ? 'Posting...' : 'Post Comment'}
          </button>
        </div>
      </form>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Comments List */}
      <div className="space-y-4">
        {loading && <p className="text-slate-500">Loading comments...</p>}

        {!loading && comments.length === 0 && (
          <p className="text-slate-500">No comments yet. Be the first to comment!</p>
        )}

        {!loading &&
          comments.map((comment) => (
            <div
              key={comment._id}
              className="border border-slate-200 rounded-lg p-4 bg-slate-50"
            >
              <div className="flex justify-between items-start mb-2">
                <p className="font-semibold text-slate-900">
                  {comment.userName || 'Anonymous'}
                </p>
                <span className="text-sm text-slate-500">
                  {formatDateTime(comment.timestamp)}
                </span>
              </div>
              <p className="text-slate-700 text-sm">{comment.text}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
