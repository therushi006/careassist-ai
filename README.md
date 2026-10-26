# CareAssist AI — Healthcare Information & Appointment Preparation Platform

**CareAssist AI** is a responsive, patient-empowerment web application designed to help individuals organize their health concerns, simplify complex clinical jargon, and generate structured discussion agendas for upcoming doctor visits.

> **Important Medical Notice**: CareAssist AI is an educational and appointment preparation tool. It does **not** provide medical diagnosis, clinical treatment recommendations, or emergency triage. In case of life-threatening symptoms, call 911 or local emergency services immediately.

---

## 🚀 Key Features

1. **Central Clinical Dashboard (`/`)**
   - Real-time metrics tracking scheduled appointments, saved preparation agendas, and visit notes using browser `localStorage`.
   - Quick-action shortcuts and actionable empty states with zero fabricated patient records.

2. **Interactive Health Information Assistant (`/assistant`)**
   - Simulated conversational assistant using deterministic, rule-guided response logic (**not a live AI model**).
   - Provides structured guidance on preparing for physicals, blood tests, specialist visits, and medication safety questions.
   - Refuses diagnostic inquiries with strict non-diagnostic safety guardrails.

3. **Multi-Step Appointment Preparation Engine (`/prep`)**
   - Guided intake wizard collecting chief complaints, symptom timelines, triggers, severity, and patient visit goals.
   - **Rule-Based Question Generator**: Evaluates duration, severity, and triggers to auto-generate categorized doctor questions.
   - **Printable Clinical Agenda**: Clean `@media print` layout with ruled handwriting sections for taking notes in the clinic.

4. **Appointment Manager (`/appointments`)**
   - Full CRUD operations for upcoming and past appointments with status toggling (*Scheduled* vs. *Completed*).
   - Instant search and filtering by specialty, provider, or visit reason.
   - Cross-linking to attached prep sheets and follow-up notes.

5. **Doctor Visit Notes Tracker (`/notes`)**
   - Complete CRUD tracking of post-visit discussions, user-entered physician directions, and action checklists.
   - Full-text search and tag-based filtering.
   - Explicit disclaimer clarifying that notes are self-reported memory aids and not certified Electronic Health Records (EHR).

6. **Searchable Health Information Library & Terminology Simplifier (`/library`)**
   - Directory of doctor visit preparation checklists and diagnostic guides.
   - **Medical Terminology Simplifier**: Translates complex clinical words or sentences into plain English with phonetic pronunciations and doctor questions. Safe fallback prevents definition fabrication when terms are unverified.

---

## 🛠️ Technology Stack

- **Frontend Library**: React 19 + JavaScript (ES6+)
- **Build Tooling**: Vite 8.3
- **CSS & UI Framework**: Vanilla Bootstrap 5.3 + Bootstrap Icons + Custom Standard CSS (*No Tailwind CSS, No React-Bootstrap*)
- **Client-Side Routing**: React Router DOM 7
- **Persistence Layer**: Browser `localStorage` with reactive event dispatching (`careassist_storage_change`)
- **Privacy Architecture**: 100% in-browser data processing; zero remote data transmission

---

## 💻 Getting Started Locally

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### Installation & Launch
1. Clone or open the project folder in your terminal:
   ```bash
   cd "AI assement"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

CareAssist AI includes a comprehensive suite of 146 automated tests covering storage resilience, question generation heuristics, CRUD operations, search filters, and deployment configurations:

```bash
# Run all automated test suites
node testStorageService.js
node testPhase4PrepFlow.js
node testPhase5AppointmentsNotes.js
node testPhase6HealthLibrary.js
node testPhase7E2EQA.js
```

### Production Build Verification
To verify asset compilation and tree-shaking:
```bash
npm run build
```

---

## 🌐 Deployment Instructions

The application is pre-configured for static Single-Page Application (SPA) hosting with client-side routing fallbacks:
- **Netlify**: Pre-configured via [`public/_redirects`](./public/_redirects) (`/* /index.html 200`).
- **Vercel**: Pre-configured via [`vercel.json`](./vercel.json) rewrites.

### Steps to Deploy to Vercel:
1. Push your repository to GitHub or GitLab.
2. Log into [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset will auto-detect as **Vite**.
5. Build Command: `npm run build` | Output Directory: `dist`.
6. Click **Deploy**.

### Steps to Deploy to Netlify:
1. Log into [Netlify](https://netlify.com) and click **"Add new site"** > **"Import an existing project"**.
2. Select your repository.
3. Build command: `npm run build` | Publish directory: `dist`.
4. Click **Deploy CareAssist AI**.

---

## 🔒 Privacy & Compliance Disclaimers

- **Zero Cloud Exposure**: All appointments, preparation agendas, and visit notes are saved exclusively in your browser's local storage.
- **Rule-Based Transparency**: Interactive assistance and question generation are powered by deterministic rule-based algorithms. CareAssist AI does not claim to use an autonomous live clinical AI model.
- **Educational Reference Status**: Health library topics are categorized as general educational reference material and have not undergone formal clinical board certification.
