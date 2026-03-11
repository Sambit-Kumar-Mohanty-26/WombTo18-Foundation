# WombTo18 Foundation — Frontend

> **A modern, accessible web platform for the WombTo18 Foundation**, built to inspire donors, inform the public, and empower the organization to manage content and donor relationships efficiently.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com)
[![Built with Vite](https://img.shields.io/badge/Built%20with-Vite%206-646CFF?logo=vite)](https://vitejs.dev)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Environment & Configuration](#environment--configuration)
- [Authentication Flow](#authentication-flow)
- [Content Management](#content-management)
- [Routing Architecture](#routing-architecture)
- [UI & Design System](#ui--design-system)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

WombTo18 Foundation is a child welfare NGO focused on providing care from conception to age 18. This frontend application serves three primary user groups:

| User Group     | Access Level                                                             |
| -------------- | ------------------------------------------------------------------------ |
| **Public**     | Homepage, About, Services, Blog, Impact, Press, Donation page            |
| **Donors**     | Conditional dashboard (full or receipts-only) based on donation amount   |
| **Admins**     | Full admin panel — donors, programs, reports, blog posts, case studies   |

---

## Features

### 🌐 Public Website
- Responsive home page with animated scroll-reveal sections
- Service / program showcase
- Impact metrics and donor wall
- Blog & Stories with live content from admin
- Press releases
- Donation page with preset amounts and Razorpay-ready integration

### 🔐 Donor Authentication
- Email / Donor ID based login
- OTP verification (first-time login for premium tier)
- **Conditional dashboard access:**
  - Donated ≥ ₹5,000 → Full dashboard (overview, reports, certificates, events)
  - Donated < ₹5,000 → Receipts & donation history only
- Session persistence via `localStorage`
- Smart Navbar: shows "My Dashboard" when logged in, "Donor Login" when not

### 📊 Donor Dashboard
- Total donated, impact score, donation history
- Impact reports, event calendar
- 80G Certificate & receipt downloads

### 🛡️ Admin Panel
- Donor management table (search, filter, export)
- Program and report management
- **Blog Post management** — Create, Edit, Delete, Draft/Publish
- **Case Study management** — Create, Edit, Delete with region, tags, impact summary
- Live content sync: admin changes instantly reflect on the public blog page

---

## Tech Stack

| Category            | Technology                                                    |
| ------------------- | ------------------------------------------------------------- |
| **Framework**       | [React 18](https://react.dev) + [Vite 6](https://vitejs.dev) |
| **Language**        | TypeScript                                                    |
| **Styling**         | Tailwind CSS v4                                               |
| **Routing**         | React Router v7                                               |
| **UI Components**   | Radix UI primitives + shadcn/ui + Lucide icons                |
| **Forms**           | React Hook Form + Zod validation                              |
| **Animations**      | Motion (Framer Motion)                                        |
| **Charts**          | Recharts                                                      |
| **Notifications**   | Sonner (toast)                                                |
| **Analytics**       | Vercel Analytics + Speed Insights                             |

---

## Project Structure

```
Frontend/
├── public/                     # Static assets (logos, favicons)
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── donor-login/    # DonorLoginForm, OTPVerification
│   │   │   ├── layout/         # PublicLayout, DashboardLayout, AdminLayout, Navbar, Footer
│   │   │   ├── sections/       # HomePage section components
│   │   │   └── ui/             # shadcn/ui primitives (Button, Card, Input, etc.)
│   │   ├── context/
│   │   │   └── ContentContext.tsx  # Shared blog/case study store with CRUD methods
│   │   ├── lib/
│   │   │   └── auth.ts         # Mock auth service (login, verifyOtp, getSession, logout)
│   │   ├── pages/
│   │   │   ├── admin/          # AdminDashboard, AdminDonors, AdminBlog, AdminCaseStudies, etc.
│   │   │   ├── donor/          # DonorDashboard, DonorDonations, DonorCertificates, etc.
│   │   │   │   ├── DonorLogin.tsx
│   │   │   │   └── DonorVerifyOtp.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── BlogPage.tsx
│   │   │   ├── DonatePage.tsx
│   │   │   └── HomePage.tsx
│   │   ├── routes.ts           # Centralized React Router config
│   │   └── App.tsx
│   ├── styles/
│   │   ├── index.css           # Global styles
│   │   └── theme.css           # CSS variables, custom scrollbar, Tailwind @theme
│   └── main.tsx                # App entry point + ContentProvider wrapper
├── index.html
├── package.json
├── vite.config.ts
└── vercel.json                 # SPA fallback rewrite rules for Vercel
```

---

## Getting Started

### Prerequisites

- Node.js **≥ 18.x**
- npm or pnpm (pnpm recommended)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Wombto18-Foundation/Team_Orion.git
cd Team_Orion/Frontend

# 2. Install dependencies
npm install
# or
pnpm install

# 3. Start the development server
npm run dev
```

The app will be available at **http://localhost:5173**

---

## Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start local development server (Vite)   |
| `npm run build` | Build the production bundle              |

---

## Environment & Configuration

This project currently uses a **mock/in-memory backend**. No `.env` file is required for local development.

When integrating a real backend, create a `.env.local` file:

```env
VITE_API_BASE_URL=https://api.wombto18.org
VITE_RAZORPAY_KEY=rzp_live_xxxxxxxxxxxx
```

> ⚠️ Never commit `.env.local` to version control. It is already included in `.gitignore`.

---

## Authentication Flow

```
User visits /dashboard
        │
        ▼ (no session)
   /donor/login
        │
        ├─── eligible (donated ≥ ₹5,000) ──▶ /donor/verify-otp ──▶ /dashboard (full)
        │
        └─── not eligible (donated < ₹5,000) ──▶ /dashboard/certificates (receipts only)
```

- **Session** is stored as JSON in `localStorage` under the key `donor_session`.
- **Mock credentials for testing:**
  - Premium donor: any email containing the word `elite` (e.g. `user@elite.com`)
  - Mock OTP: `123456`
  - Standard donor: any other email (skips OTP, receipts access only)

---

## Content Management

Blog posts and case studies are managed via a shared React `ContentContext` (`src/app/context/ContentContext.tsx`).

- **Admins** create/edit/delete content at `/admin/blog` and `/admin/case-studies`.
- The **public Blog page** (`/blog`) reads directly from this same context.
- Changes made in the admin panel are reflected **immediately** on the public site.

> In production, replace the in-memory store with API calls to your backend (REST or GraphQL).

---

## Routing Architecture

| Path                        | Layout           | Component               | Auth Required |
| --------------------------- | ---------------- | ----------------------- | ------------- |
| `/`                         | PublicLayout     | HomePage                | ❌            |
| `/about`                    | PublicLayout     | AboutPage               | ❌            |
| `/blog`                     | PublicLayout     | BlogPage                | ❌            |
| `/donate`                   | PublicLayout     | DonatePage              | ❌            |
| `/donor/login`              | PublicLayout     | DonorLogin              | ❌            |
| `/donor/verify-otp`         | PublicLayout     | DonorVerifyOtp          | ❌            |
| `/dashboard`                | DashboardLayout  | DonorDashboard          | ✅ (Donor)    |
| `/dashboard/donations`      | DashboardLayout  | DonorDonations          | ✅ (Donor)    |
| `/dashboard/certificates`   | DashboardLayout  | DonorCertificates       | ✅ (Donor)    |
| `/admin`                    | AdminLayout      | AdminDashboard          | 🔒 (Admin)   |
| `/admin/donors`             | AdminLayout      | AdminDonors             | 🔒 (Admin)   |
| `/admin/blog`               | AdminLayout      | AdminBlog               | 🔒 (Admin)   |
| `/admin/case-studies`       | AdminLayout      | AdminCaseStudies        | 🔒 (Admin)   |

---

## UI & Design System

- **Theme:** Dark emerald green + amber/orange primary accent
- **CSS Variables:** Defined in `src/styles/theme.css` using `@theme`
- **Components:** Built on Radix UI primitives, styled with Tailwind utility classes
- **Typography:** System-default sans-serif, structured via Tailwind prose utilities
- **Animations:** Scroll-reveal fade-up via `ScrollReveal.tsx` (powered by Motion)
- **Custom Scrollbar:** Emerald thumb with orange hover, applied globally in `theme.css`

---

## Deployment

This project is deployed on **Vercel** with automatic CI/CD on push to `main`.

### Manual Deploy

```bash
npm run build
# Deploy the generated `dist/` folder to any static host (Vercel, Netlify, GitHub Pages)
```

### Vercel SPA Rewrite

The `vercel.json` contains a catch-all rewrite to support client-side routing:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feat/your-feature-name`
3. Commit your changes using [Conventional Commits](https://www.conventionalcommits.org/):
   ```
   feat: add donor OTP verification flow
   fix: correct Navbar session detection logic
   chore: update dependencies
   ```
4. Push to your branch: `git push origin feat/your-feature-name`
5. Open a Pull Request against `main`.

> Please run `npm run build` before submitting to ensure there are no build errors.

---

## License

This project is proprietary and maintained by **WombTo18 Foundation — Team Orion**.  
Unauthorized copying, distribution, or modification is prohibited without explicit written consent.

---

<div align="center">
  <sub>Built with ❤️ for children's welfare — WombTo18 Foundation © 2026</sub>
</div>
