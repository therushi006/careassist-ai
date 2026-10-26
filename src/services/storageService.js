/**
 * storageService.js
 * Centralized, safe localStorage persistence layer for CareAssist AI.
 * 
 * Strict compliance note: No fake or mock records are injected.
 * If no data exists, methods return empty arrays.
 */

const STORAGE_KEYS = {
  APPOINTMENTS: 'careassist_appointments',
  NOTES: 'careassist_notes',
  PREP_SUMMARIES: 'careassist_prep_summaries',
  MEDICATIONS: 'careassist_medications',
  ALLERGIES: 'careassist_allergies',
};

// Safe JSON parser helper
function safeGet(key, defaultValue = []) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return defaultValue;
  }
}

// Safe JSON setter helper
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing ${key} to localStorage:`, error);
    return false;
  }
}

export const storageService = {
  // Appointments
  getAppointments: () => safeGet(STORAGE_KEYS.APPOINTMENTS, []),
  saveAppointments: (appointments) => safeSet(STORAGE_KEYS.APPOINTMENTS, appointments),
  addAppointment: (appointment) => {
    const list = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const updated = [appointment, ...list];
    safeSet(STORAGE_KEYS.APPOINTMENTS, updated);
    return updated;
  },
  deleteAppointment: (id) => {
    const list = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const updated = list.filter((item) => item.id !== id);
    safeSet(STORAGE_KEYS.APPOINTMENTS, updated);
    return updated;
  },

  // Notes
  getNotes: () => safeGet(STORAGE_KEYS.NOTES, []),
  saveNotes: (notes) => safeSet(STORAGE_KEYS.NOTES, notes),
  addNote: (note) => {
    const list = safeGet(STORAGE_KEYS.NOTES, []);
    const updated = [note, ...list];
    safeSet(STORAGE_KEYS.NOTES, updated);
    return updated;
  },
  updateNote: (updatedNote) => {
    const list = safeGet(STORAGE_KEYS.NOTES, []);
    const updated = list.map((item) => (item.id === updatedNote.id ? updatedNote : item));
    safeSet(STORAGE_KEYS.NOTES, updated);
    return updated;
  },
  deleteNote: (id) => {
    const list = safeGet(STORAGE_KEYS.NOTES, []);
    const updated = list.filter((item) => item.id !== id);
    safeSet(STORAGE_KEYS.NOTES, updated);
    return updated;
  },

  // Prep Summaries
  getPrepSummaries: () => safeGet(STORAGE_KEYS.PREP_SUMMARIES, []),
  savePrepSummaries: (summaries) => safeSet(STORAGE_KEYS.PREP_SUMMARIES, summaries),
  addPrepSummary: (summary) => {
    const list = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);
    const updated = [summary, ...list];
    safeSet(STORAGE_KEYS.PREP_SUMMARIES, updated);
    return updated;
  },
  deletePrepSummary: (id) => {
    const list = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);
    const updated = list.filter((item) => item.id !== id);
    safeSet(STORAGE_KEYS.PREP_SUMMARIES, updated);
    return updated;
  },

  // Metrics summary for Dashboard
  getDashboardMetrics: () => {
    const appointments = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const notes = safeGet(STORAGE_KEYS.NOTES, []);
    const prepSummaries = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);

    // Filter upcoming appointments (date >= today or all valid if no date)
    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments.filter((app) => !app.date || app.date >= todayStr);

    return {
      totalAppointments: appointments.length,
      upcomingAppointmentsCount: upcomingAppointments.length,
      totalNotes: notes.length,
      totalPrepSummaries: prepSummaries.length,
    };
  },
};
