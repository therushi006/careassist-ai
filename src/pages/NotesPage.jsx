import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { storageService } from '../services/storageService';
import NoteModal from '../components/notes/NoteModal';

export default function NotesPage() {
  const [searchParams] = useSearchParams();
  const appointmentIdFromUrl = searchParams.get('appointmentId');

  const [notes, setNotes] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTagFilter, setSelectedTagFilter] = useState('all');
  const [selectedAppointmentFilter, setSelectedAppointmentFilter] = useState(appointmentIdFromUrl || 'all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);

  useEffect(() => {
    loadData();

    const handleStorageUpdate = () => loadData();
    window.addEventListener('careassist_storage_change', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('careassist_storage_change', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, []);

  useEffect(() => {
    if (appointmentIdFromUrl) {
      setSelectedAppointmentFilter(appointmentIdFromUrl);
    }
  }, [appointmentIdFromUrl]);

  const loadData = () => {
    const allNotes = storageService.getNotes();
    const allAppointments = storageService.getAppointments();
    setNotes(allNotes);
    setAppointments(allAppointments);
  };

  const handleOpenCreateModal = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingNote(null);
  };

  const handleSaveNote = (formData) => {
    let result;
    if (editingNote) {
      result = storageService.updateNote(editingNote.id, formData);
      if (result.success) {
        setAlertMessage({ type: 'success', text: 'Visit note updated successfully!' });
      }
    } else {
      result = storageService.addNote(formData);
      if (result.success) {
        setAlertMessage({ type: 'success', text: 'New visit note recorded successfully!' });
      }
    }

    if (!result.success) {
      setAlertMessage({ type: 'danger', text: result.error || 'Failed to save note.' });
    } else {
      handleCloseModal();
      loadData();
      setTimeout(() => setAlertMessage(null), 4000);
    }
  };

  const handleDeleteNote = (id, title) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete note "${title || 'this note'}"? This action cannot be undone.`
    );
    if (confirmed) {
      const result = storageService.deleteNote(id);
      if (result.success) {
        setAlertMessage({ type: 'info', text: 'Note removed from records.' });
        loadData();
        setTimeout(() => setAlertMessage(null), 4000);
      }
    }
  };

  // Extract all unique tags across notes for filtering
  const allUniqueTags = Array.from(
    new Set(notes.flatMap((n) => (Array.isArray(n.tags) ? n.tags : [])))
  ).filter(Boolean);

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

  // Find linked appointment name helper
  const getLinkedAppointmentInfo = (aptId) => {
    if (!aptId) return null;
    return appointments.find((a) => a.id === aptId) || null;
  };

  // Filter notes
  const filteredNotes = notes.filter((note) => {
    // 1. Tag filter
    if (selectedTagFilter !== 'all') {
      if (!Array.isArray(note.tags) || !note.tags.includes(selectedTagFilter)) {
        return false;
      }
    }

    // 2. Appointment filter
    if (selectedAppointmentFilter !== 'all') {
      if (note.appointmentId !== selectedAppointmentFilter) {
        return false;
      }
    }

    // 3. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (note.title || '').toLowerCase().includes(q);
      const matchContent = (note.content || '').toLowerCase().includes(q);
      const matchDoctor = (note.doctorName || '').toLowerCase().includes(q);
      const matchInstructions = (note.instructions || '').toLowerCase().includes(q);
      const matchTags = (note.tags || []).some((t) => t.toLowerCase().includes(q));
      return matchTitle || matchContent || matchDoctor || matchInstructions || matchTags;
    }

    return true;
  });

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-warning text-dark">Clinical Records Tracker</span>
            <span className="badge-simulated px-2 py-1 rounded">Local Storage Only</span>
          </div>
          <h2 className="fw-bold text-navy mb-0">Doctor Visit Notes</h2>
        </div>

        <button
          type="button"
          className="btn btn-warning text-dark fw-semibold px-3 shadow-sm"
          onClick={handleOpenCreateModal}
        >
          <i className="bi bi-pencil-square me-1"></i> New Visit Note
        </button>
      </div>

      {/* Local Storage & Non-EHR Safety Notice */}
      <div className="alert alert-light border border-light-subtle shadow-sm py-2 px-3 small d-flex align-items-center mb-4">
        <i className="bi bi-shield-check text-success fs-5 me-2 flex-shrink-0"></i>
        <span className="text-secondary">
          <strong>Patient Memory Record:</strong> Notes are self-reported clinical takeaways stored strictly in this browser's <code>localStorage</code>. They do not constitute official Electronic Health Records and are never shared without your manual export.
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

      {/* Search and Filters Bar */}
      <div className="card border-0 shadow-sm app-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          {/* Keyword Search */}
          <div className="col-md-5">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder="Search notes, discussion points, instructions, or tags..."
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

          {/* Tag Filter */}
          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={selectedTagFilter}
              onChange={(e) => setSelectedTagFilter(e.target.value)}
            >
              <option value="all">All Tags ({allUniqueTags.length})</option>
              {allUniqueTags.map((tag) => (
                <option key={tag} value={tag}>
                  Tag: {tag}
                </option>
              ))}
            </select>
          </div>

          {/* Linked Appointment Filter */}
          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={selectedAppointmentFilter}
              onChange={(e) => setSelectedAppointmentFilter(e.target.value)}
            >
              <option value="all">All Appointments</option>
              {appointments.map((apt) => (
                <option key={apt.id} value={apt.id}>
                  Visit: {apt.doctorName} ({apt.date || 'No date'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Clear Helper */}
        {(selectedTagFilter !== 'all' || selectedAppointmentFilter !== 'all' || searchQuery) && (
          <div className="mt-2 pt-2 border-top d-flex align-items-center justify-content-between small">
            <span className="text-muted">
              Showing <strong>{filteredNotes.length}</strong> of <strong>{notes.length}</strong> total notes
            </span>
            <button
              type="button"
              className="btn btn-link btn-sm text-primary p-0"
              onClick={() => {
                setSelectedTagFilter('all');
                setSelectedAppointmentFilter('all');
                setSearchQuery('');
              }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>

      {/* Notes List / Empty State */}
      {filteredNotes.length === 0 ? (
        <div className="card border-0 shadow-sm app-card text-center py-5 px-3">
          <div className="p-3 bg-light rounded-circle d-inline-block mx-auto mb-3 text-secondary">
            <i className="bi bi-journal-x fs-1"></i>
          </div>
          <h5 className="fw-bold text-navy mb-1">
            {searchQuery || selectedTagFilter !== 'all' || selectedAppointmentFilter !== 'all'
              ? 'No Notes Found'
              : 'No Visit Notes Recorded Yet'}
          </h5>
          <p className="text-secondary small mb-3 mx-auto" style={{ maxWidth: '420px' }}>
            {searchQuery || selectedTagFilter !== 'all' || selectedAppointmentFilter !== 'all'
              ? 'No notes matched your current filter criteria. Try resetting filters or searching for another keyword.'
              : 'Document your doctor discussions, clinical takeaways, medication instructions, and action items right after your visits.'}
          </p>
          <div>
            {searchQuery || selectedTagFilter !== 'all' || selectedAppointmentFilter !== 'all' ? (
              <button
                type="button"
                className="btn btn-sm btn-outline-secondary"
                onClick={() => {
                  setSelectedTagFilter('all');
                  setSelectedAppointmentFilter('all');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-warning text-dark fw-semibold btn-sm px-4"
                onClick={handleOpenCreateModal}
              >
                <i className="bi bi-pencil-square me-1"></i> Record Your First Note
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {filteredNotes.map((note) => {
            const linkedApt = getLinkedAppointmentInfo(note.appointmentId);

            return (
              <div key={note.id} className="col-lg-6">
                <div className="card border-0 shadow-sm h-100 app-card">
                  <div className="card-body p-4 d-flex flex-column">
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <span className="text-muted small d-block">
                          <i className="bi bi-calendar3 me-1 text-primary"></i>
                          {formatDate(note.date)}
                          {note.doctorName && (
                            <span className="ms-2">
                              • <i className="bi bi-person-circle me-1 text-secondary"></i>
                              {note.doctorName}
                            </span>
                          )}
                        </span>
                        <h5 className="fw-bold text-navy mt-1 mb-0">{note.title}</h5>
                      </div>

                      <div className="btn-group btn-group-sm">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => handleOpenEditModal(note)}
                          title="Edit note"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => handleDeleteNote(note.id, note.title)}
                          title="Delete note"
                        >
                          <i className="bi bi-trash3"></i>
                        </button>
                      </div>
                    </div>

                    {/* Linked Appointment Badge */}
                    {linkedApt && (
                      <div className="mb-3">
                        <Link
                          to="/appointments"
                          className="badge bg-light text-primary border text-decoration-none small"
                        >
                          <i className="bi bi-calendar-event me-1"></i> Linked Visit: {linkedApt.doctorName} ({linkedApt.date || 'Scheduled'})
                        </Link>
                      </div>
                    )}

                    {/* Main Discussion Content */}
                    <div className="mb-3">
                      <span className="fw-semibold text-navy small d-block mb-1">
                        Discussion Points & Findings:
                      </span>
                      <p className="text-dark small mb-0" style={{ whiteSpace: 'pre-line' }}>
                        {note.content}
                      </p>
                    </div>

                    {/* Doctor's Instructions Callout Box */}
                    {note.instructions && (
                      <div className="p-3 rounded-3 bg-soft-blue border border-light-subtle mb-3">
                        <span className="fw-bold text-primary small d-flex align-items-center mb-1">
                          <i className="bi bi-prescription2 fs-5 me-1"></i> Doctor's Instructions:
                        </span>
                        <p className="text-navy small mb-0" style={{ whiteSpace: 'pre-line' }}>
                          {note.instructions}
                        </p>
                      </div>
                    )}

                    {/* Action Items / Follow-up Tasks */}
                    {Array.isArray(note.actionItems) && note.actionItems.length > 0 && (
                      <div className="mb-3">
                        <span className="fw-semibold text-navy small d-block mb-1">
                          <i className="bi bi-check2-square text-success me-1"></i> Follow-up Tasks:
                        </span>
                        <ul className="list-group list-group-flush border rounded-2 p-2 bg-light mb-0">
                          {note.actionItems.map((task, idx) => (
                            <li key={idx} className="list-group-item bg-transparent border-0 py-1 px-2 small text-dark d-flex align-items-center">
                              <i className="bi bi-arrow-right-short text-primary fs-5 me-1"></i>
                              {task}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Tags */}
                    {Array.isArray(note.tags) && note.tags.length > 0 && (
                      <div className="mt-auto pt-3 border-top d-flex flex-wrap gap-1">
                        {note.tags.map((t, idx) => (
                          <span
                            key={idx}
                            className="badge bg-light text-secondary border small"
                            style={{ cursor: 'pointer' }}
                            onClick={() => setSelectedTagFilter(t)}
                            title={`Filter by tag: ${t}`}
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note Create / Edit Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveNote}
        editingNote={editingNote}
        defaultAppointmentId={selectedAppointmentFilter !== 'all' ? selectedAppointmentFilter : ''}
      />
    </div>
  );
}
