'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Event = {
  _id: string;
  title: string;
  description: string;
  startDate: string;
  location: string;
  members: string[];
  organizer: string;
  startTime: string;
  endTime: string;
};

function calculateDaysUntil(date: string): string {
  const eventDate = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  eventDate.setHours(0, 0, 0, 0);
  
  const timeDifference = eventDate.getTime() - today.getTime();
  const daysUntil = Math.ceil(timeDifference / (1000 * 3600 * 24));
  
  if (daysUntil === 0) return 'Today';
  if (daysUntil === 1) return 'Tomorrow';
  if (daysUntil < 0) return `${Math.abs(daysUntil)}d ago`;
  return `In ${daysUntil}d`;
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  async function fetchEvents() {
    try {
      const response = await fetch('/api/events');
      if (response.ok) {
        const data = await response.json();
        setEvents(data);
      }
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchEvents();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const upcomingEvents = events.filter((e) => new Date(e.startDate) >= today);
  const pastEvents = events.filter((e) => new Date(e.startDate) < today);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-2">Events</h1>
            <p className="text-slate-600 text-lg mb-8">Discover and participate in club gatherings</p>
            <Link
              href="/create-event"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition"
            >
              Create Event
            </Link>
          </div>
        </div>

        {/* Events List */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : (
            <>
              {/* Upcoming */}
              {upcomingEvents.length > 0 && (
                <div className="mb-20">
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">Upcoming</h2>
                  <div className="space-y-3">
                    {upcomingEvents.map((event) => (
                      <button
                        key={event._id}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-6"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700">{event.title}</h3>
                            <p className="text-slate-600 text-sm mt-1 line-clamp-2">{event.description}</p>
                            <div className="flex gap-4 mt-3 text-sm text-slate-600">
                              <span>{new Date(event.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span>{event.startTime}</span>
                              <span>{event.location}</span>
                            </div>
                          </div>
                          <div className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded whitespace-nowrap">
                            {calculateDaysUntil(event.startDate)}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Past */}
              {pastEvents.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-8">Past</h2>
                  <div className="space-y-3">
                    {pastEvents.map((event) => (
                      <button
                        key={event._id}
                        onClick={() => setSelectedEvent(event)}
                        className="w-full text-left group bg-white border border-slate-200 rounded-xl shadow-sm p-6 opacity-75 hover:opacity-100 hover:shadow-md transition-all"
                      >
                        <h3 className="text-lg font-semibold text-slate-700">{event.title}</h3>
                        <p className="text-slate-600 text-sm mt-1 line-clamp-2">{event.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {events.length === 0 && (
                <div className="text-center py-12 text-slate-600">
                  <p className="mb-4">No events yet</p>
                  <Link href="/create-event" className="text-slate-900 font-semibold hover:underline">
                    Create one
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedEvent && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedEvent.title}</h2>
                <p className="text-sm text-slate-600 mt-1">By {selectedEvent.organizer}</p>
              </div>
              <button onClick={() => setSelectedEvent(null)} className="text-slate-400 text-2xl">
                ✕
              </button>
            </div>

            <div className="p-8 space-y-8">
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">About</h3>
                <p className="text-slate-700 leading-relaxed">{selectedEvent.description}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">When</h3>
                <p className="font-semibold text-slate-900">
                  {new Date(selectedEvent.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-slate-600 text-sm mt-1">{selectedEvent.startTime} — {selectedEvent.endTime}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Where</h3>
                <p className="font-semibold text-slate-900">{selectedEvent.location}</p>
              </div>

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">Attendees ({selectedEvent.members.length})</h3>
                {selectedEvent.members.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedEvent.members.map((member, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-600 text-sm">No attendees</p>
                )}
              </div>

              <button onClick={() => setSelectedEvent(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition">
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