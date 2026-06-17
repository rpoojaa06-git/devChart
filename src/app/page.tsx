import Navbar from '@/components/Navbar';
import Link from 'next/link';
import connectDB from '@/lib/mongodb';
import Task from '@/models/Tasks';
import Event from '@/models/Event';
import Member from '@/models/Member';
import Project from '@/models/Project';

async function QuickStats() {
  try {
    const [totalTasks, completedTasks, upcomingEvents, totalMembers, activeProjects] = await Promise.all([
      Task.countDocuments({}),
      Task.countDocuments({ status: 'done' }),
      Event.countDocuments({ startDate: { $gte: new Date().toISOString().slice(0, 10) } }),
      Member.countDocuments({}),
      Project.countDocuments({ status: { $ne: 'completed' } })
    ]);

    return (
      <section className="py-16 px-4 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { label: 'Active Projects', value: activeProjects },
              { label: 'Team Members', value: totalMembers },
              { label: 'Completed Tasks', value: completedTasks },
              { label: 'Upcoming Events', value: upcomingEvents },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-4xl font-bold text-blue-600 mb-2">{stat.value}</div>
                <div className="text-slate-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  } catch (error) {
    return null;
  }
}

export default async function Home() {
  await connectDB();

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:py-32 bg-white border-b border-slate-200">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-cyan-50 opacity-60" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-6xl sm:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent">
              Club Collaboration Hub
            </h1>
            <p className="text-xl sm:text-2xl text-slate-600 max-w-3xl mx-auto mb-8">
              Streamline tasks, organize events, manage members, and collaborate seamlessly. All the tools your club needs in one powerful platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition duration-200 shadow-lg shadow-blue-500/20"
              >
                Go to Dashboard
              </Link>
              <Link
                href="/create-task"
                className="px-8 py-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-900 rounded-lg font-semibold transition duration-200"
              >
                Create First Task
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-slate-900">Powerful Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: '📊',
                title: 'Kanban Board',
                description: 'Organize tasks into To Do, In Progress, and Done columns for clear workflow management.',
              },
              {
                icon: '📅',
                title: 'Event Management',
                description: 'Schedule events with countdown timers and keep your club informed of upcoming activities.',
              },
              {
                icon: '👥',
                title: 'Member Directory',
                description: 'Maintain a professional member directory with roles, skills, and contact information.',
              },
              {
                icon: '📢',
                title: 'Announcements',
                description: 'Post important announcements with priority levels and pin critical updates.',
              },
              {
                icon: '📁',
                title: 'Project Tracking',
                description: 'Monitor project progress, deadlines, and team member involvement.',
              },
              {
                icon: '🔍',
                title: 'Smart Search',
                description: 'Quickly find tasks, members, and projects with powerful filtering.',
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-8 rounded-xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold mb-2 text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <QuickStats />

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6 text-slate-900">Ready to Collaborate?</h2>
          <p className="text-xl text-slate-600 mb-8">
            Start using Club Collaboration Hub today and transform how your club manages projects and stays connected.
          </p>
          <Link
            href="/dashboard"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition duration-200 shadow-lg shadow-blue-500/20"
          >
            Access Dashboard
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-4 text-center text-slate-500">
        <div className="max-w-7xl mx-auto">
          <p>© 2026 Club Collaboration Hub. Empowering student clubs worldwide.</p>
        </div>
      </footer>
    </div>
  );
}
