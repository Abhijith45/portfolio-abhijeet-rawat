# ⚡ Abhijeet Rawat — Cyberpunk Developer Portfolio & Admin Engine

> **High-Performance Full-Stack Developer Portfolio, Interactive Cyberpunk HUD Interface & Dynamic Content Management Engine.**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Material UI](https://img.shields.io/badge/Material--UI-v7-007FFF?style=flat-square&logo=mui&logoColor=white)](https://mui.com/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-00FF41?style=flat-square)](LICENSE)

---

## 📑 Table of Contents
1. [Overview](#-overview)
2. [Key Architecture & Features](#-key-architecture--features)
3. [Tech Stack](#-tech-stack)
4. [Project Structure](#-project-structure)
5. [Application Routing](#-application-routing)
6. [Environment Configuration & Security](#-environment-configuration--security)
7. [Database Seeding (Admin & Initial Data)](#-database-seeding-admin--initial-data)
8. [Local Setup & Installation](#-local-setup--installation)
9. [Running Tests](#-running-tests)
10. [Production Deployment Guide](#-production-deployment-guide)
11. [API Architecture](#-api-architecture)
12. [Security & Production Hardening](#-security--production-hardening)
13. [Known Limitations](#-known-limitations)
14. [Buy Me a Coffee](#-buy-me-a-coffee)

---

## 🚀 Overview

This repository houses the full-stack codebase for **Abhijeet Rawat's Developer Portfolio**. Designed around high-tech cyberpunk aesthetics, real-time data streaming visuals, and a headless CMS control base, it empowers seamless project updates, client testimonial moderation, career timeline tracking, and inquiry management.

### Highlights
- 🟢 **Cyber HUD Visual System**: Neon green (`#00FF41`) accents, dark carbon backgrounds (`#050505`), scanline overlays, crosshair indicators, and hardware-accelerated Framer Motion animations.
- ⚡ **In-Memory Caching & Global Purge Engine**: Near-instant API responses with versioned cache invalidation accessible directly from the Admin Panel.
- 🛠️ **Two-Step Project Ingestion Pipeline**: Live link accessibility pre-flight verification, dual-source image management (CDN URL or direct Cloudinary upload), and engineering overview modal.
- 🛡️ **Hardened Admin Panel**: Complete role-based access control (RBAC), JWT authentication with secure HTTP-only cookies, password hashing with `bcryptjs`, and XSS/NoSQL injection mitigations.
- 📜 **Dynamic Alternating Timeline**: Responsive zig-zag career trajectory with automated viewport intersection highlighting.
- 📱 **Fully Responsive Layout**: 3-column desktop and responsive single-column layouts for all devices, coupled with a floating global scroll-to-top controller.

---

## 🏛️ Key Architecture & Features

### 1. In-Memory Database Caching Layer
To optimize MongoDB Atlas network costs and latency:
- Server routes (`/api/projects/featured`, `/api/experiences`, `/api/technologies`, `/api/reviews`) cache query payloads in memory with custom TTLs.
- Admin dashboard exposes a **⚡ Purge System Cache** action that flushes server memory and triggers immediate cache invalidation across all active client browsers.

### 2. Multi-Step Admin Project Creator
- **Step 1 (Metadata & Source Links)**: Validates Title, Tech Stack array, and performs pre-submission ping checks to ensure GitHub repository and Live Demo URLs are reachable.
- **Step 2 (Media & Architectural Overview)**: Ingests external image URLs or uploads directly to Cloudinary, with conditional input locking to prevent invalid submissions.

### 3. Moderation & Inquiry Ingestion
- Contact form submissions are persisted to MongoDB, protected against spam with rate limiters (`express-rate-limit`), sanitized with `xss`, and instantly notify the admin via `nodemailer` (custom SMTP/Gmail App Passwords).
- Client reviews feature approval flows (`APPROVED` / `PENDING`) with batch approvals and batch deletions backed by danger-styled MUI confirmation modals.

---

## 💻 Tech Stack

### Frontend (Client)
- **Framework**: React 19 + Vite 7 (ES Modules)
- **UI & Design**: Material-UI (MUI v7), Emotion, Vanilla CSS
- **Animations**: Framer Motion
- **Icons**: Material Icons, React Icons
- **State & Networking**: Axios (interceptor architecture with caching & retry logic), React Router 7

### Backend (Server)
- **Runtime**: Node.js >= 18 + Express 5
- **Database**: MongoDB Atlas via Mongoose 8
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) + `bcryptjs`
- **Security**: `helmet`, `xss`, `express-rate-limit`, `cookie-parser`, `cors`
- **File Uploads & Media**: Multer + Cloudinary SDK
- **Mailing**: Nodemailer
- **Testing**: Vitest + React Testing Library (frontend)

---

## 📁 Project Structure

```
portfolio-abhijeet-rawat/
├── public/                     # Static assets (favicon, OG images)
├── src/                        # React frontend source
│   ├── components/             # Reusable UI components (Navbar, Footer, ScrollToTop, etc.)
│   ├── sections/               # Page-level section blocks (Hero, Projects, Experience, etc.)
│   ├── pages/                  # Route-level pages (Home, About, Contact, Admin/*)
│   │   └── Admin/              # Protected admin panel pages
│   ├── layouts/                # AdminLayout, PublicLayout wrappers
│   ├── services/               # Axios API service modules
│   ├── utils/                  # Cache utilities, helpers
│   ├── hooks/                  # Custom React hooks
│   ├── theme.js                # MUI theme configuration
│   └── main.jsx                # App entry point
├── server/                     # Node.js + Express backend
│   ├── models/                 # Mongoose schemas (User, Project, Experience, etc.)
│   ├── routes/                 # Express route handlers
│   ├── middleware/             # Auth guard, error handler, cache middleware
│   ├── utils/                  # Cache store, email helpers
│   ├── seed.js                 # Database seeding script
│   ├── index.js                # Express app entry point
│   ├── .env.example            # Server environment variable template
│   └── package.json
├── .env.example                # Client environment variable template
├── .gitignore
├── vite.config.js
└── package.json
```

---

## 🗺️ Application Routing

### Public Routes
| Route | Component | Description |
| :--- | :--- | :--- |
| `/` | `Home` | Hero, Tech Stack matrix, Featured Projects, Experience timeline, Client testimonials |
| `/about` | `About` | Bio, education history, engineering philosophy, and career milestones |
| `/contact` | `Contact` | Contact form with real-time feedback and direct social links |
| `/projects` | `AllProjects` | Infinite scroll paginated directory of all deployed engineering works |

### Admin Routes (Protected by AuthGuard)

> [!IMPORTANT]
> The admin panel is accessible at **`/admin/login`**. On first run, log in with the credentials set in `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env` (configured before running the seed script).

| Route | Component | Purpose |
| :--- | :--- | :--- |
| `/admin/login` | `Login` | Cyberpunk login portal with token exchange |
| `/admin/dashboard` | `Dashboard` | System metrics, quick telemetry, and cache purge trigger |
| `/admin/projects` | `ManageProjects` | 3-column project grid, 2-step creator, batch delete |
| `/admin/experiences` | `ManageExperiences` | Career timeline milestones and skill tags |
| `/admin/technologies` | `ManageTech` | Skills and frameworks categorized by domain |
| `/admin/queries` | `ManageQueries` | 2-column contact messages with mark-as-read & batch delete |
| `/admin/reviews` | `ManageReviews` | 3-column testimonial cards with approval moderation |
| `/admin/resume` | `ManageResume` | Social profiles, phone number, and resume document link editor |

---

## 🔒 Environment Configuration & Security

### 1. Client Environment (`.env` or `.env.local` in root)
Create a `.env` file in the root directory:

```env
# Point to your local Express server or deployed production API
VITE_API_BASE_URL=http://localhost:5000
```

### 2. Server Environment (`server/.env`)
Create a `.env` file in the `server/` directory (template: `server/.env.example`):

```env
# Server Port & Environment
PORT=5000
NODE_ENV=development

# Allowed CORS Origin (Frontend URL)
CLIENT_URL=http://localhost:5173

# Database Connection (MongoDB Atlas)
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/portfolio?retryWrites=true&w=majority

# JWT Authentication Secret (Generate with: openssl rand -hex 32)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# Contact Notification Email
CONTACT_RECEIVER_EMAIL=your_email@gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_gmail_app_password

# Initial Admin Credentials (Used by seed script)
ADMIN_EMAIL=admin@yourportfolio.dev
ADMIN_PASSWORD=YourStrongPasswordHere!

# Cloudinary (Optional — Required only for image upload feature)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

> [!CAUTION]
> **Never commit `.env` files to source control.** All `.env`, `.env.local`, and sensitive credential files are excluded in `.gitignore`. Use `.env.example` templates for reference.

---

## 🌿 Database Seeding (Admin & Initial Data)

A database seed script is provided at [`server/seed.js`](file:///c:/Users/Abhijeet%20Rawat/Desktop/portfolio-abhijeet-rawat/server/seed.js) to initialize your database with:
1. **Admin Account**: Sets up the primary admin user with email and hashed password specified in `ADMIN_EMAIL` and `ADMIN_PASSWORD`.
2. **Projects**: Ingests starter showcase projects.
3. **Technologies**: Seeds full-stack skill matrices across Frontend, Backend, Database, and DevOps categories.
4. **Experiences**: Populates career timeline milestones.
5. **Initial Reviews**: Seeds initial verified testimonials.

### How to Run the Seed Script:

```bash
# Navigate to the server folder
cd server

# Execute seed script
npm run seed
```

Expected output:
```text
Connected to MongoDB Atlas for seeding
Created default Admin User: admin@yourportfolio.dev / YourStrongPasswordHere!
Seeded initial projects
Seeded initial technologies
Seeded initial experiences
Database seeding finished successfully!
```

> [!NOTE]
> The seed script is idempotent for the admin user — it will skip creation if the email already exists. Re-running it may duplicate project/experience/tech data; clear those collections manually before re-seeding if needed.

---

## ⚙️ Local Setup & Installation

### Prerequisites
- **Node.js** >= 18.x
- **npm** >= 9.x
- **MongoDB Atlas** cluster or a local MongoDB instance

### 1. Clone Repository
```bash
git clone https://github.com/abhijeet-rawat/portfolio-abhijeet-rawat.git
cd portfolio-abhijeet-rawat
```

### 2. Configure & Start Server
```bash
cd server
npm install

# Linux / macOS
cp .env.example .env

# Windows
copy .env.example .env

# Edit server/.env with your MongoDB URI & credentials, then:
npm run seed    # Initialize DB with admin user & sample data
npm run dev     # Start Express server (nodemon)
```
*Backend runs on `http://localhost:5000`.*

### 3. Configure & Start Client
```bash
# From the root project directory (not server/)
cd ..
npm install

# Linux / macOS
cp .env.example .env

# Windows
copy .env.example .env

npm run dev
```
*Frontend runs on `http://localhost:5173`.*

> [!TIP]
> After setup, navigate to `http://localhost:5173/admin/login` and log in with the credentials you set in `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

---

## 🧪 Running Tests

The frontend uses **Vitest** and **React Testing Library** for unit and component tests.

```bash
# From the root project directory
npm run test          # Run all tests (watch mode)
npm run test -- --run # Run all tests once (CI mode)
```

Expected output (all passing):
```text
Test Files: X passed
Tests:      70 passed
Duration:   ~Xs
```

> [!NOTE]
> There are no backend unit tests currently. The `server/` routes can be tested manually via Postman or Insomnia.

---

## 🚢 Production Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Link your GitHub repository to **Vercel** or **Netlify**.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Configure Environment Variable:
   - `VITE_API_BASE_URL` = `https://your-portfolio-api.onrender.com` (Your deployed backend URL)

### Backend Deployment (Render / Railway / VPS)
1. Deploy `server/` directory.
2. Set Environment Variables from `server/.env.example`:
   - `NODE_ENV` = `production`
   - `CLIENT_URL` = `https://your-portfolio-domain.com` (Your deployed frontend URL)
   - `MONGODB_URI` = `mongodb+srv://...`
   - `JWT_SECRET` = Strong 32+ character random string
   - `ADMIN_EMAIL` and `ADMIN_PASSWORD`
   - `EMAIL_USER` and `EMAIL_PASS` (for email alerts)
3. Set Start Command: `node index.js`
4. In MongoDB Atlas, ensure **Network Access** allows incoming connections from your backend IP or `0.0.0.0/0` (with strong password authentication enforced).

> [!IMPORTANT]
> Run `npm run seed` once after first deployment to initialize the admin user. Do **not** re-run it on a populated database.

---

## 📡 API Architecture

```
/api
├── /auth
│   ├── POST   /login              # Exchange credentials for JWT cookie
│   ├── POST   /logout             # Invalidate session cookie
│   └── GET    /me                 # Check active authentication state
├── /projects
│   ├── GET    /                   # Paginated projects list
│   ├── GET    /featured           # Top 6 featured projects with hasMore indicator
│   ├── POST   /                   # [Admin] Create new project
│   ├── PUT    /:id                # [Admin] Update project
│   ├── DELETE /:id                # [Admin] Delete project
│   ├── POST   /verify-url         # [Admin] Pre-flight URL reachability validation
│   └── POST   /upload             # [Admin] Upload project cover image
├── /experiences
│   ├── GET    /                   # Retrieve career timeline
│   ├── POST   /                   # [Admin] Add experience record
│   ├── PUT    /:id                # [Admin] Update experience record
│   └── DELETE /:id                # [Admin] Delete experience record
├── /technologies
│   ├── GET    /                   # Retrieve categorized tech stack
│   ├── POST   /                   # [Admin] Add technology
│   ├── PUT    /:id                # [Admin] Update technology
│   └── DELETE /:id                # [Admin] Delete technology
├── /contact
│   ├── POST   /                   # Submit inquiry (Rate limited & sanitized)
│   ├── GET    /                   # [Admin] Fetch all inquiries
│   ├── PUT    /:id/read           # [Admin] Mark inquiry as read
│   └── DELETE /:id                # [Admin] Delete inquiry
├── /reviews
│   ├── GET    /                   # Fetch approved client testimonials
│   ├── POST   /                   # Submit new review
│   ├── GET    /all                # [Admin] Fetch all reviews (pending + approved)
│   ├── PUT    /:id                # [Admin] Approve/Revoke review
│   └── DELETE /:id                # [Admin] Delete review
└── /admin
    └── POST   /purge-cache        # [Admin] Flush in-memory and global caches
```

---

## 🛡️ Security & Production Hardening

- **HTTP-Only Cookies**: JWTs are transmitted exclusively via secure HTTP-Only cookies to protect against client-side script theft.
- **XSS & Injection Protection**: HTML sanitization via `xss` and schema-enforced queries via Mongoose.
- **Rate Limiting**: Contact form submissions are throttled using `express-rate-limit` to prevent denial-of-service and inbox flooding.
- **Secure HTTP Headers**: Comprehensive CSP, DNS prefetch, frameguard, and hidePoweredBy headers via `helmet`.
- **CORS Whitelisting**: Strict origin matching against `CLIENT_URL` prevents unauthorized cross-origin requests.
- **Password Hashing**: Admin credentials are hashed with `bcryptjs` (salt rounds: 12) before storage — plaintext passwords are never persisted.

---

## ⚠️ Known Limitations

- **Cloudinary is optional**: If `CLOUDINARY_*` environment variables are not configured, image upload in the admin project creator will fail. External image URLs still work without Cloudinary.
- **No backend unit tests**: Server-side routes are verified manually. Contributions adding Mocha/Jest tests for the Express layer are welcome.
- **Single admin user**: The current RBAC model supports one admin account. Multi-user or role-tiered admin support is not implemented.
- **In-memory cache is per-instance**: Cache is stored in server process memory. On multi-instance/load-balanced deployments, each instance maintains its own cache. Use Redis for distributed caching at scale.

---

## ☕ Buy Me a Coffee

If you found this codebase inspiring, helpful, or useful in building your own portfolio or web applications, consider buying me a coffee! Your support fuels more open-source engineering work and future updates.

<div align="center">

<a href="https://buymeacoffee.com/abhijith45" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-green.png" alt="Buy Me A Coffee" height="50" style="border-radius: 8px;">
</a>

<br/><br/>

[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-GitHub_Sponsors-EA4AAA?style=for-the-badge&logo=github&logoColor=white)](https://github.com/sponsors/abhijeet-rawat)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/abhijeet-rawat)
[![Portfolio](https://img.shields.io/badge/Live_Portfolio-Visit-00FF41?style=for-the-badge&logo=firefox&logoColor=black)](https://abhijeetrawat.dev)

```
// SUPPORT_THE_DEV: Every coffee powers another commit.
```

</div>

---

**Developed with 💚 by [Abhijeet Rawat](https://github.com/abhijeet-rawat)**
