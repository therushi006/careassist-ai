import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  const [navExpanded, setNavExpanded] = useState(false);

  const toggleNav = () => setNavExpanded(!navExpanded);
  const closeNav = () => setNavExpanded(false);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary-healthcare shadow-sm sticky-top">
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center fw-bold fs-4 text-white" to="/" onClick={closeNav}>
          <div className="brand-icon-box bg-white text-primary rounded-circle d-flex align-items-center justify-content-center me-2">
            <i className="bi bi-heart-pulse-fill fs-5"></i>
          </div>
          <span>CareAssist <span className="fw-light text-info">AI</span></span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={toggleNav}
          aria-controls="careassist-navbar"
          aria-expanded={navExpanded}
          aria-label="Toggle navigation navigation menu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Collapsible Nav Links */}
        <div className={`collapse navbar-collapse ${navExpanded ? 'show' : ''}`} id="careassist-navbar">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 align-items-lg-center">
            <li className="nav-item">
              <NavLink
                to="/"
                end
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-speedometer2 me-1"></i> Dashboard
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/assistant"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-chat-heart me-1"></i> Health Assistant
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/prep"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-clipboard2-check me-1"></i> Appointment Prep
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/appointments"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-calendar-event me-1"></i> Appointments
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/notes"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-journal-text me-1"></i> Visit Notes
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/library"
                className={({ isActive }) => `nav-link px-3 ${isActive ? 'active fw-semibold' : ''}`}
                onClick={closeNav}
              >
                <i className="bi bi-journal-medical me-1"></i> Health Library
              </NavLink>
            </li>
          </ul>

          <div className="d-flex ms-lg-2 mt-2 mt-lg-0">
            <NavLink
              to="/prep"
              className="btn btn-light btn-sm fw-semibold text-primary px-3 shadow-sm rounded-pill"
              onClick={closeNav}
            >
              <i className="bi bi-plus-circle-fill me-1"></i> Start Prep
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}
