import React from 'react';
import { Link } from 'react-router-dom';

/**
 * PlaceholderPage.jsx
 * Provides a clean placeholder for pages scheduled in upcoming phases,
 * ensuring all navigation links work seamlessly without dead ends.
 */
export default function PlaceholderPage({ title, icon, phase, description, actionText, actionLink }) {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 text-center">
          <div className="card border-0 shadow-sm p-4 p-md-5 app-card">
            <div className="display-4 text-primary mb-3">
              <i className={`bi ${icon || 'bi-gear-wide-connected'}`}></i>
            </div>
            <span className="badge bg-primary-subtle text-primary border border-primary-subtle mx-auto px-3 py-1 mb-3">
              {phase || 'Upcoming Phase'}
            </span>
            <h2 className="fw-bold text-navy mb-2">{title}</h2>
            <p className="text-secondary mb-4">
              {description || 'This feature is part of the step-by-step phased development roadmap and will be activated in the upcoming phase.'}
            </p>
            <div className="d-flex justify-content-center gap-2">
              <Link to="/" className="btn btn-primary px-4">
                <i className="bi bi-arrow-left me-1"></i> Back to Dashboard
              </Link>
              {actionText && actionLink && (
                <Link to={actionLink} className="btn btn-outline-secondary px-3">
                  {actionText}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
