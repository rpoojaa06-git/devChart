'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '📊' },
  { name: 'Create Task', href: '/create-task', icon: '➕' },
  { name: 'Projects', href: '/projects', icon: '📁' },
  { name: 'Events', href: '/events', icon: '📅' },
  { name: 'Announcements', href: '/announcements', icon: '📢' },
  { name: 'Members', href: '/members', icon: '👥' },
];

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              C
            </div>
            <h1 className="text-lg font-bold text-slate-900 hidden sm:block">ClubHub</h1>
          </div>
        </Link>

        <div className="flex gap-1 items-center">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.name} href={item.href}>
                <button
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    active
                      ? 'bg-blue-50 text-blue-600 border border-blue-200'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                  title={item.name}
                >
                  <span className="text-base">{item.icon}</span>
                  <span className="hidden md:inline">{item.name}</span>
                </button>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
