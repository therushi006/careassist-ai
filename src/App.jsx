import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';

function SetupVerification() {
  return (
    <div className="container py-4">
      {/* Setup Hero Header */}
      <div className="setup-hero mb-4 text-center">
        <h1 className="fw-bold mb-2">
          <i className="bi bi-heart-pulse-fill me-2 text-danger"></i>
          CareAssist AI
        </h1>
        <p className="lead mb-0 text-white-50">
          Healthcare Information & Appointment Preparation Platform
        </p>
        <div className="mt-3">
          <span className="badge bg-success-subtle text-success-emphasis border border-success px-3 py-2 fs-6">
            <i className="bi bi-check-circle-fill me-1"></i> Phase 1 Setup Successfully Verified
          </span>
        </div>
      </div>

      {/* Technology Verification Checklist */}
      <div className="row g-4 mb-4">
        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded bg-primary-subtle text-primary me-3">
                  <i className="bi bi-lightning-charge-fill fs-4"></i>
                </div>
                <h5 className="card-title mb-0">React 19 + Vite</h5>
              </div>
              <p className="card-text text-secondary small">
                Fast HMR build pipeline active and ready for component development.
              </p>
              <span className="badge bg-primary">Operational</span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded bg-info-subtle text-info-emphasis me-3">
                  <i className="bi bi-bootstrap-fill fs-4"></i>
                </div>
                <h5 className="card-title mb-0">Bootstrap 5</h5>
              </div>
              <p className="card-text text-secondary small">
                Vanilla Bootstrap 5.3 CSS, JS bundle, and standard CSS loaded.
              </p>
              <span className="badge bg-info text-dark">Loaded</span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded bg-warning-subtle text-warning-emphasis me-3">
                  <i className="bi bi-compass-fill fs-4"></i>
                </div>
                <h5 className="card-title mb-0">React Router</h5>
              </div>
              <p className="card-text text-secondary small">
                Client-side routing active with clean URL navigation configured.
              </p>
              <span className="badge bg-warning text-dark">Active</span>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex align-items-center mb-3">
                <div className="p-2 rounded bg-success-subtle text-success me-3">
                  <i className="bi bi-shield-check fs-4"></i>
                </div>
                <h5 className="card-title mb-0">Safety Directives</h5>
              </div>
              <p className="card-text text-secondary small">
                Clear disclaimers, no live API key exposure, no autonomous diagnosis.
              </p>
              <span className="badge bg-success">Compliant</span>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Notice Preview */}
      <div className="alert alert-warning d-flex align-items-center border-warning-subtle" role="alert">
        <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2 fs-5"></i>
        <div>
          <strong>Medical Notice:</strong> CareAssist AI is designed for informational guidance and appointment preparation only. It does not provide medical diagnosis, clinical advice, or emergency triage.
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <main className="main-content">
        <Routes>
          <Route path="/" element={<SetupVerification />} />
          <Route path="*" element={<SetupVerification />} />
        </Routes>
      </main>
    </div>
  );
}
