/**
 * storageService.js
 * Centralized, safe localStorage persistence layer for CareAssist AI.
 * 
 * Strict compliance:
 * - Full CRUD for Appointments, Visit Notes, and Prep Summaries.
 * - Robust error handling, JSON parsing recovery, and input validation.
 * - Reactive cross-component event notifications ('careassist_storage_change').
 * - Zero fake/mock data injection; true empty-state fidelity.
 * - Purely client-side; zero external data leakage.
 */

export const STORAGE_KEYS = {
  APPOINTMENTS: 'careassist_appointments',
  NOTES: 'careassist_notes',
  PREP_SUMMARIES: 'careassist_prep_summaries',
  MEDICATIONS: 'careassist_medications',
  ALLERGIES: 'careassist_allergies',
};

/**
 * Generate a collision-resistant unique ID.
 */
export function generateId(prefix = 'rec') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  const timestamp = Date.now().toString(36);
  const randomPart = Math.random().toString(36).substring(2, 9);
  return `${prefix}_${timestamp}_${randomPart}`;
}

/**
 * Notify subscribers that storage data has been updated.
 */
function notifyChange(key) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('careassist_storage_change', { detail: { key } }));
  }
}

/**
 * Safe JSON parser with array sanity checks.
 * Recovers gracefully from malformed or corrupted values.
 */
export function safeGet(key, defaultValue = []) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return defaultValue;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(`[storageService] Value for ${key} was not an array. Resetting to default.`);
      return defaultValue;
    }
    // Filter out invalid items (null, non-objects)
    return parsed.filter((item) => item && typeof item === 'object' && !Array.isArray(item));
  } catch (error) {
    console.warn(`[storageService] Corrupted JSON in ${key}. Returning default.`, error);
    return defaultValue;
  }
}

/**
 * Safe JSON writer with storage quota exception handling.
 */
export function safeSet(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return false;
  }
  try {
    const serialized = JSON.stringify(value);
    window.localStorage.setItem(key, serialized);
    notifyChange(key);
    return true;
  } catch (error) {
    console.error(`[storageService] Failed to write to localStorage for ${key}:`, error);
    return false;
  }
}

// ==========================================
// VALIDATION HELPERS
// ==========================================

export function validateAppointment(appointment) {
  if (!appointment || typeof appointment !== 'object') {
    return { isValid: false, error: 'Appointment record must be an object.' };
  }
  if (!appointment.doctorName || typeof appointment.doctorName !== 'string' || !appointment.doctorName.trim()) {
    return { isValid: false, error: 'Doctor name is required.' };
  }
  return { isValid: true };
}

export function validateNote(note) {
  if (!note || typeof note !== 'object') {
    return { isValid: false, error: 'Note record must be an object.' };
  }
  if (!note.title || typeof note.title !== 'string' || !note.title.trim()) {
    return { isValid: false, error: 'Note title is required.' };
  }
  if (!note.content || typeof note.content !== 'string' || !note.content.trim()) {
    return { isValid: false, error: 'Note content is required.' };
  }
  return { isValid: true };
}

export function validatePrepSummary(summary) {
  if (!summary || typeof summary !== 'object') {
    return { isValid: false, error: 'Prep summary record must be an object.' };
  }
  const hasTitle = summary.title && typeof summary.title === 'string' && summary.title.trim();
  const hasConcern = summary.chiefConcern && typeof summary.chiefConcern === 'string' && summary.chiefConcern.trim();
  if (!hasTitle && !hasConcern) {
    return { isValid: false, error: 'Prep summary requires a title or chief concern.' };
  }
  return { isValid: true };
}

// ==========================================
// STORAGE SERVICE CRUD API
// ==========================================

export const storageService = {
  // ----------------------------------------
  // APPOINTMENTS CRUD
  // ----------------------------------------
  getAppointments: () => safeGet(STORAGE_KEYS.APPOINTMENTS, []),

  getAppointmentById: (id) => {
    if (!id) return null;
    const list = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    return list.find((item) => item.id === id) || null;
  },

  addAppointment: (appointmentData) => {
    const validation = validateAppointment(appointmentData);
    if (!validation.isValid) {
      console.warn(`[storageService] Rejected appointment: ${validation.error}`);
      return { success: false, error: validation.error, data: null };
    }

    const now = new Date().toISOString();
    const newAppointment = {
      id: appointmentData.id || generateId('apt'),
      doctorName: appointmentData.doctorName.trim(),
      specialty: appointmentData.specialty?.trim() || 'General Practice',
      date: appointmentData.date || '',
      time: appointmentData.time || '',
      location: appointmentData.location?.trim() || '',
      reason: appointmentData.reason?.trim() || '',
      prepSummaryId: appointmentData.prepSummaryId || null,
      status: appointmentData.status || 'scheduled',
      createdAt: appointmentData.createdAt || now,
      updatedAt: now,
    };

    const currentList = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const updatedList = [newAppointment, ...currentList];
    const saved = safeSet(STORAGE_KEYS.APPOINTMENTS, updatedList);

    return { success: saved, data: newAppointment, list: updatedList };
  },

  updateAppointment: (id, updates) => {
    if (!id || !updates || typeof updates !== 'object') {
      return { success: false, error: 'Valid ID and updates object required.' };
    }

    const currentList = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) {
      return { success: false, error: `Appointment with ID "${id}" not found.` };
    }

    const existing = currentList[index];
    const candidate = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      createdAt: existing.createdAt, // Preserve creation timestamp
      updatedAt: new Date().toISOString(),
    };

    const validation = validateAppointment(candidate);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    currentList[index] = candidate;
    const saved = safeSet(STORAGE_KEYS.APPOINTMENTS, currentList);
    return { success: saved, data: candidate, list: currentList };
  },

  deleteAppointment: (id) => {
    if (!id) return { success: false, error: 'ID is required.' };
    const currentList = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const updatedList = currentList.filter((item) => item.id !== id);
    const saved = safeSet(STORAGE_KEYS.APPOINTMENTS, updatedList);
    return { success: saved, list: updatedList };
  },

  // ----------------------------------------
  // VISIT NOTES CRUD
  // ----------------------------------------
  getNotes: () => safeGet(STORAGE_KEYS.NOTES, []),

  getNoteById: (id) => {
    if (!id) return null;
    const list = safeGet(STORAGE_KEYS.NOTES, []);
    return list.find((item) => item.id === id) || null;
  },

  addNote: (noteData) => {
    const validation = validateNote(noteData);
    if (!validation.isValid) {
      console.warn(`[storageService] Rejected note: ${validation.error}`);
      return { success: false, error: validation.error, data: null };
    }

    const now = new Date().toISOString();
    const newNote = {
      id: noteData.id || generateId('note'),
      title: noteData.title.trim(),
      content: noteData.content.trim(),
      appointmentId: noteData.appointmentId || null,
      doctorName: noteData.doctorName?.trim() || '',
      date: noteData.date || new Date().toISOString().split('T')[0],
      tags: Array.isArray(noteData.tags) ? noteData.tags.map((t) => String(t).trim()).filter(Boolean) : [],
      actionItems: Array.isArray(noteData.actionItems) ? noteData.actionItems : [],
      createdAt: noteData.createdAt || now,
      updatedAt: now,
    };

    const currentList = safeGet(STORAGE_KEYS.NOTES, []);
    const updatedList = [newNote, ...currentList];
    const saved = safeSet(STORAGE_KEYS.NOTES, updatedList);

    return { success: saved, data: newNote, list: updatedList };
  },

  updateNote: (id, updates) => {
    if (!id || !updates || typeof updates !== 'object') {
      return { success: false, error: 'Valid ID and updates object required.' };
    }

    const currentList = safeGet(STORAGE_KEYS.NOTES, []);
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) {
      return { success: false, error: `Note with ID "${id}" not found.` };
    }

    const existing = currentList[index];
    const candidate = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      createdAt: existing.createdAt, // Preserve creation timestamp
      updatedAt: new Date().toISOString(),
    };

    const validation = validateNote(candidate);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    currentList[index] = candidate;
    const saved = safeSet(STORAGE_KEYS.NOTES, currentList);
    return { success: saved, data: candidate, list: currentList };
  },

  deleteNote: (id) => {
    if (!id) return { success: false, error: 'ID is required.' };
    const currentList = safeGet(STORAGE_KEYS.NOTES, []);
    const updatedList = currentList.filter((item) => item.id !== id);
    const saved = safeSet(STORAGE_KEYS.NOTES, updatedList);
    return { success: saved, list: updatedList };
  },

  // ----------------------------------------
  // PREP SUMMARIES CRUD
  // ----------------------------------------
  getPrepSummaries: () => safeGet(STORAGE_KEYS.PREP_SUMMARIES, []),

  getPrepSummaryById: (id) => {
    if (!id) return null;
    const list = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);
    return list.find((item) => item.id === id) || null;
  },

  addPrepSummary: (summaryData) => {
    const validation = validatePrepSummary(summaryData);
    if (!validation.isValid) {
      console.warn(`[storageService] Rejected prep summary: ${validation.error}`);
      return { success: false, error: validation.error, data: null };
    }

    const now = new Date().toISOString();
    const newSummary = {
      id: summaryData.id || generateId('prep'),
      title: summaryData.title?.trim() || summaryData.chiefConcern?.trim() || 'Appointment Prep Sheet',
      visitType: summaryData.visitType?.trim() || 'General Consultation',
      chiefConcern: summaryData.chiefConcern?.trim() || '',
      symptoms: summaryData.symptoms || {
        description: '',
        onset: '',
        severity: '',
        frequency: '',
        triggers: '',
        relievingFactors: '',
      },
      questions: Array.isArray(summaryData.questions) ? summaryData.questions : [],
      goals: Array.isArray(summaryData.goals) ? summaryData.goals : [],
      notes: summaryData.notes?.trim() || '',
      createdAt: summaryData.createdAt || now,
      updatedAt: now,
    };

    const currentList = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);
    const updatedList = [newSummary, ...currentList];
    const saved = safeSet(STORAGE_KEYS.PREP_SUMMARIES, updatedList);

    return { success: saved, data: newSummary, list: updatedList };
  },

  updatePrepSummary: (id, updates) => {
    if (!id || !updates || typeof updates !== 'object') {
      return { success: false, error: 'Valid ID and updates object required.' };
    }

    const currentList = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);
    const index = currentList.findIndex((item) => item.id === id);
    if (index === -1) {
      return { success: false, error: `Prep summary with ID "${id}" not found.` };
    }

    const existing = currentList[index];
    const candidate = {
      ...existing,
      ...updates,
      id: existing.id, // Immutable ID
      createdAt: existing.createdAt,
      updatedAt: new Date().toISOString(),
    };

    const validation = validatePrepSummary(candidate);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    currentList[index] = candidate;
    const saved = safeSet(STORAGE_KEYS.PREP_SUMMARIES, currentList);
    return { success: saved, data: candidate, list: currentList };
  },

  deletePrepSummary: (id) => {
    if (!id) return { success: false, error: 'ID is required.' };
    const currentList = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);
    const updatedList = currentList.filter((item) => item.id !== id);
    const saved = safeSet(STORAGE_KEYS.PREP_SUMMARIES, updatedList);
    return { success: saved, list: updatedList };
  },

  // ----------------------------------------
  // DASHBOARD METRICS SUMMARY
  // ----------------------------------------
  getDashboardMetrics: () => {
    const appointments = safeGet(STORAGE_KEYS.APPOINTMENTS, []);
    const notes = safeGet(STORAGE_KEYS.NOTES, []);
    const prepSummaries = safeGet(STORAGE_KEYS.PREP_SUMMARIES, []);

    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingAppointments = appointments.filter((app) => {
      if (!app.date) return true;
      return app.date >= todayStr && app.status !== 'cancelled' && app.status !== 'completed';
    });

    return {
      totalAppointments: appointments.length,
      upcomingAppointmentsCount: upcomingAppointments.length,
      totalNotes: notes.length,
      totalPrepSummaries: prepSummaries.length,
    };
  },
};
