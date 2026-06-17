'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { useEffect, useState } from 'react';

type Member = {
  _id: string;
  name: string;
  role: string;
  email: string;
  skills: string;
};

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  async function fetchMembers() {
    try {
      const response = await fetch('/api/members');
      if (response.ok) {
        const data = await response.json();
        setMembers(data);
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.skills && m.skills.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const leadershipRoles = ['President', 'Vice President', 'Treasurer', 'Secretary'];
  const leadershipMembers = filteredMembers.filter((m) => leadershipRoles.includes(m.role));
  const regularMembers = filteredMembers.filter((m) => !leadershipRoles.includes(m.role));

  function getRoleColor(role: string) {
    const roleColors: Record<string, string> = {
      President: 'bg-gradient-to-br from-purple-500 to-pink-500',
      'Vice President': 'bg-gradient-to-br from-blue-500 to-cyan-500',
      Treasurer: 'bg-gradient-to-br from-green-500 to-emerald-500',
      Secretary: 'bg-gradient-to-br from-orange-500 to-red-500',
    };
    return roleColors[role] || 'bg-gradient-to-br from-slate-500 to-slate-600';
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12 flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold text-slate-900 mb-3">Team Members</h1>
              <p className="text-slate-600 text-lg">Meet the amazing people behind our club</p>
            </div>
            <Link
              href="/join-club"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-lg font-semibold transition"
            >
              + Add Member
            </Link>
          </div>

          {/* Search */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search members by name, role, or skills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30"
            />
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-slate-600">Loading members...</p>
            </div>
          ) : (
            <>
              {members.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
                  <p className="text-slate-500 mb-4">No members yet. Add team members to get started!</p>
                  <Link href="/join-club" className="text-blue-600 hover:text-blue-700 font-semibold">
                    Add member
                  </Link>
                </div>
              ) : (
                <>

          {/* Leadership Team */}
          {leadershipMembers.length > 0 && (
            <div className="mb-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-yellow-500">👑</span> Leadership Team
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {leadershipMembers.map((member) => (
                  <div
                    key={member._id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:border-blue-300 hover:shadow-md transition-all"
                  >
                    {/* Avatar Background */}
                    <div className={`h-24 ${getRoleColor(member.role)}`} />

                    {/* Content */}
                    <div className="p-5">
                      {/* Avatar Circle */}
                      <div className="flex justify-center -mt-12 mb-3">
                        <div className={`w-20 h-20 rounded-full ${getRoleColor(member.role)} flex items-center justify-center text-white text-2xl font-bold border-4 border-white`}>
                          {getInitials(member.name)}
                        </div>
                      </div>

                      {/* Name and Role */}
                      <h3 className="text-lg font-bold text-slate-900 text-center">{member.name}</h3>
                      <p className="text-sm text-blue-600 text-center font-semibold mb-3">{member.role}</p>

                      {/* Skills */}
                      {member.skills && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {member.skills
                            .split(',')
                            .map(skill => skill.trim()) // Trim them first
                            .filter(skill => skill !== "") // Drop any empty entries
                            .map((skill, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-xs text-blue-700 font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                        </div>
                      )}

                      {/* Email */}
                      <a href={`mailto:${member.email}`} className="text-xs text-slate-500 hover:text-blue-600 transition">
                        {member.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Regular Members */}
          {regularMembers.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <span className="text-blue-500">▸</span> Members ({regularMembers.length})
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularMembers.map((member) => (
                  <div key={member._id} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {getInitials(member.name)}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
                        <p className="text-sm text-blue-600">{member.role}</p>
                      </div>
                    </div>

                    {member.skills && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {member.skills.split(',').map((skill, i) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs text-slate-600 font-medium">
                            {skill.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    <a href={`mailto:${member.email}`} className="text-xs text-slate-500 hover:text-blue-600 transition">
                      {member.email}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

                {filteredMembers.length === 0 && (
                  <div className="text-center py-12 text-slate-500">
                    <p>No members found matching your search.</p>
                  </div>
                )}
              </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
