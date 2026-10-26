import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storageService';

export default function Dashboard() {
  const [metrics, setMetrics] = useState({
    totalAppointments: 0,
    upcomingAppointmentsCount: 0,
    totalNotes: 0,
    totalPrepSummaries: 0,
  });
  const [appointments, setAppointments] = useState([]);
  const [notes, setNotes] = useState([]);
  const [prepSummaries, setPrepSummaries] = useState([]);

  // Fetch actual data from storageService on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const loadedMetrics = storageService.getDashboardMetrics();
    const allAppointments = storageService.getAppointments();
    const allNotes = storageService.getNotes();
    const allPrep = storageService.getPrepSummaries();

    setMetrics(loadedMetrics);
    setAppointments(allAppointments);
    setNotes(allNotes);
    setPrepSummaries(allPrep);
  };

  // Format date helper
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="container py-4">
      {/* 1. Professional Welcome Header */}
      <div className="card border-0 shadow-sm mb-4 welcome-hero-card">
        <div className="card-body p-4 p-md-5">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-white text-primary fw-semibold px-3 py-1 shadow-sm">
                  <i className="bi bi-shield-check me-1"></i> Patient Empowerment Portal
                </span>
                <span className="badge-simulated px-2 py-1 rounded">
                  Privacy Protected • Local Storage
                </span>
              </div>
              <h1 className="fw-bold text-white mb-2">Welcome to CareAssist AI</h1>
              <p className="lead text-white-50 mb-4">
                Prepare for doctor visits, organize your medical questions, simplify complex health terms, and take confident control of your healthcare journey.
              </p>
              <div className="d-flex flex-wrap gap-2">
                <Link to="/prep" className="btn btn-light btn-lg fw-semibold text-primary shadow-sm px-4">
                  <i className="bi bi-clipboard2-check me-2"></i> Start Appointment Prep
                </Link>
                <Link to="/assistant" className="btn btn-outline-light btn-lg px-4">
                  <i className="bi bi-chat-heart me-2"></i> Open Health Assistant
                </Link>
              </div>
            </div>
            <div className="col-lg-4 d-none d-lg-block text-center">
              <div className="hero-icon-wrapper p-4 rounded-4 mx-auto">
                <i className="bi bi-hospital fs-1 text-white"></i>
                <div className="text-white mt-2 small fw-medium">Ready for Your Next Visit</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Summary Metric Cards (Actual localStorage Data) */}
      <div className="row g-3 mb-4">
        {/* Metric 1: Scheduled Visits */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 app-card">
            <div className="card-body d-flex align-items-center">
              <div className="metric-icon-box bg-primary-subtle text-primary rounded-3 me-3 p-3">
                <i className="bi bi-calendar2-check fs-4"></i>
              </div>
              <div>
                <span className="text-secondary small d-block">Upcoming Visits</span>
                <h3 className="fw-bold text-navy mb-0">{metrics.upcomingAppointmentsCount}</h3>
                <small className="text-muted">{metrics.totalAppointments} total recorded</small>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 2: Prep Summaries */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 app-card">
            <div className="card-body d-flex align-items-center">
              <div className="metric-icon-box bg-success-subtle text-success rounded-3 me-3 p-3">
                <i className="bi bi-file-earmark-medical fs-4"></i>
              </div>
              <div>
                <span className="text-secondary small d-block">Prep Guides</span>
                <h3 className="fw-bold text-navy mb-0">{metrics.totalPrepSummaries}</h3>
                <small className="text-muted">Doctor agendas created</small>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 3: Appointment Notes */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 app-card">
            <div className="card-body d-flex align-items-center">
              <div className="metric-icon-box bg-warning-subtle text-warning-emphasis rounded-3 me-3 p-3">
                <i className="bi bi-journal-text fs-4"></i>
              </div>
              <div>
                <span className="text-secondary small d-block">Visit Notes</span>
                <h3 className="fw-bold text-navy mb-0">{metrics.totalNotes}</h3>
                <small className="text-muted">Clinical records & follow-ups</small>
              </div>
            </div>
          </div>
        </div>

        {/* Metric 4: Health Literacy */}
        <div className="col-sm-6 col-lg-3">
          <div className="card border-0 shadow-sm h-100 app-card">
            <div className="card-body d-flex align-items-center">
              <div className="metric-icon-box bg-info-subtle text-info-emphasis rounded-3 me-3 p-3">
                <i className="bi bi-book-half fs-4"></i>
              </div>
              <div>
                <span className="text-secondary small d-block">Health Library</span>
                <h3 className="fw-bold text-navy mb-0">Active</h3>
                <small className="text-muted">Guides & jargon simplifier</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Quick Action Hub */}
      <div className="mb-4">
        <h5 className="fw-bold text-navy mb-3">
          <i className="bi bi-lightning-charge-fill text-warning me-2"></i> Quick Actions
        </h5>
        <div className="row g-3">
          <div className="col-md-6 col-lg-3">
            <Link to="/prep" className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 app-card quick-action-card p-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="p-2 rounded-circle bg-primary text-white me-2">
                    <i className="bi bi-clipboard2-plus"></i>
                  </div>
                  <h6 className="fw-bold text-navy mb-0">Start Prep</h6>
                </div>
                <p className="text-secondary small mb-0">
                  Structure your concerns, symptom timeline, and generate doctor questions.
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/assistant" className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 app-card quick-action-card p-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="p-2 rounded-circle bg-info text-white me-2">
                    <i className="bi bi-chat-dots-fill"></i>
                  </div>
                  <h6 className="fw-bold text-navy mb-0">Open Assistant</h6>
                </div>
                <p className="text-secondary small mb-0">
                  Ask questions about visit workflows and test preparation (simulated demo).
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/notes" className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 app-card quick-action-card p-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="p-2 rounded-circle bg-warning text-white me-2">
                    <i className="bi bi-pencil-square"></i>
                  </div>
                  <h6 className="fw-bold text-navy mb-0">New Visit Note</h6>
                </div>
                <p className="text-secondary small mb-0">
                  Record doctor recommendations, follow-up tests, or medication notes.
                </p>
              </div>
            </Link>
          </div>

          <div className="col-md-6 col-lg-3">
            <Link to="/appointments" className="text-decoration-none">
              <div className="card border-0 shadow-sm h-100 app-card quick-action-card p-3">
                <div className="d-flex align-items-center mb-2">
                  <div className="p-2 rounded-circle bg-success text-white me-2">
                    <i className="bi bi-calendar-plus-fill"></i>
                  </div>
                  <h6 className="fw-bold text-navy mb-0">Schedule Visit</h6>
                </div>
                <p className="text-secondary small mb-0">
                  Add an upcoming doctor appointment and link preparation checklists.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 4. Two-Column Workspace: Upcoming Appointments & Recent Notes */}
      <div className="row g-4 mb-4">
        {/* Left Column: Upcoming Appointments */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 app-card">
            <div className="card-header bg-white border-0 pt-3 pb-2 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-navy mb-0">
                <i className="bi bi-calendar-week me-2 text-primary"></i> Upcoming Appointments
              </h5>
              <Link to="/appointments" className="btn btn-sm btn-outline-primary">
                View All
              </Link>
            </div>
            <div className="card-body p-3">
              {appointments.length === 0 ? (
                /* Useful Empty State (No Fake Records) */
                <div className="text-center py-4 px-3 bg-light rounded-3 border border-dashed">
                  <div className="p-3 bg-white rounded-circle shadow-sm d-inline-block mb-3 text-secondary">
                    <i className="bi bi-calendar-x fs-2"></i>
                  </div>
                  <h6 className="fw-bold text-navy mb-1">No Upcoming Appointments</h6>
                  <p className="text-secondary small mb-3">
                    You have not scheduled any doctor visits yet. Add your upcoming consultation to keep your prep organized.
                  </p>
                  <Link to="/appointments" className="btn btn-sm btn-primary">
                    <i className="bi bi-plus-lg me-1"></i> Schedule First Visit
                  </Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {appointments.slice(0, 3).map((app) => (
                    <div key={app.id} className="list-group-item px-0 py-3 border-light-subtle">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h6 className="fw-bold text-navy mb-1">{app.doctorName || 'Doctor Visit'}</h6>
                          <span className="badge bg-primary-subtle text-primary me-2">
                            {app.specialty || 'General Practice'}
                          </span>
                          <span className="text-secondary small">
                            <i className="bi bi-clock me-1"></i> {app.time || 'Time not set'}
                          </span>
                        </div>
                        <span className="badge bg-light text-dark border">
                          {formatDate(app.date)}
                        </span>
                      </div>
                      {app.reason && (
                        <p className="text-secondary small mt-2 mb-0">
                          <strong>Reason:</strong> {app.reason}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Visit Notes */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm h-100 app-card">
            <div className="card-header bg-white border-0 pt-3 pb-2 d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-navy mb-0">
                <i className="bi bi-journal-check me-2 text-warning"></i> Recent Notes & Summaries
              </h5>
              <Link to="/notes" className="btn btn-sm btn-outline-secondary">
                View All
              </Link>
            </div>
            <div className="card-body p-3">
              {notes.length === 0 && prepSummaries.length === 0 ? (
                /* Useful Empty State (No Fake Records) */
                <div className="text-center py-4 px-3 bg-light rounded-3 border border-dashed">
                  <div className="p-3 bg-white rounded-circle shadow-sm d-inline-block mb-3 text-secondary">
                    <i className="bi bi-journal-x fs-2"></i>
                  </div>
                  <h6 className="fw-bold text-navy mb-1">No Notes or Prep Sheets Yet</h6>
                  <p className="text-secondary small mb-3">
                    Start by generating an appointment preparation sheet or log key discussions from past visits.
                  </p>
                  <div className="d-flex justify-content-center gap-2">
                    <Link to="/prep" className="btn btn-sm btn-primary">
                      <i className="bi bi-clipboard2-plus me-1"></i> Start Prep
                    </Link>
                    <Link to="/notes" className="btn btn-sm btn-outline-secondary">
                      <i className="bi bi-pencil me-1"></i> Add Note
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {notes.slice(0, 3).map((note) => (
                    <div key={note.id} className="list-group-item px-0 py-3 border-light-subtle">
                      <div className="d-flex justify-content-between align-items-start">
                        <h6 className="fw-bold text-navy mb-1">{note.title || 'Untitled Note'}</h6>
                        <span className="text-muted small">{formatDate(note.updatedAt || note.createdAt)}</span>
                      </div>
                      <p className="text-secondary small mb-1 text-truncate" style={{ maxHeight: '2.4rem' }}>
                        {note.content || 'No content recorded.'}
                      </p>
                      <div className="d-flex gap-2">
                        {note.tags && note.tags.map((t, i) => (
                          <span key={i} className="badge bg-light text-secondary border small">{t}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Patient Empowerment Guidance Banner */}
      <div className="card border-0 bg-soft-blue shadow-sm p-4">
        <div className="d-flex align-items-start gap-3">
          <div className="p-2 rounded bg-primary text-white mt-1">
            <i className="bi bi-lightbulb-fill fs-5"></i>
          </div>
          <div>
            <h6 className="fw-bold text-navy mb-1">How to Get the Most Out of Your Next Doctor's Appointment</h6>
            <p className="text-secondary small mb-2">
              Patients who bring organized question lists and clear symptom timelines report 40% higher clarity and lower post-visit anxiety. Use our <strong>Appointment Prep</strong> tool before heading into the clinic.
            </p>
            <Link to="/prep" className="btn btn-sm btn-primary">
              Build My Appointment Agenda <i className="bi bi-arrow-right ms-1"></i>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
