# 🏠 NESTORA — AI-Powered PropTech Platform

<div align="center">

![NESTORA Banner](https://img.shields.io/badge/NESTORA-PropTech-6366f1?style=for-the-badge&logo=house&logoColor=white)
![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

**Rent smarter. Match better. Sign safely.**

A full-stack PropTech web application that makes renting transparent, safe, and intelligent — powered by a production Supabase database with 7,691 real property listings.

</div>

---

## 👩‍💻 Core Database Contribution — Heshvi

> **Primary Contribution by Heshvi (Database Architect & Engineer)**
> - Designed and deployed the complete PostgreSQL schema on Supabase.
> - Processed and imported **7,691 property listings** across major Indian metro cities.
> - Structured **100 roommate profiles** with personality vectors, interests, and professional backgrounds.
> - Standardized **10 legal lease clauses** mapped to the Model Tenancy Act (MTA) 2021.
> - Configured Row Level Security (RLS) policies and REST API integration endpoints.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🏘️ **Explore** | Browse 7,691 real rental listings with smart search, filters, and an interactive map |
| 🤝 **Roommate Matching** | 100 verified profiles with MBTI personality badges and interest tags |
| 🔍 **LeaseLens** | AI-powered lease analysis — upload your PDF and get a safety score |
| 📊 **Dashboard** | Live stats from Supabase — properties by city, average rent, ratings |
| 🛡️ **Trust Center** | Landlord KYC, property verification, and zero hidden charges policy |
| ⚖️ **Compare** | Side-by-side comparison of up to 3 properties |

---

## 🗄️ Database Architecture

> **This is the core of NESTORA.** The database was designed, seeded, and deployed by the team as the primary technical contribution.

### Supabase PostgreSQL — Production Database

| Table | Rows | Description |
|---|---|---|
| `properties` | **7,691** | Full rental listings with costs, amenities, trust badges, coordinates |
| `roommate_profiles` | **100** | Detailed profiles with MBTI, interests, professional background |
| `lease_clauses` | **10** | AI-explained standard lease clauses with risk classification |
| `lease_analyses` | Dynamic | Stores AI audit results per uploaded PDF |
| `roommate_feedback` | Dynamic | User feedback on roommate matches |

### `properties` Schema (Key Columns)

```sql
id                    UUID PRIMARY KEY
title                 TEXT
neighborhood          TEXT
city                  TEXT
property_type         TEXT         -- Apartment, Villa, Studio, PG...
bedrooms              INTEGER
bathrooms             INTEGER
carpet_area           INTEGER      -- sqft
furnishing            TEXT         -- Furnished / Semi / Unfurnished
base_rent             INTEGER      -- ₹/month
deposit               INTEGER
utilities_estimate    INTEGER
maintenance_monthly   INTEGER
internet_monthly      INTEGER
total_estimated_monthly INTEGER    -- All-in cost
move_in_total_cost    INTEGER      -- First month total
images                TEXT[]       -- Array of image URLs
amenities             TEXT[]       -- Array of amenity strings
verified              BOOLEAN
verified_owner        BOOLEAN
recently_inspected    BOOLEAN
fast_response         BOOLEAN
rating                NUMERIC(3,1)
reviews_count         INTEGER
available_from        DATE
coordinates           JSONB        -- { lat, lng, x, y }
distances             JSONB        -- { officeMinutes, metroMinutes, ... }
transparency_details  JSONB        -- Full cost breakdown
```

### `lease_clauses` Risk Levels

| Risk Level | Colour | Meaning |
|---|---|---|
| `Safe & Standard` | 🟢 Green | Normal clause, no action needed |
| `Important Caveat` | 🟡 Amber | Read carefully before signing |
| `Caution / Negotiate` | 🔴 Red | Negotiate or reject this clause |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** — type-safe component architecture
- **Vite** — blazing-fast dev server and build tool
- **Tailwind CSS v3** — utility-first styling
- **Lucide React** — icon library
- **Axios** — HTTP client for FastAPI backend

### Backend / Database
- **Supabase** (PostgreSQL) — primary database, real-time, auth-ready
- **FastAPI** (Python) — lease PDF analysis microservice
- **`@supabase/supabase-js`** — browser client with Row Level Security support

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- A Supabase project (or use the provided credentials)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nestora.git
cd nestora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_BASE_URL=http://127.0.0.1:8000
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) 🎉

### 5. (Optional) Start the FastAPI backend for LeaseLens

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python main.py
```

---

## 📂 Project Structure

```
nestora/
├── src/
│   ├── components/
│   │   ├── PropertyCard.tsx          # Zillow-style listing card
│   │   ├── PropertyDetailModal.tsx   # Full property details popup
│   │   ├── PropertyComparisonModal.tsx # Side-by-side compare
│   │   ├── InteractiveMap.tsx        # CSS pin map with coordinates
│   │   ├── SmartSearchFilterDrawer.tsx # Filter sidebar
│   │   ├── RoommateMatching.tsx      # Profiles + MBTI badges
│   │   ├── LeaseLens.tsx             # AI lease analysis + upload
│   │   ├── TrustCenter.tsx           # Verification pillars
│   │   └── Dashboard.tsx             # Live stats dashboard
│   ├── hooks/
│   │   ├── useProperties.ts          # Fetches from Supabase `properties`
│   │   ├── useRoommates.ts           # Fetches from `roommate_profiles`
│   │   └── useLeaseClauses.ts        # Fetches from `lease_clauses`
│   ├── utils/
│   │   ├── supabaseClient.ts         # Supabase browser client
│   │   ├── apiClient.ts              # Axios → FastAPI
│   │   └── debug.ts                  # Dev-only logging helpers
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces (DB-matched)
│   ├── App.tsx                       # Root app with tab navigation
│   ├── main.tsx                      # Vite entry point
│   └── index.css                     # Tailwind + global styles
├── .env.example                      # Environment template
├── .gitignore
├── tailwind.config.js
├── vite.config.ts
└── README.md
```

---

## 🖥️ Screenshots

### Explore — 7,691 Real Listings
> Browse, search, and filter real rental properties fetched live from Supabase.

### Roommate Matching
> 100 verified profiles with MBTI personality types and interest tags.

### LeaseLens — AI Lease Analysis
> Upload a lease PDF → get an instant safety score (0–100) with clause-by-clause breakdown.

### Dashboard
> Live stats computed directly from Supabase — no static mock data.

---

## 🔐 Security Notes

- `.env.local` is **gitignored** — your Supabase keys are never committed
- Supabase **Row Level Security (RLS)** ready — enable per-table policies in Supabase dashboard
- The anon key used is a **publishable key** (safe for frontend use)

---

## 📜 License

MIT — free to use, fork, and build upon.

---

## 👨‍💻 Team

| Role | Contribution |
|---|---|
| **Database Architect** | Designed and deployed the entire Supabase PostgreSQL schema; sourced, cleaned, and seeded 7,691 property listings, 100 roommate profiles, and 10 lease clauses |
| **Frontend Developer** | Built the React 18 + TypeScript UI, component architecture, and Supabase integration |

---

<div align="center">
  <strong>Built with ❤️ for renters who deserve transparency.</strong>
</div>
