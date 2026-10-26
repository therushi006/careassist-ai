import React, { useState } from 'react';
import { storageService } from '../../services/storageService';

export default function Step4SummaryReview({ data, updateData, onBack, onSaved, onStartNew }) {
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved' | 'error'
  const [statusMessage, setStatusMessage] = useState('');

  const symptoms = data.symptoms || {};
  const selectedQuestions = (data.questions || []).filter((q) => q.checked);

  // Handle Save / Update to localStorage
  const handleSaveSummary = () => {
    setSaveStatus('saving');

    const summaryPayload = {
      id: data.id || undefined,
      title: data.title?.trim() || data.chiefConcern?.trim() || 'Appointment Prep Sheet',
      visitType: data.visitType || 'General Consultation',
      chiefConcern: data.chiefConcern || '',
      doctorName: data.doctorName || '',
      targetDate: data.targetDate || '',
      symptoms: {
        description: symptoms.description || '',
        onset: symptoms.onset || '',
        severity: symptoms.severity || '',
        frequency: symptoms.frequency || '',
        triggers: symptoms.triggers || '',
        relievingFactors: symptoms.relievingFactors || '',
        impact: symptoms.impact || '',
      },
      questions: data.questions || [],
      goals: data.goals || [],
      notes: data.notes || '',
    };

    let result;
    if (data.id) {
      result = storageService.updatePrepSummary(data.id, summaryPayload);
    } else {
      result = storageService.addPrepSummary(summaryPayload);
    }

    if (result.success) {
      setSaveStatus('saved');
      setStatusMessage('Appointment preparation agenda saved successfully to your browser storage!');
      if (result.data?.id && !data.id) {
        updateData({ id: result.data.id });
      }
      if (onSaved) onSaved(result.data);
    } else {
      setSaveStatus('error');
      setStatusMessage(result.error || 'Failed to save summary.');
    }
  };

  // Trigger browser print dialog
  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      {/* Action Toolbar (Hidden during print) */}
      <div className="card border-0 shadow-sm app-card p-3 mb-4 no-print">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <span className="badge bg-success-subtle text-success border border-success-subtle me-2">
              <i className="bi bi-check2-circle me-1"></i> Agenda Ready
            </span>
            <span className="text-secondary small">
              Review your structured summary below. Save it for later or print to bring to the clinic.
            </span>
          </div>

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onBack}
            >
              <i className="bi bi-pencil me-1"></i> Edit Entries
            </button>
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={handlePrint}
            >
              <i className="bi bi-printer me-1"></i> Print / Save as PDF
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={handleSaveSummary}
              disabled={saveStatus === 'saving'}
            >
              <i className="bi bi-cloud-arrow-up me-1"></i>
              {data.id ? 'Update Saved Agenda' : 'Save to My Records'}
            </button>
          </div>
        </div>

        {/* Save Confirmation Alert */}
        {saveStatus === 'saved' && (
          <div className="alert alert-success py-2 px-3 small mt-3 mb-0 d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-check-circle-fill me-2"></i> {statusMessage}
            </span>
            <button
              type="button"
              className="btn-close btn-close-sm"
              onClick={() => setSaveStatus(null)}
              aria-label="Close"
            ></button>
          </div>
        )}

        {saveStatus === 'error' && (
          <div className="alert alert-danger py-2 px-3 small mt-3 mb-0">
            <i className="bi bi-exclamation-triangle-fill me-2"></i> {statusMessage}
          </div>
        )}
      </div>

      {/* Structured Preparation Sheet (Printable Document Card) */}
      <div className="card border-0 shadow-sm app-card p-4 p-md-5 printable-agenda">
        {/* Printable Document Header */}
        <div className="d-flex justify-content-between align-items-start border-bottom pb-3 mb-4">
          <div>
            <div className="d-flex align-items-center mb-1">
              <i className="bi bi-heart-pulse-fill text-primary fs-4 me-2"></i>
              <h3 className="fw-bold text-navy mb-0">
                CareAssist AI — Doctor Discussion Agenda
              </h3>
            </div>
            <p className="text-muted small mb-0">
              Patient-prepared clinical discussion summary & questions sheet
            </p>
          </div>
          <div className="text-end">
            <span className="badge bg-light text-dark border px-2 py-1 mb-1 d-inline-block">
              {data.visitType || 'General Consultation'}
            </span>
            <div className="small text-muted">
              Prepared: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Appointment Context Details */}
        <div className="row g-3 bg-light rounded-3 p-3 mb-4 border border-light-subtle">
          <div className="col-sm-4">
            <span className="text-muted small d-block">Doctor / Provider</span>
            <strong className="text-navy">{data.doctorName || 'Not specified'}</strong>
          </div>
          <div className="col-sm-4">
            <span className="text-muted small d-block">Target Visit Date</span>
            <strong className="text-navy">{data.targetDate || 'Not specified'}</strong>
          </div>
          <div className="col-sm-4">
            <span className="text-muted small d-block">Visit Type</span>
            <strong className="text-navy">{data.visitType || 'General Consultation'}</strong>
          </div>
        </div>

        {/* Section 1: Chief Concern */}
        <div className="mb-4">
          <h5 className="fw-bold text-navy border-bottom pb-2 mb-2 d-flex align-items-center">
            <i className="bi bi-exclamation-circle text-primary me-2"></i>
            1. Chief Health Concern
          </h5>
          <div className="p-3 bg-soft-blue rounded-3 border border-light-subtle">
            <p className="mb-0 text-dark fw-medium fs-6">
              {data.chiefConcern || 'No chief concern documented.'}
            </p>
          </div>
        </div>

        {/* Section 2: Symptom History & Impact */}
        <div className="mb-4">
          <h5 className="fw-bold text-navy border-bottom pb-2 mb-2 d-flex align-items-center">
            <i className="bi bi-activity text-primary me-2"></i>
            2. Reported Symptom History & Timeline
          </h5>

          <div className="mb-3">
            <span className="text-muted small d-block">Symptom Description:</span>
            <p className="text-dark mb-0">
              {symptoms.description || 'Not provided.'}
            </p>
          </div>

          <div className="row g-2 mb-3">
            <div className="col-sm-6 col-md-3">
              <div className="p-2 border rounded bg-light">
                <span className="text-muted small d-block">Duration / Onset</span>
                <span className="fw-semibold text-dark small">{symptoms.onset || 'Not specified'}</span>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-2 border rounded bg-light">
                <span className="text-muted small d-block">Frequency</span>
                <span className="fw-semibold text-dark small">{symptoms.frequency || 'Not specified'}</span>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-2 border rounded bg-light">
                <span className="text-muted small d-block">Severity Level</span>
                <span className="fw-semibold text-dark small">{symptoms.severity || 'Not specified'}</span>
              </div>
            </div>
            <div className="col-sm-6 col-md-3">
              <div className="p-2 border rounded bg-light">
                <span className="text-muted small d-block">Daily Life Impact</span>
                <span className="fw-semibold text-dark small">{symptoms.impact || 'None noted'}</span>
              </div>
            </div>
          </div>

          {(symptoms.triggers || symptoms.relievingFactors) && (
            <div className="row g-2">
              {symptoms.triggers && (
                <div className="col-md-6">
                  <div className="p-2 border rounded">
                    <span className="text-muted small d-block">Observed Triggers:</span>
                    <span className="text-dark small">{symptoms.triggers}</span>
                  </div>
                </div>
              )}
              {symptoms.relievingFactors && (
                <div className="col-md-6">
                  <div className="p-2 border rounded">
                    <span className="text-muted small d-block">Relieving Factors:</span>
                    <span className="text-dark small">{symptoms.relievingFactors}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Section 3: Patient Visit Goals */}
        {(data.goals || []).length > 0 && (
          <div className="mb-4">
            <h5 className="fw-bold text-navy border-bottom pb-2 mb-2 d-flex align-items-center">
              <i className="bi bi-bullseye text-primary me-2"></i>
              3. Patient Visit Goals
            </h5>
            <ul className="list-group list-group-flush mb-0">
              {data.goals.map((goal, idx) => (
                <li key={idx} className="list-group-item px-0 py-1 border-0 small text-dark d-flex align-items-center">
                  <i className="bi bi-check2 text-primary me-2 fw-bold"></i>
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Section 4: Prioritized Doctor Questions */}
        <div className="mb-4">
          <h5 className="fw-bold text-navy border-bottom pb-2 mb-2 d-flex align-items-center">
            <i className="bi bi-chat-left-text text-primary me-2"></i>
            4. Prioritized Questions for the Doctor
          </h5>

          {selectedQuestions.length === 0 ? (
            <p className="text-muted small fst-italic">No questions were checked for this summary sheet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-sm align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: '40px' }} className="text-center">#</th>
                    <th>Question</th>
                    <th style={{ width: '180px' }}>Topic</th>
                    <th style={{ width: '90px' }} className="text-center">Discussed</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedQuestions.map((q, idx) => (
                    <tr key={q.id}>
                      <td className="text-center text-muted small">{idx + 1}</td>
                      <td className="small text-dark fw-medium">{q.text}</td>
                      <td>
                        <span className="badge bg-light text-secondary border small">
                          {q.category}
                        </span>
                      </td>
                      <td className="text-center">
                        <div
                          className="border border-secondary rounded mx-auto"
                          style={{ width: '18px', height: '18px' }}
                        ></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Section 5: Doctor Notes & Action Items (Designated handwritten section) */}
        <div className="mb-3">
          <h5 className="fw-bold text-navy border-bottom pb-2 mb-2 d-flex align-items-center">
            <i className="bi bi-pen text-primary me-2"></i>
            5. Clinical Discussion Notes & Doctor's Instructions
          </h5>
          <div
            className="p-3 border rounded bg-white"
            style={{ minHeight: '120px' }}
          >
            <p className="text-muted small fst-italic mb-2">
              (Use this section during your visit to jot down doctor recommendations, prescribed medications, follow-up dates, or test orders)
            </p>
            {/* Ruled lines for handwritten notes when printed */}
            <div className="ruled-line border-bottom border-light-subtle my-3"></div>
            <div className="ruled-line border-bottom border-light-subtle my-3"></div>
            <div className="ruled-line border-bottom border-light-subtle my-3"></div>
          </div>
        </div>

        {/* Clinical Disclaimer Footer on Document */}
        <div className="pt-3 border-top text-muted small fst-italic">
          <strong>Notice:</strong> This document was prepared by the patient using CareAssist AI to organize symptoms and communication points. It contains self-reported information and does not constitute a clinical diagnosis, physician evaluation, or medical prescription.
        </div>
      </div>

      {/* Bottom Action Footer (Hidden during print) */}
      <div className="d-flex justify-content-between align-items-center mt-4 no-print">
        <button type="button" className="btn btn-outline-secondary" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i> Edit Questions
        </button>
        <div className="d-flex gap-2">
          {onStartNew && (
            <button type="button" className="btn btn-outline-dark" onClick={onStartNew}>
              <i className="bi bi-plus-circle me-1"></i> Start New Prep
            </button>
          )}
          <button type="button" className="btn btn-outline-primary" onClick={handlePrint}>
            <i className="bi bi-printer me-1"></i> Print Summary
          </button>
          <button type="button" className="btn btn-primary px-4" onClick={handleSaveSummary}>
            <i className="bi bi-check2-circle me-1"></i> {data.id ? 'Save Changes' : 'Save Agenda'}
          </button>
        </div>
      </div>
    </div>
  );
}
