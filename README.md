# Nerdified — Web App

Frontend for **Nerdified**, a live, instructor-led online learning platform.
Built with **Next.js 15 (App Router)**, **React 18**, **TypeScript**, and
**Tailwind CSS**. Serves distinct experiences for students, tutors, and admins.

> The NestJS API lives in the separate `nerdified-server` repo.

---

## Tech stack

- **Next.js 15.5** (App Router) / **React 18** / **TypeScript**
- **Tailwind CSS** + **shadcn/ui** components
- **axios** with role-aware refresh interceptors
- **socket.io-client** — real-time messaging and chat
- **LiveKit** (`@livekit/components-react`) — in-browser live classroom
- react-icons, react-moment, react-spinners, sweetalert2

---

## Features

### Accounts & auth
- Student and tutor sign-up, unified sign-in, and a separate admin sign-in.
- **Continue with Google** sign-in.
- **Email verification** — a `/verify-email` page plus an unverified-email banner
  on dashboards with one-click resend.
- Role-aware route protection via Next.js middleware; role-scoped axios hooks
  refresh tokens transparently and log out after repeated failures.

### Student experience
- Browse and enroll in courses (Paystack checkout), wishlist, and reviews.
- **My Courses** with upcoming sessions, course chat, and — once a course is
  completed — a **downloadable completion certificate**.
- **Sessions** list with join-live and **watch-recording** links.
- Live classroom (LiveKit) for group and 1:1 sessions.
- **Messages** — real-time direct chat with tutors (read receipts) and per-course
  chat rooms.
- Notifications feed with a live unread badge.

### Tutor experience
- Dashboard with real earnings, student counts, and upcoming sessions.
- Course creation/editing, availability, sessions, reschedule/add-session flows.
- Live classroom with **record / stop** controls.
- **Earnings** — balance, payout history, and a **payout bank account** setup
  (bank picker + verified account name).
- Real-time messaging with students and course chat.

### Admin experience
- Tutor approval, course and enrollment management, students, and blog posts.
- Reschedule / add-session request review.
- **Tutor Payouts** — create payouts and **disburse** them via Paystack Transfers.

---

## Getting started

### Prerequisites
- Node.js 18+
- The `nerdified-server` API running (default `http://localhost:3100/api`)

### Install

```bash
npm install
```

### Configure environment

Create `.env.local`:

```bash
NEXT_PUBLIC_BASE_URL=http://localhost:3100/api
```

This points the app (REST + socket.io) at the API. The socket connection derives
its origin by stripping the trailing `/api`.

### Run

```bash
npm run dev     # http://localhost:3101
npm run build   # production build
npm run start   # serve the production build
```

---

## Project structure

- `app/` — App Router routes, grouped by audience: `(main)` (public + auth),
  `(student)`, `(tutor)`, `(admin)`, and `(live)` (the LiveKit classroom).
- `components/` — shared UI and page components (`components/ui` is shadcn/ui).
- `hooks/` — auth, refresh, logout, notifications, and the unified private-axios
  hooks (all delegating to `useAxiosPrivateBase`).
- `context/` — auth providers (students/tutors share one; admin is separate).
- `middleware.ts` — role-based route protection at the edge.

---

## Appendix — course content notes

Course PDF files are expected to include: outlines (topics), descriptions of the
topics, learning tools, and requirements.
