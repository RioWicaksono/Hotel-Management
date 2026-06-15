# 🏨 Hotel Management System

Sistem manajemen hotel sederhana untuk losmen dengan fitur lengkap untuk mengelola kamar, booking, tamu, dan keuangan.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-NeonDB-336791?style=flat-square&logo=postgresql)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### Kamar & Booking
- ✅ Manajemen kamar (CRUD)
- ✅ Status kamar (Tersedia/Terisi/Dibersihkan/Perbaikan)
- ✅ Booking manual (langsung & RedDoorz)
- ✅ Quick check-in / check-out
- ✅ Calendar view ketersediaan
- ✅ Clickable calendar untuk quick actions

### Tamu
- ✅ Database tamu
- ✅ Riwayat tamu berulang
- ✅ Pencarian & filter

### Keuangan
- ✅ Pencatatan pemasukan & pengeluaran
- ✅ Kategori transaksi
- ✅ Laporan Laba/Rugi (P&L)
- ✅ Laporan Kas Harian
- ✅ Export ke Excel (XLSX)

### Sistem
- ✅ Authentication (ID-based: Admin & Super Admin)
- ✅ Role-based access control
- ✅ Dark/Light theme toggle
- ✅ Floating action button untuk quick add
- ✅ Backup & Restore data

## 🛠️ Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Database | PostgreSQL (NeonDB) |
| ORM | Prisma |
| Auth | NextAuth.js (ID-based) |
| UI | Tailwind CSS + shadcn/ui |
| Charts | Recharts |
| Export | xlsx (SheetJS) |
| PWA | next-pwa |
| Deployment | Vercel + NeonDB |

## 📱 Production Features

### Responsive Design
- ✅ Mobile-first responsive layout
- ✅ Hamburger menu untuk mobile
- ✅ Touch-friendly buttons
- ✅ Mobile sidebar dengan overlay

### Error Handling
- ✅ Error Boundaries
- ✅ 404 page
- ✅ Global error page
- ✅ Loading skeletons
- ✅ Empty states
- ✅ Error recovery

### SEO & Performance
- ✅ Sitemap.xml
- ✅ Robots.txt
- ✅ Structured logging
- ✅ Database indexing
- ✅ Rate limiting
- ✅ PWA manifest

### Security
- ✅ Zod validation
- ✅ Input sanitization
- ✅ CSRF protection (NextAuth)
- ✅ SQL injection prevention (Prisma)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database (NeonDB)
- npm / yarn / pnpm

### Installation

```bash
# Clone repository
git clone <repo-url>
cd hotel-management

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your database URL

# Database setup
npm run db:generate
npm run db:push

# Run development
npm run dev:hotel
```

## 📋 Scripts

```bash
# Development
npm run dev           # Dev server (port 3000)
npm run dev:hotel     # Dev server (port 7000)

# Production
npm run build         # Build for production
npm run start:hotel   # Start production server

# Database
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema changes
npm run db:migrate   # Run migrations
npm run db:seed       # Seed database

# Testing
npm test              # Run tests
npm run test:ui       # Tests with UI

# QA/QC
npm run qa:check      # Lint + build check
npm run qc:db         # Validate schema
npm run qc:types      # TypeScript check
```

## 🔐 User Roles

| Role | ID | Password | Akses |
|------|-----|----------|-------|
| **Super Admin** | `SA` | `SA#123` | Full access + user management |
| **Admin** | `Admin` | `Admin#123` | Kelola kamar, booking, tamu, transaksi |

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/         # Auth pages
│   ├── (dashboard)/     # Dashboard pages
│   └── api/           # API routes
├── components/
│   ├── ui/            # shadcn/ui
│   └── ...
├── lib/               # Utilities
├── actions/            # Server Actions
├── types/              # TypeScript types
public/
├── sitemap.xml        # SEO
└── robots.txt         # Crawlers
```

## 📚 Resources

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://prisma.io/docs)
- [shadcn/ui](https://ui.shadcn.com)
- [NeonDB Docs](https://neon.tech/docs)
- [Tailwind CSS](https://tailwindcss.com)

## 📝 License

MIT License
