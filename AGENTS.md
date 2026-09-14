# AGENTS.md — AI Agent Project Guide

> This file provides structured context for AI coding agents (Antigravity, Copilot, Cursor, etc.) working in this repository. Read this before making any code changes.

---

## 📌 Project Identity

- **Project**: Abhijeet Rawat — Cyberpunk Developer Portfolio & Admin Engine
- **Type**: Full-Stack MERN Application (React 19 + Node.js/Express 5 + MongoDB Atlas)
- **Frontend Host**: Netlify → `https://abhijeet-rawat-portfolio.netlify.app`
- **Backend Host**: Render → `https://ar-portfolio-api.onrender.com`
- **GitHub**: `https://github.com/Abhijith45/portfolio-abhijeet-rawat`

---

## 🏗️ Architecture Overview

### Frontend (`/` root)
- **Framework**: React 19 + Vite 7
- **UI**: Material UI (MUI v7) + Framer Motion
- **Styling**: Vanilla CSS (no Tailwind)
- **State**: React Context API (`AuthContext`)
- **HTTP**: Axios with request/response interceptors (`src/services/api.js`)
- **Routing**: React Router v7

### Backend (`/server`)
- **Runtime**: Node.js ≥18 + Express 5
- **DB**: MongoDB Atlas via Mongoose 8
- **Auth**: JWT via `jsonwebtoken` + `bcryptjs` (salt: 12)
- **Uploads**: Multer → Cloudinary
- **Email**: Nodemailer (Gmail App Password)
- **Entry**: `server/index.js`

---

## 🔑 Authentication System — CRITICAL

> **Do not alter authentication without reading this section in full.**

### How Auth Works (Production)

This project is **cross-domain** (Netlify frontend ≠ Render backend). Browsers block third-party cookies cross-domain. The auth system uses:

1. **Login flow**: `POST /api/auth/login` → backend returns `{ success, token, user }` in JSON body **and** sets an HTTP-only cookie.
2. **Token storage**: Frontend stores `token` in `sessionStorage` under the key `admin_token`.
3. **Subsequent requests**: Axios request interceptor (`src/services/api.js`) reads `sessionStorage.getItem('admin_token')` and attaches `Authorization: Bearer <token>` header to every request.
4. **Middleware**: `server/middleware/auth.js` `protect()` reads from `req.cookies.token` first, then `req.headers.authorization` Bearer fallback.
5. **Logout**: Frontend clears `sessionStorage.removeItem('admin_token')` + calls `POST /api/auth/logout` (clears cookie).
6. **Expired session**: Axios response interceptor auto-removes `admin_token` from sessionStorage on any `401` response.

### Why sessionStorage (not localStorage, not cookie-only)
- `sameSite: 'lax'` cookies are blocked cross-domain by browsers (Chrome, Safari, Firefox).
- `sessionStorage` auto-clears when the tab/browser is closed (good security for admin sessions).
- Bearer header works reliably regardless of CORS cookie restrictions.

### Key Files
| File | Role |
|:---|:---|
| `src/context/AuthContext.jsx` | Login/logout/checkAuth logic, sessionStorage read/write |
| `src/services/api.js` | Axios interceptors: token injection & 401 auto-clear |
| `server/routes/auth.js` | Login, logout, /me endpoints; returns `token` in JSON body |
| `server/middleware/auth.js` | `protect()` middleware: cookie-first, Bearer fallback |

---

## 🗂️ Key Directories

```
portfolio-abhijeet-rawat/
├── src/
│   ├── components/       # Reusable UI components
│   ├── sections/         # Page sections (Hero, Projects, Experience…)
│   ├── pages/
│   │   └── admin/        # Protected admin panel pages
│   ├── layouts/          # AdminLayout.jsx, PublicLayout.jsx
│   ├── services/
│   │   ├── api.js        # Axios instance, interceptors, all API calls
│   │   ├── apiCache.js   # In-memory + localStorage cache layer
│   │   ├── rateLimiter.js# Client-side rate limiter
│   │   └── logger.js     # Client error webhook logger
│   ├── context/
│   │   └── AuthContext.jsx
│   └── theme.js          # MUI theme (cyberpunk: #00FF41 on #050505)
├── server/
│   ├── index.js          # Express app setup, CORS, middleware
│   ├── routes/           # auth.js, projects.js, experiences.js, etc.
│   ├── models/           # Mongoose schemas
│   ├── middleware/
│   │   ├── auth.js       # JWT protect() middleware
│   │   ├── errorHandler.js
│   │   └── morganLogger.js
│   ├── utils/            # Cache store, email, logger webhook
│   └── seed.js           # DB seed script (run once)
├── public/
│   └── _redirects        # Netlify SPA routing fix (/* /index.html 200)
└── netlify.toml          # Netlify build + redirect config
```

---

## 🌍 Environment Variables

### Frontend (root `.env`)
```env
VITE_API_BASE_URL=http://localhost:5000        # or production Render URL
```

### Backend (`server/.env`) — See `server/.env.example` for full template
```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173               # CORS whitelist
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<min 32 char random string>
ADMIN_EMAIL=admin@yourportfolio.dev
ADMIN_PASSWORD=YourStrongPassword!
CLOUDINARY_CLOUD_NAME=                        # Optional
CLOUDINARY_API_KEY=                           # Optional
CLOUDINARY_API_SECRET=                        # Optional
CONTACT_RECEIVER_EMAIL=your@gmail.com
DEFAULT_RESUME_URL=https://drive.google.com/...
WEBHOOK_URL=https://script.google.com/...     # Error logging webhook
WEBHOOK_SECRET=<hex secret>
```

---

## 🛡️ Rules for Agents

1. **Never commit `.env` files.** They are in `.gitignore`. Never suggest or write env values into tracked files.
2. **Do not change `sameSite: 'none'` for cookies** without reading the cross-domain auth section above.
3. **Do not switch from `sessionStorage` back to cookie-only auth** — this breaks cross-domain production.
4. **Preserve the Axios request interceptor** in `src/services/api.js` — it handles: Bearer token injection, client rate limiting, cache-based adapter, and deduplicated GETs. Do not simplify or remove layers without understanding their purpose.
5. **MUI `disableRipple` prop**: All `Button` and `IconButton` MUI components use `disableRipple` — maintain this when adding new buttons.
6. **Theme**: The design system is cyberpunk. Primary: `#00FF41`, Background: `#050505`. Do not introduce Tailwind. Use MUI `sx` prop or vanilla CSS.
7. **The seed script is idempotent for admin only**. Projects/tech/experiences will duplicate on re-runs. Document clearly in any changes.
8. **Netlify SPA routing**: Both `public/_redirects` and `netlify.toml` contain `/* /index.html 200`. Do not remove these or Netlify will serve 404 on page refresh.
9. **PowerShell BOM warning**: When writing config files for Netlify via PowerShell, use `[System.IO.File]::WriteAllText` with `New-Object System.Text.UTF8Encoding($false)` — `Set-Content -Encoding UTF8` writes a BOM that breaks TOML parsers.
10. **No test files in production**: `server/test-email.js` has been deleted. Do not re-add test scripts to the server directory without also adding them to `.gitignore`.

---

## 📡 API Routes Summary

| Method | Path | Auth | Description |
|:---|:---|:---|:---|
| POST | `/api/auth/login` | ❌ | Login → returns `{ token, user }` |
| POST | `/api/auth/logout` | ❌ | Clears session cookie |
| GET | `/api/auth/me` | ✅ | Verify active session |
| GET | `/api/projects` | ❌ | Paginated projects |
| GET | `/api/projects/featured` | ❌ | Top featured projects |
| POST | `/api/projects` | ✅ | Create project |
| PUT | `/api/projects/:id` | ✅ | Update project |
| DELETE | `/api/projects/:id` | ✅ | Delete project |
| POST | `/api/projects/verify-url` | ✅ | Pre-flight URL check |
| POST | `/api/projects/upload` | ✅ | Upload image to Cloudinary |
| GET | `/api/experiences` | ❌ | Career timeline |
| POST | `/api/experiences` | ✅ | Add experience |
| PUT | `/api/experiences/:id` | ✅ | Update experience |
| DELETE | `/api/experiences/:id` | ✅ | Delete experience |
| GET | `/api/technologies` | ❌ | Tech stack |
| POST | `/api/technologies` | ✅ | Add technology |
| PUT | `/api/technologies/:id` | ✅ | Update technology |
| DELETE | `/api/technologies/:id` | ✅ | Delete technology |
| GET | `/api/reviews` | ❌ | Approved testimonials |
| GET | `/api/reviews/all` | ✅ | All reviews (admin) |
| POST | `/api/reviews` | ❌ | Submit review |
| PUT | `/api/reviews/:id` | ✅ | Approve/update review |
| DELETE | `/api/reviews/:id` | ✅ | Delete review |
| GET | `/api/queries` | ✅ | All contact messages |
| POST | `/api/queries` | ❌ | Submit contact form |
| PUT | `/api/queries/:id/read` | ✅ | Mark as read |
| DELETE | `/api/queries/:id` | ✅ | Delete query |
| GET | `/api/resume` | ❌ | Active resume metadata |
| GET | `/api/user/profile` | ✅ | Admin profile & links |
| PUT | `/api/user/profile` | ✅ | Update admin profile |
| POST | `/api/admin/purge-cache` | ✅ | Flush all server/client caches |

---

## 🚀 Local Dev Commands

```bash
# Start backend (from /server)
npm run dev          # nodemon, port 5000

# Start frontend (from root)
npm run dev          # Vite, port 5173

# Seed DB (from /server, run once)
npm run seed

# Build frontend for production
npm run build

# Run frontend tests
npm run test
```

---

## 🐛 Known Gotchas

- **Cross-domain cookies blocked**: Fixed by sessionStorage + Bearer auth. Do not revert.
- **DNS resolution on Windows**: `server/seed.js` and `server/index.js` use `dns.setServers(['8.8.8.8', '1.1.1.1'])` to resolve MongoDB SRV records on restrictive Windows networks.
- **Netlify TOML BOM**: File must be written without UTF-8 BOM. See rule #9 above.
- **Render cold starts**: Free-tier Render backend may have ~30s cold start delay. The Axios timeout is 15s — first request may fail; retry handles it.
- **Chunk size warning**: `index-BL-jSVw3.js` is ~602 kB (MUI bundle). This is a known, acceptable warning for this project scope.
