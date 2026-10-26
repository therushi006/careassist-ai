import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import AppointmentModal from '../components/appointment/AppointmentModal';

export default function AppointmentManagerPage() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [filterTab, setFilterTab] = useState('all'); // 'all' | 'upcoming' | 'completed'
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    loadAppointments();

    const handleStorageUpdate = () => loadAppointments();
    window.addEventListener('careassist_storage_change', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('careassist_storage_change', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  const loadAppointments = () => {
    const list = storageService.getAppointments();
    setAppointments(list);
  };

  const handleOpenCreateModal = () => {
    setEditingAppointment(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (apt) => {
    setEditingAppointment(apt);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAppointment(null);
  };

  const handleSaveAppointment = (formData) => {
    let result;
    if (editingAppointment) {
      result = storageService.updateAppointment(editingAppointment.id, formData);
      if (result.success) {
        setAlertMessage({ type: 'success', text: 'Appointment updated successfully!' });
      }
    } else {
      result = storageService.addAppointment(formData);
      if (result.success) {
        setAlertMessage({ type: 'success', text: 'New appointment scheduled successfully!' });
      }
    }

    if (!result.success) {
      setAlertMessage({ type: 'danger', text: result.error || 'Failed to save appointment.' });
    } else {
      handleCloseModal();
      loadAppointments();
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  const handleDeleteAppointment = (id, doctorName) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the appointment with ${doctorName || 'this provider'}? This action cannot be undone.`
    );
    if (confirmed) {
      const result = storageService.deleteAppointment(id);
      if (result.success) {
        setAlertMessage({ type: 'info', text: 'Appointment removed from records.' });
        loadAppointments();
        setTimeout(() => setAlertMessage(null), 4000);
      }
    }
  };

  const handleToggleStatus = (apt) => {
    const newStatus = apt.status === 'completed' ? 'scheduled' : 'completed';
    storageService.updateAppointment(apt.id, { status: newStatus });
    loadAppointments();
  };

  // Helper date formatter
  const formatDate = (dateStr) => {
    if (!dateStr) return 'Date not specified';
    try {
      const d = new Date(dateStr);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter & Search Logic
  const filteredAppointments = appointments.filter((apt) => {
    // 1. Tab filter
    if (filterTab === 'upcoming') {
      const isScheduled = apt.status !== 'completed' && apt.status !== 'cancelled';
      const isFutureOrToday = !apt.date || apt.date >= todayStr;
      if (!isScheduled || !isFutureOrToday) return false;
    } else if (filterTab === 'completed') {
      if (apt.status !== 'completed') return false;
    }

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoctor = (apt.doctorName || '').toLowerCase().includes(q);
      const matchSpecialty = (apt.specialty || '').toLowerCase().includes(q);
      const matchReason = (apt.reason || '').toLowerCase().includes(q);
      const matchLocation = (apt.location || '').toLowerCase().includes(q);
      return matchDoctor || matchSpecialty || matchReason || matchLocation;
    }

    return true;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary text-white">Visit Management</span>
            <span className="badge-simulated px-2 py-1 rounded">Local Storage Only</span>
          </div>
          <h2 className="fw-bold text-navy mb-0">Appointment Manager</h2>
        </div>

        <button
          type="button"
          className="btn btn-primary px-3 shadow-sm"
          onClick={handleOpenCreateModal}
        >
          <i className="bi bi-calendar-plus me-1"></i> Schedule New Visit
        </button>
      </div>

      {/* Local Storage Informational Banner */}
      <div className="alert alert-light border border-light-subtle shadow-sm py-2 px-3 small d-flex align-items-center mb-4">
        <i className="bi bi-info-circle-fill text-primary fs-5 me-2 flex-shrink-0"></i>
        <span className="text-secondary">
          <strong>Privacy Note:</strong> All appointments are stored exclusively in your browser's local storage. Data is never transmitted to external cloud servers and is not automatically backed up if your browser cache is cleared.
        </span>
      </div>

      {/* Alert Notifications */}
      {alertMessage && (
        <div
          className={`alert alert-${alertMessage.type} alert-dismissible fade show py-2 px-3 small mb-4`}
          role="alert"
        >
          {alertMessage.text}
          <button
            type="button"
            className="btn-close btn-close-sm"
            onClick={() => setAlertMessage(null)}
            aria-label="Close"
          ></button>
        </div>
      )}

      {/* Controls: Filter Tabs & Search Bar */}
      <div className="card border-0 shadow-sm app-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Filter Tabs */}
          <div className="col-md-6">
            <div className="btn-group w-100" role="group" aria-label="Appointment filters">
              <button
                type="button"
                className={`btn btn-sm ${
                  filterTab === 'all' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setFilterTab('all')}
              >
                All ({appointments.length})
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  filterTab === 'upcoming' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setFilterTab('upcoming')}
              >
                Upcoming (
                {
                  appointments.filter(
                    (a) =>
                      a.status !== 'completed' &&
                      a.status !== 'cancelled' &&
                      (!a.date || a.date >= todayStr)
                  ).length
                }
                )
              </button>
              <button
                type="button"
                className={`btn btn-sm ${
                  filterTab === 'completed' ? 'btn-primary' : 'btn-outline-secondary'
                }`}
                onClick={() => setFilterTab('completed')}
              >
                Completed ({appointments.filter((a) => a.status === 'completed').length})
              </button>
            </div>
          </div>

          {/* Search Box */}
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search by doctor, specialty, reason, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Appointments List / Grid */}
      {filteredAppointments.length === 0 ? (
        /* Empty State */
        <div className="card border-0 shadow-sm app-card text-center py-5 px-3">
          <div className="p-3 bg-light rounded-circle d-inline-block mx-auto mb-3 text-secondary">
            <i className="bi bi-calendar-x fs-1"></i>
          </div>
          <h5 className="fw-bold text-navy mb-1">
            {searchQuery
              ? 'No Appointments Found'
              : filterTab === 'completed'
              ? 'No Completed Appointments'
              : 'No Scheduled Appointments Yet'}
          </h5>
          <p className="text-secondary small mb-3 mx-auto" style={{ maxWidth: '420px' }}>
            {searchQuery
              ? `No appointments matched "${searchQuery}". Try clearing your search query.`
              : 'Schedule your upcoming doctor visits, clinical consultations, or follow-ups to keep your healthcare agenda organized.'}
          </p>
          <div>
            {searchQuery ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => setSearchQuery('')}
              >
                Clear Search Filter
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm px-4"
                onClick={handleOpenCreateModal}
              >
                <i className="bi bi-plus-lg me-1"></i> Schedule First Visit
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredAppointments.map((apt) => {
            const isCompleted = apt.status === 'completed';
            const isCancelled = apt.status === 'cancelled';

            return (
              <div key={apt.id} className="col-md-6 col-lg-4">
                <div
                  className={`card h-100 border-0 shadow-sm app-card ${
                    isCompleted ? 'bg-light border-start border-4 border-success' : 'border-start border-4 border-primary'
                  }`}
                >
                  <div className="card-body p-3 d-flex flex-column">
                    {/* Header: Specialty & Status */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span className="badge bg-primary-subtle text-primary small text-truncate" style={{ maxWidth: '65%' }}>
                        {apt.specialty || 'General Practice'}
                      </span>
                      <span
                        className={`badge ${
                          isCompleted
                            ? 'bg-success'
                            : isCancelled
                            ? 'bg-danger'
                            : 'bg-info text-dark'
                        }`}
                      >
                        {isCompleted ? 'Completed' : isCancelled ? 'Cancelled' : 'Upcoming'}
                      </span>
                    </div>

                    {/* Doctor Name */}
                    <h5 className="fw-bold text-navy mb-1">{apt.doctorName}</h5>
                    <div className="text-muted small mb-2">{apt.visitType || 'General Consultation'}</div>

                    {/* Date & Time */}
                    <div className="bg-light p-2 rounded mb-2 border border-light-subtle small">
                      <div className="d-flex align-items-center mb-1 text-dark">
                        <i className="bi bi-calendar3 me-2 text-primary"></i>
                        <span className="fw-medium">{formatDate(apt.date)}</span>
                      </div>
                      {apt.time && (
                        <div className="d-flex align-items-center text-secondary">
                          <i className="bi bi-clock me-2 text-primary"></i>
                          <span>{apt.time}</span>
                        </div>
                      )}
                      {apt.location && (
                        <div className="d-flex align-items-center text-secondary text-truncate mt-1">
                          <i className="bi bi-geo-alt me-2 text-primary"></i>
                          <span className="text-truncate">{apt.location}</span>
                        </div>
                      )}
                    </div>

                    {/* Purpose / Reason */}
                    {apt.reason && (
                      <p className="text-secondary small mb-2">
                        <strong>Reason:</strong> {apt.reason}
                      </p>
                    )}

                    {/* Preparation Notes */}
                    {apt.notes && (
                      <p className="text-muted small mb-2 fst-italic">
                        <i className="bi bi-sticky me-1"></i> {apt.notes}
                      </p>
                    )}

                    {/* Linked Prep Agenda Badge */}
                    {apt.prepSummaryId && (
                      <div className="mb-2">
                        <Link
                          to={`/prep?id=${apt.prepSummaryId}`}
                          className="badge bg-white text-primary border border-primary-subtle text-decoration-none small py-1 px-2"
                        >
                          <i className="bi bi-clipboard2-check me-1"></i> View Linked Prep Agenda
                        </Link>
                      </div>
                    )}

                    {/* Action Toolbar */}
                    <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className={`btn ${isCompleted ? 'btn-outline-secondary' : 'btn-outline-success'}`}
                          onClick={() => handleToggleStatus(apt)}
                          title={isCompleted ? 'Mark as Upcoming' : 'Mark as Completed'}
                        >
                          <i className={`bi bi-${isCompleted ? 'arrow-counterclockwise' : 'check2-all'}`}></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-primary"
                          onClick={() => handleOpenEditModal(apt)}
                          title="Edit details"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteAppointment(apt.id, apt.doctorName)}
                          title="Delete appointment"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>

                      {/* Add Visit Note Link */}
                      <Link
                        to={`/notes?appointmentId=${apt.id}`}
                        className="btn btn-sm btn-outline-warning text-dark"
                        title="Create or view visit notes for this appointment"
                      >
                        <i className="bi bi-journal-plus me-1"></i> Add Note
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Appointment Edit / Create Modal */}
      <AppointmentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveAppointment}
        editingAppointment={editingAppointment}
      />
    </div>
  );
}
