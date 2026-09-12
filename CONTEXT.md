# Portfolio Project Context

## Overview
This project is a dynamic portfolio website for a Software Developer. It features a React/Vite frontend with a Cyberpunk/Terminal aesthetic and an Express/Node.js backend connected to MongoDB. The goal is to transition from a static portfolio to a fully dynamic, content-managed platform with an integrated Admin Dashboard.

---

## Features & Requirements (Current & Proposed)

### 1. Frontend (Public Site)
**Requested Features:**
- **Floating Contact Icons**: Email and WhatsApp icons positioned at the left edge (middle of the screen) for quick contact.
- **Dynamic Projects**: Live project demos, screenshots, and GitHub links fetched from the database.
- **Dynamic Content**: Experience, biography, tech skills, and reviews rendered dynamically based on backend data.
- **Contact Form**: Users can send queries/messages.

**Suggested Additions (Best Practices & Engagement):**
- **Blog / Articles Section**: A space to share technical writing or tutorials, fetched from the backend or an external API (like Dev.to/Medium).
- **SEO & Open Graph Tags**: Dynamic meta tags for better search engine indexing and attractive social media sharing previews.
- **Project Filtering/Sorting**: Allow visitors to filter projects by tech stack (e.g., "React", "Node.js").
- **Dark/Light Mode Toggle**: While the cyberpunk theme is great, an accessibility-friendly light mode can be a good addition.
- **Analytics Integration**: Add simple visitor tracking (e.g., Google Analytics or Vercel Analytics) to monitor traffic.

### 2. Admin Dashboard (Private/Authenticated)
**Requested Features:**
- **Manage Queries**: View and respond to user messages/queries submitted via the contact form.
- **Manage Technologies**: CRUD operations for tech skills (upload images via Cloudinary or use URLs).
- **Manage Projects**: Form for adding, updating, and deleting project details (including links and screenshots).
- **Update Resume**: Upload and manage resume documents using Google Drive API.
- **Manage Reviews**: Approve, edit, or delete client reviews.

**Suggested Additions (Security & MERN Best Practices):**
- **Secure Authentication (JWT)**: Implement a robust login system using JSON Web Tokens (JWT) stored in HTTP-only cookies to prevent XSS attacks, along with bcrypt for password hashing.
- **Rate Limiting & Security Headers**: Enhance API security against brute-force attacks and common vulnerabilities (using `helmet` and `express-rate-limit`).
- **Dashboard Analytics**: A landing page on the admin panel showing quick stats (e.g., "5 unread queries", "Total profile views").
- **Audit Logging**: Simple logs to track when content was last updated or when a login occurred.
- **Password Reset Flow**: Implement a "forgot password" feature using email verification (e.g., via Nodemailer).

---

## Database Schema (MongoDB Collections)

### Core Collections
1. **Reviews**: Stores client testimonials (name, company, text, rating, status).
2. **Technologies**: Stores tech stack items (name, category, image/icon url, proficiency).
3. **Projects**: Stores portfolio projects (title, description, tech stack, github link, demo link, screenshots).
4. **Queries**: Stores messages submitted through the contact form (name, email, message, status).
5. **Resume**: Stores metadata and Google Drive file IDs/links for the active resume document.
6. **User (Admin)**: Stores admin credentials for dashboard access (email, hashed password, role).

### Suggested Additional Collections (For a comprehensive Resume update)
7. **Education**: Degrees, institutions, graduation dates, and relevant coursework.
8. **Certifications**: Professional certificates (e.g., AWS, MongoDB, Udemy) with verification links.
9. **Experience**: Detailed work history (company, role, start/end dates, bullet points of achievements).
10. **Articles/Posts**: To power a potential blog section.

---

## Core Technologies & Integrations
- **Frontend**: React.js, Vite, Material UI (MUI), Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Image/Media CDN**: Cloudinary
- **Document Storage**: Google Drive API (for resume management)
