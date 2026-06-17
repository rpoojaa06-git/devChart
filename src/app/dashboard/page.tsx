'use client';

import Navbar from '@/components/Navbar';
import TaskCard from '@/components/TaskCard';
import TaskDetailModal from '@/components/TaskDetailModal';
import { getDisplayName } from '@/lib/formatters';
import { useEffect, useState } from 'react';

type PopulatedRef = {
  _id: string;
  name?: string;
  title?: string;
};

type Task = {
  _id: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  project?: string | PopulatedRef | null;
  event?: string | PopulatedRef | null; // Added event property reference
  assignedTo?: string | PopulatedRef;
  dueDate?: string;
  commentCount?: number;
};

function getRefId(value?: string | PopulatedRef | null): string {
  if (!value) return '';
  return typeof value === 'string' ? value : value._id;
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [search, setSearch] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterProject, setFilterProject] = useState<string>('all');
  const [filterEvent, setFilterEvent] = useState<string>('all'); // Added event filter state
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  async function fetchTasks() {
    const response = await fetch('/api/tasks');
    const data = await response.json();
    setTasks(data);
  }

  async function moveTask(id: string, status: string) {
    await fetch(`/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchTasks();
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  // Filter tasks dynamically using search, priorities, projects, and events
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesProject = filterProject === 'all' || getRefId(task.project) === filterProject;
    const matchesEvent = filterEvent === 'all' || getRefId(task.event) === filterEvent; // Added event query conditional
    
    return matchesSearch && matchesPriority && matchesProject && matchesEvent;
  });

  const todoTasks = filteredTasks.filter((task) => task.status === 'todo');
  const progressTasks = filteredTasks.filter((task) => task.status === 'inprogress');
  const doneTasks = filteredTasks.filter((task) => task.status === 'done');
  const overdueTasks = filteredTasks.filter(
    (task) => task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done'
  );

  // Unique projects (by id) for the filter dropdown
  const projectOptions = Array.from(
    new Map(
      tasks
        .filter((task) => task.project)
        .map((task) => [getRefId(task.project), getDisplayName(task.project)] as [string, string])
    )
  ).map(([id, name]) => ({ id, name }));

  // Unique events (by id) for the filter dropdown
  const eventOptions = Array.from(
    new Map(
      tasks
        .filter((task) => task.event)
        .map((task) => [getRefId(task.event), getDisplayName(task.event)] as [string, string])
    )
  ).map(([id, name]) => ({ id, name }));

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-10 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-slate-900">Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage your club tasks and projects efficiently.</p>
          </div>

          {/* Stats Bar Cards */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-blue-600">
              <p className="text-sm text-slate-600">Total Tasks</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{tasks.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-blue-500">
              <p className="text-sm text-slate-600">In Progress</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{progressTasks.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-green-600">
              <p className="text-sm text-slate-600">Completed</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{doneTasks.length}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 border-l-4 border-l-red-600">
              <p className="text-sm text-slate-600">Overdue</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">{overdueTasks.length}</p>
            </div>
          </div>

          {/* Search & Filters Controller */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
            <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
            <div className="grid md:grid-cols-5 gap-4"> {/* Increased cols count to 5 for layout spacing */}
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              <select
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Projects</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>

              {/* Added Event Dropdown Selection Option */}
              <select
                value={filterEvent}
                onChange={(e) => setFilterEvent(e.target.value)}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                {eventOptions.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name}
                  </option>
                ))}
              </select>

              <button
                onClick={() => {
                  setSearch('');
                  setFilterPriority('all');
                  setFilterProject('all');
                  setFilterEvent('all'); // Clear event state filter reference
                }}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg transition font-medium"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Kanban Board Columns View */}
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-600 text-white p-4">
                <h2 className="font-bold flex justify-between items-center">
                  To Do <span className="bg-slate-700 px-2 py-1 rounded text-sm">{todoTasks.length}</span>
                </h2>
              </div>
              <div className="p-4 space-y-3 min-h-96">
                {todoTasks.map((task) => (
                  <TaskCard key={task._id} {...task} id={task._id} onMove={moveTask} onViewDetails={setSelectedTaskId} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-blue-600 text-white p-4">
                <h2 className="font-bold flex justify-between items-center">
                  In Progress <span className="bg-blue-700 px-2 py-1 rounded text-sm">{progressTasks.length}</span>
                </h2>
              </div>
              <div className="p-4 space-y-3 min-h-96">
                {progressTasks.map((task) => (
                  <TaskCard key={task._id} {...task} id={task._id} onMove={moveTask} onViewDetails={setSelectedTaskId} />
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-green-600 text-white p-4">
                <h2 className="font-bold flex justify-between items-center">
                  Done <span className="bg-green-700 px-2 py-1 rounded text-sm">{doneTasks.length}</span>
                </h2>
              </div>
              <div className="p-4 space-y-3 min-h-96">
                {doneTasks.map((task) => (
                  <TaskCard key={task._id} {...task} id={task._id} onMove={moveTask} onViewDetails={setSelectedTaskId} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTaskId && (
        <TaskDetailModal taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
      )}
    </>
  );
}