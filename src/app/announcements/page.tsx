'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Announcement = {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  author: string;
  priority: 'high' | 'normal' | 'low';
  isPinned: boolean;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  async function fetchAnnouncements() {
    try {
      const response = await fetch('/api/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  function formatDate(date: string) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const pinnedAnnouncements = announcements.filter((a) => a.isPinned);
  const regularAnnouncements = announcements.filter((a) => !a.isPinned);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-2">Announcements</h1>
            <p className="text-slate-600 text-lg mb-8">Latest updates and news</p>
            <Link
              href="/create-announcement"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition"
            >
              Post Announcement
            </Link>
          </div>
        </div>

        {/* Announcements */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : (
            <>
              {pinnedAnnouncements.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Pinned</h2>
                  <div className="space-y-3">
                    {pinnedAnnouncements.map((announcement) => (
                      <button
                        key={announcement._id}
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="w-full text-left group bg-amber-50 border border-amber-200 rounded-xl shadow-sm hover:shadow-md transition-all p-6"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-base font-semibold text-slate-900">{announcement.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                            announcement.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{announcement.content}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>{announcement.author}</span>
                          <span>{formatDate(announcement.createdAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {regularAnnouncements.length > 0 && (
                <div className="mb-16">
                  <h2 className="text-xl font-bold text-slate-900 mb-6">Recent</h2>
                  <div className="space-y-3">
                    {regularAnnouncements.map((announcement) => (
                      <button
                        key={announcement._id}
                        onClick={() => setSelectedAnnouncement(announcement)}
                        className="w-full text-left group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-6"
                      >
                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h3 className="text-base font-semibold text-slate-900">{announcement.title}</h3>
                          <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                            announcement.priority === 'high' ? 'bg-red-100 text-red-700' :
                            announcement.priority === 'normal' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-200 text-slate-700'
                          }`}>
                            {announcement.priority}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3 line-clamp-2">{announcement.content}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>{announcement.author}</span>
                          <span>{formatDate(announcement.createdAt)}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {announcements.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                  <p className="mb-4">No announcements yet</p>
                  <Link href="/create-announcement" className="text-slate-900 font-semibold hover:underline">
                    Create one
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedAnnouncement && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedAnnouncement.title}</h2>
                <div className="flex gap-4 mt-2 text-sm text-slate-600">
                  <span>By {selectedAnnouncement.author}</span>
                  <span>{formatDate(selectedAnnouncement.createdAt)}</span>
                </div>
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="text-slate-400 text-2xl">
                ✕
              </button>
            </div>

            <div className="p-8">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap mb-8">
                {selectedAnnouncement.content}
              </div>
              <button onClick={() => setSelectedAnnouncement(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition">
                Close
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}