"use client";

import Navbar from "@/components/Navbar";
import React, { useState, useEffect } from "react";

type Member = {
  _id: string;
  name: string;
};

type ProjectType = {
  _id: string;
  name: string;
};

type EventType = {
  _id: string;
  title: string;
};

export default function CreateTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [relationType, setRelationType] = useState<"project" | "event" | "none">("none");
  const [relatedId, setRelatedId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [members, setMembers] = useState<Member[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [membersRes, projectsRes, eventsRes] = await Promise.all([
          fetch('/api/members'),
          fetch('/api/projects'),
          fetch('/api/events')
        ]);
        if (membersRes.ok) setMembers(await membersRes.json());
        if (projectsRes.ok) setProjects(await projectsRes.json());
        if (eventsRes.ok) setEvents(await eventsRes.json());
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    }
    fetchData();
  }, []);

  function validateForm() {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!description.trim()) newErrors.description = "Description is required";
    if (!assignedTo) newErrors.assignedTo = "Please assign to a team member";
    if (relationType !== "none" && !relatedId) newErrors.relatedId = "Please select a project or event";
    if (dueDate && new Date(dueDate) < new Date()) {
      newErrors.dueDate = "Due date cannot be in the past";
    }
    return newErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setSuccess(false);

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          project: relationType === "project" ? relatedId : null,
          event: relationType === "event" ? relatedId : null,
          assignedTo,
          dueDate: dueDate || null,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      setSuccess(true);
      setTitle("");
      setDescription("");
      setPriority("medium");
      setRelationType("none");
      setRelatedId("");
      setAssignedTo("");
      setDueDate("");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } catch (error) {
      console.error(error);
      setErrors({ submit: "Failed to create task. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
  <>
    <Navbar />

    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">
            Create Task
          </h1>

          <p className="text-slate-600 mt-2">
            Create and assign tasks for your club projects and events.
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-300 text-green-700 rounded-lg">
            Task created successfully! Redirecting...
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-300 text-red-700 rounded-lg">
            {errors.submit}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm border border-slate-200 p-8"
        >
          <div className="grid gap-6">

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Task Title <span className="text-red-600">*</span>
              </label>

              <input
                type="text"
                placeholder="Design event poster"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description <span className="text-red-600">*</span>
              </label>

              <textarea
                placeholder="Describe the task in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 min-h-[120px] resize-none focus:outline-none focus:ring-2 transition ${
                  errors.description
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              />
              {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Assigned To <span className="text-red-600">*</span>
              </label>

              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                  errors.assignedTo
                    ? "border-red-500 focus:ring-red-500"
                    : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                }`}
              >
                <option value="">Select a team member</option>
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name}
                  </option>
                ))}
              </select>
              {errors.assignedTo && <p className="text-red-600 text-sm mt-1">{errors.assignedTo}</p>}
              {members.length === 0 && (
                <p className="text-amber-600 text-sm mt-1">No members found. Add members first.</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Relate to (optional)
                </label>

                <select
                  value={relationType}
                  onChange={(e) => {
                    setRelationType(e.target.value as "project" | "event" | "none");
                    setRelatedId("");
                  }}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition"
                >
                  <option value="none">General Task</option>
                  <option value="project">Related to a Project</option>
                  <option value="event">Related to an Event</option>
                </select>
              </div>

              {relationType !== "none" && (
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    {relationType === "project" ? "Project" : "Event"} <span className="text-red-600">*</span>
                  </label>

                  <select
                    value={relatedId}
                    onChange={(e) => setRelatedId(e.target.value)}
                    className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                      errors.relatedId
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    }`}
                  >
                    <option value="">Select {relationType}</option>
                    {relationType === "project"
                      ? projects.map((p) => (
                          <option key={p._id} value={p._id}>
                            {p.name}
                          </option>
                        ))
                      : events.map((e) => (
                          <option key={e._id} value={e._id}>
                            {e.title}
                          </option>
                        ))}
                  </select>
                  {errors.relatedId && <p className="text-red-600 text-sm mt-1">{errors.relatedId}</p>}
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 focus:outline-none focus:ring-2 transition ${
                    errors.dueDate
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                  }`}
                />
                {errors.dueDate && <p className="text-red-600 text-sm mt-1">{errors.dueDate}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Priority <span className="text-red-600">*</span>
                </label>

                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:outline-none focus:ring-2 focus:border-blue-500 focus:ring-blue-500 transition"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

            </div>

            <div className="flex gap-4 pt-6 border-t border-slate-200">

              <button
                type="submit"
                disabled={loading}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold px-8 py-3 rounded-lg transition"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={() => {
                  setTitle("");
                  setDescription("");
                  setPriority("medium");
                  setRelationType("none");
                  setRelatedId("");
                  setAssignedTo("");
                  setDueDate("");
                  setErrors({});
                }}
                className="border border-slate-300 px-8 py-3 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition"
              >
                Reset
              </button>

            </div>

          </div>
        </form>

        <div className="mt-8 bg-teal-50 border border-teal-200 rounded-xl p-5">
          <h3 className="font-semibold text-teal-700">
            Task Management Tips
          </h3>

          <ul className="mt-3 text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>Assign ownership for every task.</li>
            <li>Set realistic deadlines.</li>
            <li>Break large projects into smaller tasks.</li>
            <li>Update task status regularly.</li>
          </ul>
        </div>

      </div>
    </div>
  </>
);
}
