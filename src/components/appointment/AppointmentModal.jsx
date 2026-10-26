import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';

const COMMON_SPECIALTIES = [
  'General Practice / Primary Care',
  'Cardiology',
  'Dermatology',
  'Endocrinology',
  'Gastroenterology',
  'Neurology',
  'Orthopedics',
  'Ophthalmology',
  'Pulmonology',
  'Psychiatry / Mental Health',
  'Other Specialty',
];

const VISIT_TYPES = [
  'General Consultation',
  'Annual Physical Checkup',
  'Follow-up Visit',
  'Lab / Imaging Review',
  'Prescription Refill Consultation',
  'Urgent Non-Emergency Care',
];

export default function AppointmentModal({ isOpen, onClose, onSave, editingAppointment }) {
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: 'General Practice / Primary Care',
    visitType: 'General Consultation',
    date: '',
    time: '',
    location: '',
    reason: '',
    notes: '',
    status: 'scheduled',
    prepSummaryId: '',
  });

  const [availablePrepSummaries, setAvailablePrepSummaries] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setAvailablePrepSummaries(storageService.getPrepSummaries());
      if (editingAppointment) {
        setFormData({
          doctorName: editingAppointment.doctorName || '',
          specialty: editingAppointment.specialty || 'General Practice / Primary Care',
          visitType: editingAppointment.visitType || 'General Consultation',
          date: editingAppointment.date || '',
          time: editingAppointment.time || '',
          location: editingAppointment.location || '',
          reason: editingAppointment.reason || '',
          notes: editingAppointment.notes || '',
          status: editingAppointment.status || 'scheduled',
          prepSummaryId: editingAppointment.prepSummaryId || '',
        });
      } else {
        setFormData({
          doctorName: '',
          specialty: 'General Practice / Primary Care',
          visitType: 'General Consultation',
          date: '',
          time: '',
          location: '',
          reason: '',
          notes: '',
          status: 'scheduled',
          prepSummaryId: '',
        });
      }
      setErrors({});
    }
  }, [isOpen, editingAppointment]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Provider or doctor name is required.';
    }

    if (formData.date) {
      const parsed = new Date(formData.date);
      if (isNaN(parsed.getTime())) {
        newErrors.date = 'Please provide a valid date.';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
  };

  return (
    <div
      className="modal show d-block"
      tabIndex="-1"
      role="dialog"
      aria-modal="true"
      style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(2px)' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div className="modal-content border-0 shadow-lg app-card">
          {/* Header */}
          <div className="modal-header bg-light border-bottom border-light-subtle">
            <h5 className="modal-title fw-bold text-navy">
              <i className="bi bi-calendar-plus text-primary me-2"></i>
              {editingAppointment ? 'Edit Appointment Details' : 'Schedule New Appointment'}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              {/* Provider Name & Specialty */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="modalDoctorName" className="form-label fw-semibold text-navy small">
                    Healthcare Provider / Doctor <span className="text-danger">*</span>
                  </label>
                  <input
                    id="modalDoctorName"
                    type="text"
                    className={`form-control ${errors.doctorName ? 'is-invalid' : ''}`}
                    placeholder="e.g. Dr. Sarah Mitchell or Downtown Medical"
                    value={formData.doctorName}
                    onChange={(e) => {
                      setFormData({ ...formData, doctorName: e.target.value });
                      if (errors.doctorName) setErrors({ ...errors, doctorName: null });
                    }}
                    autoFocus
                  />
                  {errors.doctorName && (
                    <div className="invalid-feedback">{errors.doctorName}</div>
                  )}
                </div>

                <div className="col-md-6">
                  <label htmlFor="modalSpecialty" className="form-label fw-semibold text-navy small">
                    Department / Specialty
                  </label>
                  <select
                    id="modalSpecialty"
                    className="form-select"
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  >
                    {COMMON_SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Date, Time & Visit Type */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="modalDate" className="form-label fw-semibold text-navy small">
                    Appointment Date
                  </label>
                  <input
                    id="modalDate"
                    type="date"
                    className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                    value={formData.date}
                    onChange={(e) => {
                      setFormData({ ...formData, date: e.target.value });
                      if (errors.date) setErrors({ ...errors, date: null });
                    }}
                  />
                  {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                </div>

                <div className="col-md-4">
                  <label htmlFor="modalTime" className="form-label fw-semibold text-navy small">
                    Time
                  </label>
                  <input
                    id="modalTime"
                    type="time"
                    className="form-control"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>

                <div className="col-md-4">
                  <label htmlFor="modalVisitType" className="form-label fw-semibold text-navy small">
                    Visit Type
                  </label>
                  <select
                    id="modalVisitType"
                    className="form-select"
                    value={formData.visitType}
                    onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
                  >
                    {VISIT_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location or Telehealth Details */}
              <div className="mb-3">
                <label htmlFor="modalLocation" className="form-label fw-semibold text-navy small">
                  Location or Telehealth Details <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <input
                  id="modalLocation"
                  type="text"
                  className="form-control"
                  placeholder="e.g. Suite 400, 123 Healthcare Blvd OR Telehealth Video Link"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              {/* Purpose / Reason for Visit */}
              <div className="mb-3">
                <label htmlFor="modalReason" className="form-label fw-semibold text-navy small">
                  Purpose / Chief Reason for Visit <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <input
                  id="modalReason"
                  type="text"
                  className="form-control"
                  placeholder="e.g. 6-month blood pressure review and medication check"
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              {/* Status and Linked Prep Agenda */}
              <div className="row g-3 mb-3">
                <div className="col-md-6">
                  <label htmlFor="modalStatus" className="form-label fw-semibold text-navy small">
                    Appointment Status
                  </label>
                  <select
                    id="modalStatus"
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="scheduled">Scheduled / Upcoming</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label htmlFor="modalPrepLink" className="form-label fw-semibold text-navy small">
                    Link Preparation Agenda <span className="text-muted fw-normal">(Optional)</span>
                  </label>
                  <select
                    id="modalPrepLink"
                    className="form-select"
                    value={formData.prepSummaryId || ''}
                    onChange={(e) => setFormData({ ...formData, prepSummaryId: e.target.value })}
                  >
                    <option value="">No linked prep agenda</option>
                    {availablePrepSummaries.map((summary) => (
                      <option key={summary.id} value={summary.id}>
                        {summary.title || summary.chiefConcern || 'Prep Sheet'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div className="mb-2">
                <label htmlFor="modalNotes" className="form-label fw-semibold text-navy small">
                  Preparation Notes / Reminders <span className="text-muted fw-normal">(Optional)</span>
                </label>
                <textarea
                  id="modalNotes"
                  rows="2"
                  className="form-control"
                  placeholder="e.g. Bring fasting blood glucose log, arrive 15 mins early for paperwork..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                ></textarea>
              </div>

              <div className="form-text small text-muted">
                <i className="bi bi-shield-lock me-1 text-success"></i>
                Stored only in this browser's <code>localStorage</code>; zero external cloud transmission.
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="modal-footer bg-light border-top border-light-subtle">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onClose}
              >
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-check2 me-1"></i>
                {editingAppointment ? 'Save Changes' : 'Save Appointment'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
