# Chosen Fintech Solutions — Website & CMS

**Chosen Fintech** is the official website and content-management platform for **Chosen Fintech Solutions**, a fintech focused on financial inclusion, digital empowerment, and community transformation across Ghana and Africa.

It is a single **full-stack Next.js 16 (App Router) + React 19** application: the public-facing marketing site, a financial-literacy **Academy**, a blog, an events and projects showcase, and a complete **admin dashboard** all live in one codebase, backed by its own PostgreSQL database and API route handlers — no separate backend service required.

> **In one line:** a self-contained Next.js platform that serves Chosen Fintech's public website and a full admin CMS, with role-based auth, email 2FA, and Cloudinary-backed media — all in one deployable app.

---

## ✨ What It Does

### 🌍 Public Website
- **Home, About** (with **FAQ** and **Gallery**), and **Contact** pages.
- **Academy** — a financial-education hub of **guides** organised by level (beginner → advanced), with individual guide pages.
- **Blog/Posts** — articles with categories and dedicated post pages.
- **Events** — upcoming and past events with category filtering and detail pages.
- **Projects** — a portfolio/showcase of the organisation's initiatives.
- **Donate** — a "Support Our Mission" page accepting **crypto or fiat** contributions.
- SEO-ready: per-page metadata, Open Graph images, canonical URLs, and Google site verification.

### 🛠️ Admin Dashboard (`/dashboard`)
A back-office for staff to manage every content type without touching code:
- **Posts**, **Academy (Guides)**, **Events** (+ categories), **Projects** — each with create/edit, rich-text authoring, **live preview**, and **publish** / **feature** toggles.
- **Gallery** — manage categories and upload/organise photos with publish controls.
- **Users** — manage accounts and roles, change passwords, and configure **two-factor authentication**.
- **Dashboard stats** — aggregated content and activity metrics.

### 🔐 Authentication & Security
- Session-based auth using **`jose`**-signed tokens (stateless, cookie-stored).
- **Role-based access control** for dashboard routes.
- **Email-based two-factor authentication** — one-time codes emailed on setup/login, with a short TTL.
- **Password reset** and account actions backed by single-use, expiring **security tokens** delivered by email.
- **Rate limiting** on sensitive endpoints via **Upstash Redis**.
- Passwords hashed with **bcrypt**.

---

## 🛠️ Tech Stack

| Layer                  | Technology / Library                                       |
| ---------------------- | ---------------------------------------------------------- |
| **Framework**          | Next.js 16 (App Router) + React 19                         |
| **Language**           | TypeScript                                                 |
| **Database**           | PostgreSQL (`pg` + `@prisma/adapter-pg`)                   |
| **ORM**                | Prisma                                                     |
| **Auth / Sessions**    | `jose` (signed tokens), bcrypt, email-based 2FA            |
| **Rate Limiting**      | `@upstash/ratelimit` + Upstash Redis                       |
| **State Management**   | Redux Toolkit + React-Redux                                |
| **UI & Styling**       | Radix UI + shadcn/ui patterns, TailwindCSS, `next-themes`  |
| **Icons / UX**         | lucide-react, vaul (drawers)                               |
| **Forms & Validation** | react-hook-form + `@hookform/resolvers` + Zod              |
| **Data Tables**        | @tanstack/react-table                                      |
| **Rich Text**          | TinyMCE                                                    |
| **Media**              | Cloudinary, yet-another-react-lightbox                     |
| **Email**              | Nodemailer (SMTP/Gmail)                                    |
| **Motion**             | `motion` (Framer Motion)                                   |
| **Dates**              | date-fns                                                   |
| **Notifications**      | react-hot-toast                                            |
| **Logging**            | pino                                                       |
| **Deployment**         | Vercel-ready                                               |

---

## 🏗️ Architecture Overview

```
                Next.js 16 App (single deployable)
   ┌───────────────────────────────────────────────────┐
   │  Public pages (RSC, SEO, ISR)                       │
   │  Admin dashboard (/dashboard)                       │
   │            │                                        │
   │            ▼                                        │
   │  Route Handlers (/api/*)  ← middleware: auth/RBAC   │
   │            │                                        │
   │   Prisma ORM ──► PostgreSQL                         │
   │   Cloudinary (media) · Nodemailer (email)           │
   │   Upstash Redis (rate limiting)                     │
   └───────────────────────────────────────────────────┘
```

The same app renders the public site and dashboard (Server Components) and exposes its backend through **App Router route handlers** under `/api`, protected by middleware-based authentication and role checks.

---

## 🌐 API Surface

Route handlers live under `src/app/api`. Content resources follow a consistent pattern — full CRUD plus `published/*` (public read) and `toggle-publish` / `toggle-featured` actions:

| Group        | Endpoints                                                        |
| ------------ | --------------------------------------------------------------- |
| `posts`      | CRUD, categories, `published`, toggle publish/feature           |
| `guides`     | CRUD, `published`, toggle publish/feature (Academy)             |
| `events`     | CRUD, categories, `published`, toggle publish/feature           |
| `projects`   | CRUD, `published`, toggle publish/feature                       |
| `gallery`    | categories & photos, `published`, toggle publish/feature        |
| `users`      | CRUD, role, change-password, `2fa` (setup/enable/disable)       |
| `dashboard`  | `stats` (admin metrics)                                         |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- A **Cloudinary** account, **SMTP/Gmail** credentials, and an **Upstash Redis** instance

### Installation
```bash
git clone <repo-url>
cd chosen-fintech
npm install
```

### Database
```bash
npm run migrate        # apply Prisma migrations (dev)
npm run seed           # seed the default admin user
```

### Run
```bash
npm run dev            # start dev server
npm run build          # migrate deploy + prisma generate + next build
npm start              # serve production build
npm run lint
```

---

## 🔐 Environment Variables

Create a `.env` from `.env.example`:

```bash
# Core
NODE_ENV=
DATABASE_URL=
SESSION_SECRET=                       # signs jose session tokens
NEXT_PUBLIC_BASE_URL=
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=

# Default admin (seed)
ADMIN_EMAIL=
ADMIN_PASSWORD=
ADMIN_FULLNAME=
ADMIN_PHONE=
ADMIN_SEED_ENABLED=

# Media
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Editor
NEXT_PUBLIC_TINYMCE_API_KEY=

# Rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Email
GMAIL_USER=
GMAIL_PASSWORD=
EMAIL_FROM_NAME=
```

---

## 📦 Project Structure

```
chosen-fintech/
├── prisma/                 # Schema, migrations & seed
├── scripts/                # One-off maintenance scripts (e.g. content-image migration)
├── src/
│   ├── app/                # App Router — public pages, /dashboard, /api route handlers
│   ├── components/         # UI and feature components
│   ├── redux/              # Redux Toolkit store & slices
│   ├── lib/                # Sessions, mail, integrations
│   ├── middlewares/        # Auth & access control
│   ├── validations/        # Zod schemas
│   ├── hooks/ utils/ types/# Helpers & shared types
│   ├── config/             # App configuration & metadata
│   └── static-data/        # Static site content
├── proxy.ts                # Request/middleware proxy
└── next.config.ts
```

---

## 🚢 Deployment

Optimised for **Vercel**. The `build` script runs `prisma migrate deploy` and `prisma generate` before `next build`, so deployments stay in sync with the database schema. Provide the Cloudinary, Upstash, SMTP, and session/admin environment variables for the target environment.
