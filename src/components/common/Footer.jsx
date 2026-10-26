import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer bg-white border-top border-light-subtle pt-4 pb-3 mt-auto">
      <div className="container">
        <div className="row g-4 mb-3">
          {/* Column 1: Brand & Purpose */}
          <div className="col-lg-5 col-md-6">
            <div className="d-flex align-items-center mb-2">
              <span className="brand-icon-box bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2">
                <i className="bi bi-heart-pulse-fill"></i>
              </span>
              <span className="fw-bold fs-5 text-navy">CareAssist AI</span>
            </div>
            <p className="text-secondary small mb-2">
              An intelligent healthcare information and appointment preparation platform designed to help patients organize their health inquiries, clarify medical terms, and prepare structured agendas for doctor visits.
            </p>
            <span className="badge bg-light text-secondary border">AI Growth & Automation Associate Project</span>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="fw-bold text-navy mb-2">Platform Tools</h6>
            <ul className="list-unstyled small mb-0">
              <li className="mb-1">
                <Link to="/" className="text-decoration-none text-secondary hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary small"></i> Dashboard
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/assistant" className="text-decoration-none text-secondary hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary small"></i> Health Assistant
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/prep" className="text-decoration-none text-secondary hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary small"></i> Appointment Prep
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/appointments" className="text-decoration-none text-secondary hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary small"></i> Appointment Manager
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/notes" className="text-decoration-none text-secondary hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary small"></i> Visit Notes
                </Link>
              </li>
              <li className="mb-1">
                <Link to="/library" className="text-decoration-none text-secondary hover-primary">
                  <i className="bi bi-chevron-right me-1 text-primary small"></i> Health Library
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Medical Ethics & Privacy Notice */}
          <div className="col-lg-4 col-md-3 col-6">
            <h6 className="fw-bold text-navy mb-2">Patient Privacy & Safety</h6>
            <p className="text-secondary small mb-2">
              <i className="bi bi-shield-lock-fill text-success me-1"></i> <strong>Zero Cloud Exposure:</strong> All notes, appointments, and prep cards are stored locally in your browser's <code>localStorage</code>.
            </p>
            <p className="text-secondary small mb-0">
              <i className="bi bi-info-circle-fill text-primary me-1"></i> <strong>Non-Diagnostic:</strong> Never disregards or substitutes professional medical advice from licensed physicians.
            </p>
          </div>
        </div>

        <div className="pt-3 border-top border-light-subtle d-flex flex-column flex-md-row justify-content-between align-items-center small text-muted">
          <span>&copy; {new Date().getFullYear()} CareAssist AI. Created for AI Growth & Automation Associate Assessment.</span>
          <span className="mt-2 mt-md-0">
            <i className="bi bi-check2-circle text-success me-1"></i> Standard Bootstrap 5 • Local Storage • Privacy-Preserving
          </span>
        </div>
      </div>
    </footer>
  );
}
