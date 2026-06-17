'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type Project = {
  _id: string;
  name: string;
  description: string;
  progress?: number;
  status?: string;
  deadline?: string;
  members?: string[];
  tags?: string[];
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  async function fetchProjects() {
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h1 className="text-5xl font-bold text-slate-900 mb-2">Projects</h1>
            <p className="text-slate-600 text-lg mb-8">Active initiatives and collaborative work</p>
            <Link
              href="/create-project"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition"
            >
              Create Project
            </Link>
          </div>
        </div>

        {/* Projects */}
        <div className="max-w-6xl mx-auto px-6 py-16">
          {loading ? (
            <p className="text-slate-600">Loading...</p>
          ) : (
            <>
              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map((project) => (
                    <button
                      key={project._id}
                      onClick={() => setSelectedProject(project)}
                      className="w-full text-left group bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all p-6"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <h3 className="text-lg font-semibold text-slate-900">{project.name}</h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ${
                          project.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                          project.status === 'planning' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {project.status?.replace('-', ' ')}
                        </span>
                      </div>
                      <p className="text-slate-600 text-sm mb-3 line-clamp-2">{project.description}</p>
                      {project.progress !== undefined && (
                        <div className="flex items-center gap-3 mb-3">
                          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-slate-900 transition-all"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                          <span className="text-xs font-semibold text-slate-600">{project.progress}%</span>
                        </div>
                      )}
                      <div className="flex gap-4 text-xs text-slate-500">
                        {project.deadline && (
                          <span>Due {new Date(project.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                        {project.members && project.members.length > 0 && (
                          <span>{project.members.length} members</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 text-slate-600">
                  <p className="mb-4">No projects yet</p>
                  <Link href="/create-project" className="text-slate-900 font-semibold hover:underline">
                    Create one
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedProject.name}</h2>
                <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded ${
                  selectedProject.status === 'in-progress' ? 'bg-blue-100 text-blue-700' :
                  selectedProject.status === 'planning' ? 'bg-purple-100 text-purple-700' :
                  'bg-orange-100 text-orange-700'
                }`}>
                  {selectedProject.status?.replace('-', ' ')}
                </span>
              </div>
              <button onClick={() => setSelectedProject(null)} className="text-slate-400 text-2xl">
                ✕
              </button>
            </div>

            <div className="p-8 space-y-8">
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">About</h3>
                <p className="text-slate-700 leading-relaxed">{selectedProject.description}</p>
              </div>

              {/* Progress */}
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2">Track Progress</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex-1 flex flex-col gap-2">
                      {/* Interactive Slider Control */}
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={selectedProject.progress ?? 0}
                        onChange={async (e) => {
                          const newProgress = Number(e.target.value);
                          
                          // 1. Instantly update UI state
                          setSelectedProject(prev => prev ? { ...prev, progress: newProgress } : null);
                          setProjects(prev => prev.map(p => p._id === selectedProject._id ? { ...p, progress: newProgress } : p));

                          // 2. Save change to your API backend
                          try {
                            await fetch('/api/projects', {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ _id: selectedProject._id, progress: newProgress }),
                            });
                          } catch (error) {
                            console.error('Failed to save progress update:', error);
                          }
                        }}
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-900"
                      />
                    </div>
                    <span className="text-2xl font-bold text-slate-900 min-w-[3.5rem] text-right">
                      {selectedProject.progress ?? 0}%
                    </span>
                  </div>
                </div>
              {/* Deadline */}
              {selectedProject.deadline && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-3">Deadline</h3>
                  <p className="text-slate-900 font-semibold">
                    {new Date(selectedProject.deadline).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              )}

              {/* Members */}
              {selectedProject.members && selectedProject.members.length > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">Team ({selectedProject.members.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.members.map((member, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-sm">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="border-t border-slate-200 pt-6">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-slate-200 text-slate-700 rounded text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setSelectedProject(null)} className="w-full py-2 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold transition border-t border-slate-200 mt-8 pt-8">
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