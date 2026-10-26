import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import EmergencyNotice from './components/common/EmergencyNotice';
import Footer from './components/common/Footer';
import Dashboard from './pages/Dashboard';
import PlaceholderPage from './components/common/PlaceholderPage';

export default function App() {
  return (
    <div className="app-container d-flex flex-column min-vh-100">
      {/* 1. Primary Navigation */}
      <Navbar />

      {/* 2. Cautious Emergency & Safety Disclaimer */}
      <EmergencyNotice />

      {/* 3. Main Route Content */}
      <main className="main-content flex-grow-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route
            path="/assistant"
            element={
              <PlaceholderPage
                title="Health Assistant (Simulated Demo)"
                icon="bi-chat-heart"
                phase="Phase 3 Target"
                description="Interactive healthcare information assistant with clearly labelled simulated responses, visit workflow guides, and test preparation questions."
                actionText="Back to Dashboard"
                actionLink="/"
              />
            }
          />
          <Route
            path="/prep"
            element={
              <PlaceholderPage
                title="Appointment Preparation Form"
                icon="bi-clipboard2-check"
                phase="Phase 4 Target"
                description="Guided patient intake to structure your chief complaint, symptom timeline, impacts on daily routine, and generate doctor questions."
                actionText="Go to Dashboard"
                actionLink="/"
              />
            }
          />
          <Route
            path="/appointments"
            element={
              <PlaceholderPage
                title="Appointment Manager"
                icon="bi-calendar-event"
                phase="Phase 5 Target"
                description="Schedule, track, and manage your upcoming doctor visits with linked preparation agendas."
                actionText="Go to Dashboard"
                actionLink="/"
              />
            }
          />
          <Route
            path="/notes"
            element={
              <PlaceholderPage
                title="Visit Notes Manager (CRUD)"
                icon="bi-journal-text"
                phase="Phase 5 Target"
                description="Full create, view, edit, and delete functionality for doctor instructions, medication notes, and follow-up clinical items."
                actionText="Go to Dashboard"
                actionLink="/"
              />
            }
          />
          <Route
            path="/library"
            element={
              <PlaceholderPage
                title="Health Library & Jargon Simplifier"
                icon="bi-journal-medical"
                phase="Phase 6 Target"
                description="Searchable library of common medical conditions, visit preparation checklists, and plain-English medical terminology translator."
                actionText="Go to Dashboard"
                actionLink="/"
              />
            }
          />
          <Route
            path="*"
            element={
              <PlaceholderPage
                title="Page Not Found"
                icon="bi-compass"
                phase="404"
                description="The page you requested does not exist. Please return to the dashboard."
                actionText="Return to Dashboard"
                actionLink="/"
              />
            }
          />
        </Routes>
      </main>

      {/* 4. Footer */}
      <Footer />
    </div>
  );
}
