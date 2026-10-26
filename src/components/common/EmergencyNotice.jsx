import React, { useState } from 'react';

/**
 * EmergencyNotice.jsx
 * Cautious healthcare safety disclaimer.
 * Explicitly states that the software CANNOT diagnose or detect emergencies.
 */
export default function EmergencyNotice() {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <aside className="emergency-notice-wrapper" aria-label="Medical safety notice">
      <div className="container py-2">
        <div className="alert alert-warning mb-0 py-2 px-3 border-warning-subtle shadow-sm">
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <i className="bi bi-shield-exclamation text-danger fs-5 me-2" aria-hidden="true"></i>
              <span className="small text-dark fw-medium">
                <strong>Medical Notice:</strong> CareAssist AI is strictly an informational and appointment preparation tool. It does <em>not</em> provide medical diagnosis, clinical advice, or emergency triage.
              </span>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                type="button"
                className="btn btn-sm btn-outline-dark py-0 px-2 small"
                onClick={() => setShowDetails(!showDetails)}
                aria-expanded={showDetails}
                aria-controls="emergency-details-panel"
              >
                <i className={`bi bi-${showDetails ? 'chevron-up' : 'info-circle'} me-1`}></i>
                {showDetails ? 'Hide Emergency Guidance' : 'Emergency Guidance'}
              </button>
            </div>
          </div>

          {showDetails && (
            <div id="emergency-details-panel" className="mt-3 pt-2 border-top border-warning-subtle small">
              <div className="row g-3">
                <div className="col-md-8">
                  <p className="mb-1 text-danger fw-semibold">
                    <i className="bi bi-telephone-fill me-1"></i> Experiencing a potential medical emergency?
                  </p>
                  <p className="mb-2 text-secondary">
                    If you or someone around you is experiencing severe chest pain, sudden numbness, difficulty breathing, profuse bleeding, or sudden speech loss, immediately call <strong>911</strong> (or your local emergency services) or visit the nearest emergency department.
                  </p>
                  <p className="mb-0 text-muted fst-italic">
                    Software cannot detect, diagnose, or rule out medical emergencies. Never delay seeking professional emergency medical care because of information provided by this application.
                  </p>
                </div>
                <div className="col-md-4">
                  <div className="p-2 rounded bg-light border border-secondary-subtle">
                    <span className="fw-bold d-block mb-1 text-dark">Emergency Helplines</span>
                    <ul className="list-unstyled mb-0 text-secondary">
                      <li>• Emergency Services: <strong>911</strong></li>
                      <li>• Poison Control: <strong>1-800-222-1222</strong></li>
                      <li>• Suicide & Crisis Lifeline: <strong>988</strong></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
