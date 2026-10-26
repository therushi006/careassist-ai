import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import EmergencyNotice from './components/common/EmergencyNotice';
import Footer from './components/common/Footer';
import Dashboard from './pages/Dashboard';
import AppointmentPrepPage from './pages/AppointmentPrepPage';
import AppointmentManagerPage from './pages/AppointmentManagerPage';
import NotesPage from './pages/NotesPage';
import HealthLibraryPage from './pages/HealthLibraryPage';
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
          <Route path="/prep" element={<AppointmentPrepPage />} />
          <Route path="/appointments" element={<AppointmentManagerPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/library" element={<HealthLibraryPage />} />
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
