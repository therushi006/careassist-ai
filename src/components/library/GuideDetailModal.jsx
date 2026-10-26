import React from 'react';

export default function GuideDetailModal({ guide, isOpen, onClose }) {
  if (!isOpen || !guide) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable" role="document">
        <div className="modal-content border-0 shadow-lg app-card">
          {/* Header */}
          <div className="modal-header bg-light border-bottom border-light-subtle">
            <div>
              <div className="d-flex align-items-center gap-2 mb-1">
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle small">
                  {guide.category}
                </span>
                <span className="badge bg-light text-secondary border small">
                  {guide.readTime}
                </span>
                <span className="badge bg-warning-subtle text-dark border border-warning-subtle small">
                  {guide.reviewStatus || 'Not Clinically Reviewed'}
                </span>
              </div>
              <h4 className="modal-title fw-bold text-navy">{guide.title}</h4>
            </div>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body p-4">
            {/* Summary */}
            <div className="p-3 bg-soft-blue rounded-3 border border-light-subtle mb-4">
              <strong className="text-primary small d-block mb-1">Summary Overview:</strong>
              <p className="text-dark small mb-0">{guide.summary}</p>
            </div>

            {/* Detailed Content */}
            {guide.detailedContent && (
              <div className="mb-4">
                <h5 className="fw-bold text-navy mb-2">Guide Details</h5>
                <div
                  className="small text-secondary"
                  style={{ whiteSpace: 'pre-line', lineHeight: '1.6' }}
                >
                  {guide.detailedContent}
                </div>
              </div>
            )}

            {/* Key Action Points */}
            {Array.isArray(guide.keyPoints) && guide.keyPoints.length > 0 && (
              <div className="mb-4">
                <h5 className="fw-bold text-navy mb-2 d-flex align-items-center">
                  <i className="bi bi-check2-circle text-success me-2"></i> Key Preparation Steps
                </h5>
                <ul className="list-group list-group-flush border rounded-3 p-2 bg-light">
                  {guide.keyPoints.map((point, idx) => (
                    <li key={idx} className="list-group-item bg-transparent border-0 small py-2 d-flex align-items-start">
                      <i className="bi bi-arrow-right-circle-fill text-primary me-2 mt-1"></i>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Discussion Checklist for Doctor Visit */}
            {Array.isArray(guide.discussionChecklist) && guide.discussionChecklist.length > 0 && (
              <div className="mb-3">
                <h5 className="fw-bold text-navy mb-2 d-flex align-items-center">
                  <i className="bi bi-chat-left-dots text-primary me-2"></i> Recommended Doctor Questions
                </h5>
                <div className="p-3 border rounded-3 bg-white">
                  <ul className="list-unstyled mb-0 small text-secondary">
                    {guide.discussionChecklist.map((q, idx) => (
                      <li key={idx} className="mb-2 d-flex align-items-center">
                        <i className="bi bi-question-circle text-primary me-2"></i>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* Metadata & Transparency Notice */}
            <div className="pt-3 border-top text-muted small">
              <div className="d-flex justify-content-between flex-wrap gap-2">
                <span>
                  <strong>Source:</strong> {guide.source || 'General Healthcare Literacy Resource'}
                </span>
                <span>
                  <strong>Clinical Status:</strong> {guide.reviewStatus || 'Educational Draft (Not Clinically Reviewed)'}
                </span>
              </div>
              <p className="mt-2 mb-0 fst-italic" style={{ fontSize: '0.78rem' }}>
                Disclaimer: This material is for general patient education and visit preparation only. It does not replace clinical consultation, diagnosis, or personalized medical care.
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer bg-light border-top border-light-subtle">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              <i className="bi bi-arrow-left me-1"></i> Back to Library
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
