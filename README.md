# NESTORA — Next-Gen PropTech & Shared-Living Platform

> **“Find a space. Find your people. Live better.”**

NESTORA is a next-generation real-estate and shared-living platform designed specifically to solve the major friction points faced by first-time renters, students, young professionals, roommates, landlords, and property managers.

This is **not** a traditional real-estate listing website. It combines:
- 🏡 **Airbnb-level visual property discovery** with immersive multi-angle galleries, LiDAR floor plans, and 3D walkthroughs
- 🗺️ **Google Maps-style spatial exploration** with animated price pins, custom vector geography, transit overlays, and commute radius filters
- 💳 **Fintech-level cost transparency (TrueCost™)** that exposes monthly base rent, utilities, maintenance, internet, and upfront capital to eliminate hidden-cost anxiety
- 🤖 **AI Housing Concierge (NORA)** providing natural language property discovery, cost calculators, clause explanations, and automated maintenance triage
- 📑 **LeaseLens™ Digital Agreement Analyzer** breaking down legal contract clauses in plain English with risk levels and clarification tips
- 🤝 **Roommate Lifestyle Matching** pairing co-living flatmates across sleep schedules, cleanliness standards, work habits, and guest policies with transparent synergy estimates
- 🛠️ **Real-Time Maintenance Hub** with multi-step issue reporting, contractor dispatching, and a verified activity timeline
- 📊 **Role-Based Living Dashboards** dynamically adapting views for **Tenants (Het)**, **Landlords (Vikramaditya)**, and **Property Managers (Pooja)**
- 🛡️ **Trust Center** backed by a 48-point physical property audit, Aadhaar KYC verification, and bank-grade deposit escrow

---

## 🧭 Core UX Philosophy

1. **TRUST:** Every listing is physically inspected and audited; zero anonymous landlords.
2. **TRANSPARENCY:** TrueCost™ breaks down all recurring utilities, society fees, and one-time deposits upfront.
3. **COMPATIBILITY:** Lifestyle-based roommate discovery grounded in actual daily habits.
4. **SIMPLICITY:** One integrated platform replacing disconnected portals, broker calls, and paper leases.
5. **CONTROL:** Complete tracking over maintenance SLAs, rental receipts, and lease terms.

---

## 🚀 Key Modules & Architecture

### 1. Interactive Property Discovery
- **Split-Screen Desktop Layout:** 40% curated property list paired with 60% interactive vector map.
- **Mobile Map/List Toggle:** Seamless switching between list and map views on mobile viewports.
- **Bidirectional Hover & Click Syncing:** Hovering on cards highlights map price pins (`₹18k`, `₹24k`, `₹36k`), and clicking pins centers the corresponding card.
- **Commute Distance Indicators:** Real commute calculations to tech parks, metro stations, supermarkets, and university hubs.
- **Floating Spatial Controls:** Search this area, boundary lasso drawing, and geolocation beacon.

### 2. TrueCost™ Breakdown
- Base Rent: `₹24,000`
- Estimated Utilities: `₹2,800`
- Society Maintenance: `₹1,200`
- High-Speed Fiber: `₹600`
- **Total Monthly Living Cost:** `₹28,600`
- **One-Time Move-In Capital:** `₹76,600` (Refundable deposit + first month living + digital stamp fee).

### 3. AI Smart Search & NORA Concierge
- Natural language input: *"Find me a furnished 1BHK under ₹20,000 within 20 minutes of my college with parking."*
- Real-time constraint extraction into structured tokens (`[Budget: ≤₹20k]`, `[Type: 1BHK]`, `[Commute: ≤20m]`).
- Floating conversational assistant NORA with rich interactive card responses.

### 4. LeaseLens™ Agreement Reader
- Interactive contract viewer with highlighted clauses: Security Deposit, Rent Escalation, Lock-in Period, Notice Period, Maintenance division, Utilities, and Termination.
- Plain-English breakdown panel highlighting hidden fees and landlord negotiation tips.

### 5. Roommate Lifestyle Synergy
- 60-second lifestyle onboarding quiz: Sleep rhythm, WFH/Office habits, cleanliness standard, cooking style, social boundary.
- Lifestyle compatibility estimates (94%, 91%, 88%) with trait overlap and honest disclosures of minor differences.

### 6. Maintenance Hub & Activity Timeline
- Visual activity timeline: `09:12 Reported` → `09:20 Notified` → `09:35 Assigned` → `14:30 Arrived` → `15:05 Resolved`.
- Live contractor card with phone contact, rating, and real-time ETA.

### 7. Multi-Persona Role Switching
- **Tenant View (Het Patel):** Rent payment with confetti celebration & HRA tax receipt download, active lease countdown, expense tracking.
- **Landlord View (Vikramaditya Sanghavi):** Portfolio occupancy, gross monthly yield (₹76k), tenant roster, escrow deposits.
- **Property Manager View (Pooja Trivedi):** 18 managed properties (42 units), ₹4.8L GMV, urgent triage queue with 4-hour SLA dispatch.

### 8. Trust Center & 6 Verification Pillars
- Identity & Background KYC
- 48-Point Physical Property Audit
- Authentic Geotagged Visuals
- Bank-Grade Deposit Escrow
- Guaranteed Maintenance SLA
- Authentic Community Ledger

---

## 🛠️ Tech Stack

- **Framework:** React 19 + TypeScript
- **Bundler & Tooling:** Vite 8
- **Styling:** Tailwind CSS + Custom Design System tokens
- **Typography:** Plus Jakarta Sans & JetBrains Mono
- **Icons:** Lucide React
- **Micro-Interactions:** Canvas Confetti & custom SVG vector map graphics

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Build for Production
```bash
npm run build
```
The optimized bundle will be created in the `dist/` directory.

---

## 📄 License & Attribution

Built for the Nirma University Hackathon 2026. Designed with passion for frictionless modern living.
