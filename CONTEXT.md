# Portfolio Project Context

## Overview
This project is a dynamic, full-stack portfolio website for a Full-Stack Software Developer. It features a **React 19 / Vite 7** frontend with a **Cyberpunk/Terminal HUD aesthetic** and an **Express 5 / Node.js** backend connected to **MongoDB Atlas**. The platform is a fully operational, content-managed application with an integrated Admin Dashboard — not a tutorial scaffold.

**Live Frontend**: [https://abhijeet-rawat-portfolio.netlify.app](https://abhijeet-rawat-portfolio.netlify.app)  
**Live Backend**: [https://ar-portfolio-api.onrender.com](https://ar-portfolio-api.onrender.com)

---

## Deployment Architecture

| Layer | Platform | Domain |
|:---|:---|:---|
| Frontend | Netlify | `abhijeet-rawat-portfolio.netlify.app` |
| Backend | Render (free tier) | `ar-portfolio-api.onrender.com` |
| Database | MongoDB Atlas | Cloud cluster (IP allow: `0.0.0.0/0`) |
| Media CDN | Cloudinary | Image hosting for project covers |

> **Cross-domain deployment is intentional.** Netlify and Render are separate domains, which means third-party browser cookie restrictions apply. Authentication uses `sessionStorage` + Bearer tokens — **not** cookie-only — to work reliably across this architecture. See Authentication section.

---

## Features & Requirements (Implemented)

### 1. Frontend (Public Site)
- **Floating Contact Icons**: Email and WhatsApp icons at the left edge for quick contact.
- **Dynamic Projects**: Projects fetched from DB; paginated `/projects` page + featured home section.
- **Dynamic Content**: Experience timeline, bio, tech skills, and client reviews rendered from backend data.
- **Contact Form**: Users submit queries via form; backend persists, sanitizes, rate-limits, and email-notifies admin.
- **All Projects Page**: Infinite-scroll paginated directory with project cards.
- **Responsive Layout**: 3-column desktop, single-column mobile layouts throughout.
- **Cyberpunk HUD Design**: Neon green (`#00FF41`) on dark carbon (`#050505`) with Framer Motion animations.

### 2. Admin Dashboard (Private, JWT-Authenticated)
- **Manage Projects**: Two-step creator (metadata + media), edit, batch delete. Pre-flight URL reachability check.
- **Manage Experiences**: Full CRUD for career timeline milestones with skill tags.
- **Manage Technologies**: Full CRUD for tech stack by category.
- **Manage Queries**: Read, mark-as-read, batch delete contact form submissions.
- **Manage Reviews**: Approve, revoke, and delete client testimonials.
- **Profile & Links**: Update admin social links, resume URL, phone number.
- **Purge System Cache**: Flush in-memory server cache + client-side API cache from the dashboard.

---

## Authentication System

### Mechanism (Production-safe)

The application uses a **dual-mode auth** strategy to handle cross-domain deployment:

1. `POST /api/auth/login` → Backend validates credentials, signs a JWT, sets an **HTTP-only cookie**, and returns `{ success, token, user }` in the JSON response body.
2. Frontend stores the `token` in **`sessionStorage`** under key `admin_token`.
3. Axios request interceptor attaches `Authorization: Bearer <token>` to all requests.
4. Backend `protect()` middleware checks `req.cookies.token` first, then `req.headers.authorization` Bearer fallback.
5. On logout or `401` response, frontend clears `sessionStorage`.

### Why sessionStorage?
- `sameSite: 'lax'` cookies are **blocked by modern browsers** for cross-domain requests (Netlify ≠ Render).
- `sessionStorage` auto-expires when the tab closes (ideal security for admin sessions).
- Bearer header auth works cross-domain on any browser without special configuration.

---

## Database Schema (MongoDB Collections)

### Implemented Collections
1. **User (Admin)**: Admin credentials (email, bcrypt-hashed password, role), social links, resume URL, phone.
2. **Projects**: Title, description, tech stack, GitHub URL, live URL, image URL, featured flag, order.
3. **Technologies**: Name, category, proficiency level, order.
4. **Experiences**: Company, role, start/end dates, bullet points, skills array, order.
5. **Reviews**: Name, company, message, rating (1–5), approved flag.
6. **Queries**: Name, email, message, read flag, createdAt.
7. **Resume**: Title, download URL, Google Drive file ID, version, isActive flag.

---

## Core Technologies & Integrations

### Frontend
- **Framework**: React 19 + Vite 7 (ES Modules)
- **UI Library**: Material UI (MUI v7) with `disableRipple` on all buttons
- **Animations**: Framer Motion
- **HTTP Client**: Axios (request/response interceptor architecture with caching, rate limiting, deduplication)
- **Routing**: React Router 7
- **Styling**: Vanilla CSS + MUI `sx` prop (no Tailwind)

### Backend
- **Runtime**: Node.js ≥ 18 + Express 5
- **Database**: MongoDB Atlas + Mongoose 8
- **Auth**: `jsonwebtoken` + `bcryptjs` (salt: 12)
- **Security**: `helmet`, `cors`, `express-rate-limit`, `xss`, `cookie-parser`
- **File Uploads**: Multer + Cloudinary SDK
- **Email**: Nodemailer (Gmail App Passwords)
- **Logging**: Winston + Morgan + Google Apps Script webhook

---

## Caching Architecture

- **Server-side**: In-memory cache per route with custom TTLs (invalidated on mutations).
- **Client-side**: `src/services/apiCache.js` — in-memory + `localStorage` persistent cache with versioning.
- **Cache Purge**: Admin "Purge System Cache" flushes both server memory and client `localStorage` caches. Triggers a `x-cache-version` bump in response headers.

---

## File & Config Notes

- **`public/_redirects`** and **`netlify.toml`** both contain `/* /index.html 200` — required for Netlify SPA routing. Do not remove.
- **`server/seed.js`** is idempotent for the admin user only. Project/experience/tech data will duplicate on re-runs.
- **`server/.env`** is git-ignored. Copy from `server/.env.example`.
- **`UpdateScope.md`** is git-ignored (internal development roadmap).
- **`AGENTS.md`** is the AI agent guide; update it when making architectural changes.
