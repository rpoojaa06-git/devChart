'use client';

import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

type Member = {
  _id: string;
  name: string;
};

export default function CreateAnnouncementPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [members, setMembers] = useState<Member[]>([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    priority: 'normal' as 'high' | 'normal' | 'low',
    isPinned: false,
  });

  useEffect(() => {
    async function fetchMembers() {
      try {
        const response = await fetch('/api/members');
        if (response.ok) {
          setMembers(await response.json());
        }
      } catch (error) {
        console.error('Failed to fetch members:', error);
      }
    }
    fetchMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.title || !formData.content || !formData.author) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create announcement');
      }

      router.push('/announcements');
      router.refresh();
    } catch (err) {
      setError('Failed to create announcement. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Post Announcement</h1>
            <p className="text-slate-600 mb-8">Share important news and updates with your club members.</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Announcement Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Annual General Meeting Scheduled"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your announcement here..."
                  rows={6}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Author */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Posted By <span className="text-red-500">*</span>
                </label>
                {members.length > 0 ? (
                  <select
                    name="author"
                    value={formData.author}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select a member</option>
                    {members.map((member) => (
                      <option key={member._id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded text-amber-700 text-sm">
                    No members found. Add members first to post announcements.
                  </div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Priority Level
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Pin Announcement */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="isPinned"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={handleChange}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="isPinned" className="text-sm font-medium text-slate-900">
                  📌 Pin this announcement to the top
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white rounded-lg font-semibold transition"
                >
                  {loading ? 'Posting...' : 'Post Announcement'}
                </button>
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
