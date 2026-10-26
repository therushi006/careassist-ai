import React, { useState, useEffect } from 'react';
import { storageService } from '../../services/storageService';

const SUGGESTED_TAGS = [
  'General Discussion',
  'Prescription & Medication',
  'Lab / Blood Test',
  'Imaging / Radiology',
  'Specialist Referral',
  'Diet & Lifestyle',
  'Follow-up Needed',
];

export default function NoteModal({ isOpen, onClose, onSave, editingNote, defaultAppointmentId }) {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    doctorName: '',
    appointmentId: '',
    content: '',
    instructions: '',
    tags: [],
    actionItems: [],
  });

  const [customTag, setCustomTag] = useState('');
  const [newActionItem, setNewActionItem] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      const allAppointments = storageService.getAppointments();
      setAppointments(allAppointments);

      if (editingNote) {
        setFormData({
          title: editingNote.title || '',
          date: editingNote.date || new Date().toISOString().split('T')[0],
          doctorName: editingNote.doctorName || '',
          appointmentId: editingNote.appointmentId || '',
          content: editingNote.content || '',
          instructions: editingNote.instructions || '',
          tags: Array.isArray(editingNote.tags) ? editingNote.tags : [],
          actionItems: Array.isArray(editingNote.actionItems) ? editingNote.actionItems : [],
        });
      } else {
        // Pre-fill doctor name if defaultAppointmentId is provided
        let prefilledDoctor = '';
        if (defaultAppointmentId) {
          const matched = allAppointments.find((a) => a.id === defaultAppointmentId);
          if (matched) {
            prefilledDoctor = matched.doctorName || '';
          }
        }

        setFormData({
          title: '',
          date: new Date().toISOString().split('T')[0],
          doctorName: prefilledDoctor,
          appointmentId: defaultAppointmentId || '',
          content: '',
          instructions: '',
          tags: ['General Discussion'],
          actionItems: [],
        });
      }
      setErrors({});
      setCustomTag('');
      setNewActionItem('');
    }
  }, [isOpen, editingNote, defaultAppointmentId]);

  if (!isOpen) return null;

  const handleTagToggle = (tag) => {
    const current = formData.tags || [];
    if (current.includes(tag)) {
      setFormData({ ...formData, tags: current.filter((t) => t !== tag) });
    } else {
      setFormData({ ...formData, tags: [...current, tag] });
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    if (customTag.trim()) {
      const current = formData.tags || [];
      if (!current.includes(customTag.trim())) {
        setFormData({ ...formData, tags: [...current, customTag.trim()] });
      }
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    const current = formData.tags || [];
    setFormData({ ...formData, tags: current.filter((t) => t !== tagToRemove) });
  };

  const handleAddActionItem = (e) => {
    e.preventDefault();
    if (newActionItem.trim()) {
      const current = formData.actionItems || [];
      setFormData({ ...formData, actionItems: [...current, newActionItem.trim()] });
      setNewActionItem('');
    }
  };

  const handleRemoveActionItem = (index) => {
    const current = [...(formData.actionItems || [])];
    current.splice(index, 1);
    setFormData({ ...formData, actionItems: current });
  };

  const handleAppointmentSelect = (e) => {
    const aptId = e.target.value;
    let docName = formData.doctorName;
    if (aptId) {
      const matched = appointments.find((a) => a.id === aptId);
      if (matched && matched.doctorName) {
        docName = matched.doctorName;
      }
    }
    setFormData({
      ...formData,
      appointmentId: aptId,
      doctorName: docName,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Note title or summary topic is required.';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Main discussion points are required.';
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
              <i className="bi bi-journal-text text-warning me-2"></i>
              {editingNote ? 'Edit Visit Note' : 'Record New Doctor Visit Note'}
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
              {/* Note Title */}
              <div className="mb-3">
                <label htmlFor="noteTitleInput" className="form-label fw-semibold text-navy small">
                  Note Title / Chief Topic <span className="text-danger">*</span>
                </label>
                <input
                  id="noteTitleInput"
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  placeholder="e.g. Cardiology Follow-Up — Blood Pressure & Medication Check"
                  value={formData.title}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    if (errors.title) setErrors({ ...errors, title: null });
                  }}
                  autoFocus
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>

              {/* Date, Doctor Name & Linked Appointment */}
              <div className="row g-3 mb-3">
                <div className="col-md-4">
                  <label htmlFor="noteDateInput" className="form-label fw-semibold text-navy small">
                    Visit Date
                  </label>
                  <input
                    id="noteDateInput"
                    type="date"
                    className="form-control"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>

                <div className="col-md-4">
                  <label htmlFor="noteDoctorInput" className="form-label fw-semibold text-navy small">
                    Provider / Doctor Name
                  </label>
                  <input
                    id="noteDoctorInput"
                    type="text"
                    className="form-control"
                    placeholder="e.g. Dr. Sarah Mitchell"
                    value={formData.doctorName}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                  />
                </div>

                <div className="col-md-4">
                  <label htmlFor="noteAppointmentSelect" className="form-label fw-semibold text-navy small">
                    Link to Appointment <span className="text-muted fw-normal">(Optional)</span>
                  </label>
                  <select
                    id="noteAppointmentSelect"
                    className="form-select"
                    value={formData.appointmentId}
                    onChange={handleAppointmentSelect}
                  >
                    <option value="">No linked appointment</option>
                    {appointments.map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {apt.doctorName} ({apt.date || 'No date'})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Main Discussion Points (REQUIRED) */}
              <div className="mb-3">
                <label htmlFor="noteContentTextarea" className="form-label fw-semibold text-navy small">
                  Main Discussion Points & Doctor Findings <span className="text-danger">*</span>
                </label>
                <textarea
                  id="noteContentTextarea"
                  rows="4"
                  className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                  placeholder="e.g. Doctor reviewed blood pressure log. Target is 120/80. Advised that heart rhythm is normal, but stressed reducing daily dietary sodium intake..."
                  value={formData.content}
                  onChange={(e) => {
                    setFormData({ ...formData, content: e.target.value });
                    if (errors.content) setErrors({ ...errors, content: null });
                  }}
                ></textarea>
                {errors.content ? (
                  <div className="invalid-feedback">{errors.content}</div>
                ) : (
                  <div className="form-text small">
                    Log what the doctor explained, diagnostic reasoning discussed, or symptoms reviewed.
                  </div>
                )}
              </div>

              {/* Doctor's Instructions (Entered by User) */}
              <div className="mb-3">
                <label htmlFor="noteInstructionsTextarea" className="form-label fw-semibold text-navy small">
                  Doctor's Instructions & Care Guidance <span className="text-muted fw-normal">(As noted by patient)</span>
                </label>
                <textarea
                  id="noteInstructionsTextarea"
                  rows="3"
                  className="form-control"
                  placeholder="e.g. Continue taking lisinopril 10mg every morning with water. Log blood pressure twice weekly. Call office if top number exceeds 140 for 3 consecutive days..."
                  value={formData.instructions}
                  onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                ></textarea>
              </div>

              {/* Tags / Categories */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-navy small d-block mb-1">
                  Tags & Categories
                </label>
                <div className="d-flex flex-wrap gap-1 mb-2">
                  {SUGGESTED_TAGS.map((tag) => {
                    const isSelected = (formData.tags || []).includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        className={`btn btn-sm ${
                          isSelected ? 'btn-primary' : 'btn-outline-secondary'
                        } rounded-pill py-0 px-2 small`}
                        onClick={() => handleTagToggle(tag)}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>

                <div className="input-group input-group-sm" style={{ maxWidth: '320px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Add custom tag..."
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCustomTag(e);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleAddCustomTag}
                    disabled={!customTag.trim()}
                  >
                    Add Tag
                  </button>
                </div>

                {(formData.tags || []).length > 0 && (
                  <div className="mt-2">
                    {(formData.tags || []).map((t, idx) => (
                      <span key={idx} className="badge bg-light text-dark border me-1">
                        {t}{' '}
                        <i
                          className="bi bi-x text-danger ms-1"
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleRemoveTag(t)}
                          title="Remove tag"
                        ></i>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Follow-up Tasks / Action Items Checklist */}
              <div className="mb-3">
                <label className="form-label fw-semibold text-navy small d-block mb-1">
                  Follow-up Tasks & Action Items
                </label>
                <div className="input-group input-group-sm mb-2" style={{ maxWidth: '480px' }}>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="e.g. Schedule lipid panel for May 15..."
                    value={newActionItem}
                    onChange={(e) => setNewActionItem(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddActionItem(e);
                    }}
                  />
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleAddActionItem}
                    disabled={!newActionItem.trim()}
                  >
                    Add Task
                  </button>
                </div>

                {(formData.actionItems || []).length > 0 && (
                  <ul className="list-group list-group-flush border rounded p-2">
                    {formData.actionItems.map((task, idx) => (
                      <li
                        key={idx}
                        className="list-group-item d-flex justify-content-between align-items-center py-1 px-2 border-0 small"
                      >
                        <span>
                          <i className="bi bi-check2-square text-primary me-2"></i>
                          {task}
                        </span>
                        <button
                          type="button"
                          className="btn btn-link text-danger p-0"
                          onClick={() => handleRemoveActionItem(idx)}
                          title="Delete action item"
                        >
                          <i className="bi bi-x-circle small"></i>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Non-Diagnostic Disclaimer Note */}
              <div className="alert alert-warning py-2 px-3 small border-warning-subtle mb-0">
                <i className="bi bi-shield-exclamation text-danger me-1"></i>
                <strong>Notice:</strong> These are patient-entered personal records intended to assist memory and follow-up. They are not certified Electronic Health Records (EHR) and have not been validated by healthcare providers.
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer bg-light border-top border-light-subtle">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                <i className="bi bi-check2 me-1"></i>
                {editingNote ? 'Save Changes' : 'Save Note'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
