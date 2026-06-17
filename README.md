# Club Management Platform

A professional, elegant club collaboration platform for managing events, announcements, projects, members, and tasks.

## Overview

Club Management Platform is a modern web application designed for clubs to organize members, events, projects, and tasks. Built with a minimal, elegant design inspired by professional websites—showing only essential information on cards, with full details revealed in modals.

## Key Features

### Events Management
- **Minimal Cards** - Title, brief description, date, time, location on card
- **Detailed Modal** - Click to view: full description, venue, time, attendees
- **Smart Countdown** - "Today", "Tomorrow", "In X days", "X days ago"
- **Organized View** - Upcoming and past events separated

### Announcements Feed
- **Elegant Cards** - Title, snippet, author, relative timestamp (5m ago, 2h ago, 3d ago)
- **Full Post Modal** - Read complete announcement with formatted content
- **Priority System** - High, Normal, Low priority badges
- **Pinned Posts** - Important announcements appear at top
- **Member-Only Posting** - Only existing members can post (dropdown selector)

### Project Tracking
- **Progress Bars** - Visual 0-100% progress on cards
- **Minimal Cards** - Name, description, status, deadline, team size
- **Details Modal** - Full info: description, progress, deadline, team members, tags
- **Three Statuses** - Planning, In Progress, On Hold (no "completed" on creation)
- **Real Progress** - See actual project advancement

### Member Management
- **Member Directory** - See all active team members
- **Team Assignment** - Use members in projects and tasks

### Task Management  
- **Smart Assignment** - Can only assign to existing members
- **Project/Event Links** - Tasks relate to projects OR events (optional)
- **Priority Levels** - Low, Medium, High
- **Status Tracking** - Todo, In Progress, Done
- **Quick Dashboard** - See all assigned tasks at a glance

### Dashboard
- **Real Statistics** - Active projects, team members, completed tasks, upcoming events
- **Live Updates** - Stats refresh from database
- **Task Overview** - See your workload instantly

## Design Philosophy

**Minimal & Elegant**
- Clean card-based layouts
- Show only essentials on cards
- Full details in modals (click to expand)
- Professional typography and spacing
- Responsive across devices
- Neutral colors: slate, white, black

**Consistent & Logical**
- Member dropdowns prevent invalid assignments
- Only existing members can post announcements
- Can't create completed projects
- Tasks must have assigned member
- Related to project/event is optional
- Behaves like real professional websites

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| **Backend** | Node.js, Next.js API Routes |
| **Database** | MongoDB with Mongoose |
| **Data Fetching** | Native fetch + React hooks |

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- pnpm or npm

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment (.env.development.local)
MONGODB_URI=mongodb://localhost:27017/club-hub

# 3. Start dev server
pnpm dev

# 4. Open http://localhost:3000
```

### First Steps
1. Go to Members → Add Member (create initial team)
2. Create Events
3. Create Projects
4. Create Tasks (assign to members)
5. Post Announcements (as member)

## Pages & Features

| Page | URL | Features |
|------|-----|----------|
| Home | `/` | Statistics, overview, quick access |
| Events | `/events` | List upcoming/past, minimal cards, details modal |
| Announcements | `/announcements` | Feed, pinned posts, member-only posting |
| Projects | `/projects` | Active projects, progress bars, details modal |
| Members | `/members` | Directory, admin add button |
| Dashboard | `/dashboard` | Tasks, filters, priority view |
| Create Event | `/create-event` | Form with date/time/location/description |
| Create Project | `/create-project` | Form with deadline/team/progress |
| Create Task | `/create-task` | Assign to member, link to project/event |
| Create Announcement | `/create-announcement` | Title/content, member dropdown, priority, pin option |
| Add Member | `/join-club` | Admin interface to add team members |

## Database Schema

### Event
```
title, description, startDate, endDate, startTime, endTime
location, organizer, members: []
```

### Announcement
```
title, content, author (Member reference)
priority: 'high' | 'normal' | 'low'
isPinned: boolean, createdAt
```

### Project
```
name, description
status: 'planning' | 'in-progress' | 'on-hold'
progress: 0-100, deadline
members: [], tags: []
```

### Task
```
title, description
priority: 'low' | 'medium' | 'high'
status: 'todo' | 'inprogress' | 'done'
assignedTo: Member reference (required)
project: Project reference (optional)
event: Event reference (optional)
dueDate, createdAt
```

### Member
```
name, email
```

## API Routes

```
GET/POST  /api/events
GET/POST  /api/announcements
GET/POST  /api/projects
GET/POST  /api/members
GET/POST  /api/tasks
```

## Design Highlights

### Minimal Cards Show
- Title
- Brief description (2 lines max)
- Key info (date, location, progress, author)
- Status badges
- Time info (relative timestamps)

### Modals Show Everything
- Full description
- All meta data
- Complete lists
- Formatted content
- Full attendee/team lists
- All tags and details

### Color System
- **Primary**: Slate (neutral, professional)
- **Accents**: Blue (links, buttons)
- **States**: Red (high priority), Orange (warnings), Green (completed)

### Responsive
- Mobile: Single column, touch-friendly
- Tablet: 2 columns, full cards
- Desktop: 3 columns, optimized layout

## Deployment

## 🚀 Deployment Guide (Vercel)

This project is optimized for automated deployment on **Vercel** directly linked with your GitHub repository.

### Prerequisites
Before deploying, ensure you have a running MongoDB database instance (e.g., MongoDB Atlas) to handle data storage.

### Step-by-Step Deployment

1. **Log in to Vercel:**
   Go to [vercel.com](https://vercel.com) and log in using your **GitHub account**.

2. **Import the Repository:**
   - Click on **"Add New..."** and select **"Project"**.
   - Find your repository in the list and click **"Import"**.

3. **Configure Environment Variables:**
   Before clicking deploy, expand the **Environment Variables** section and add your database credentials:
   - **Name:** `MONGODB_URI`
   - **Value:** `your_actual_mongodb_connection_string`

4. **Deploy:**
   - Leave the Framework Preset as **Next.js** and build settings as default.
   - Click **"Deploy"**. Vercel will compile the project and go live in less than 2 minutes.

### 🔄 Auto-Deployment on Push
Once the initial deployment is successful, **Webhooks** are automatically configured between GitHub and Vercel. 
- Any time you run `git push origin main`, Vercel instantly catches the commit and triggers a fresh preview/production build.
- You do not need to manually re-upload or re-deploy through the Vercel dashboard.

```

## Important Logic

### Member Management
- ✅ Coordinators add members via `/join-club`
- ❌ Public cannot self-register
- ✅ Dropdowns prevent invalid assignments

### Announcements
- ✅ Only members can post (dropdown selector)
- ✅ Author field is NOT free text
- ✅ Ensures accountability

### Tasks
- ✅ MUST assign to existing member
- ✅ Can link to project OR event (optional)
- ❌ Cannot create task without assignee

### Projects
- ✅ Three active statuses only
- ❌ No "completed" option on creation
- ✅ Progress bar shows real advancement

## Security & Best Practices

- ✅ Input validation on all forms
- ✅ Parameterized queries
- ✅ Type safety with TypeScript
- ✅ Error handling without data leaks
- ✅ Member-only operations gated
- ✅ Dropdown selectors prevent data corruption


## Troubleshooting

| Issue | Solution |
|-------|----------|
| "No members" in task creation | Add members first via `/join-club` |
| Announcement posting fails | Ensure at least one member exists |
| MongoDB connection error | Check MONGODB_URI and mongod running |
| Build errors | Run `pnpm dev` to see full errors |
| Modal not opening | Try page refresh, check browser console |

## Future Enhancements

- Email notifications
- Calendar integration
- File uploads
- Real-time WebSockets
- User authentication
- Advanced search
- Activity timeline
- Export to PDF/CSV
- Multi-language support

## Project Structure

```
src/
├── app/
│   ├── page.tsx (home)
│   ├── events/page.tsx
│   ├── announcements/page.tsx
│   ├── projects/page.tsx
│   ├── members/page.tsx
│   ├── dashboard/page.tsx
│   ├── create-event/page.tsx
│   ├── create-announcement/page.tsx
│   ├── create-project/page.tsx
│   ├── create-task/page.tsx
│   ├── join-club/page.tsx
│   ├── api/ (routes)
│   └── layout.tsx
├── components/
│   ├── Navbar.tsx
│   └── ui/
├── models/
│   ├── Event.ts
│   ├── Announcement.ts
│   ├── Project.ts
│   ├── Task.ts
│   └── Member.ts
└── lib/
    └── mongodb.ts
    └── formatters.ts
    └──utils.ts
    └──validators.ts
    
```

## Status

✅ **Production Ready**

All features tested and working:
- Events with elegant cards
- Announcements with member-only posting
- Projects with progress tracking
- Task assignment (member-only)
- Real-time statistics
- Professional UI/UX

---

**Version:** 2.0.0  
**Last Updated:** June 2026  
**Design**: Minimal & Elegant (inspired by professional club websites)
