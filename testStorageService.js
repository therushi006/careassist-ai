/**
 * testStorageService.js
 * Test suite verifying localStorage CRUD operations, corruption recovery,
 * validation rejection, and event notification dispatching.
 */

// 1. Mock browser environment (window, localStorage, CustomEvent)
const store = {};
global.window = {
  localStorage: {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, val) => {
      store[key] = String(val);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach((k) => delete store[k]);
    },
  },
  dispatchEvent: (event) => {
    if (global.lastEventCallback) {
      global.lastEventCallback(event);
    }
    return true;
  },
};

global.CustomEvent = class CustomEvent {
  constructor(type, eventInitDict) {
    this.type = type;
    this.detail = eventInitDict ? eventInitDict.detail : null;
  }
};

// Import storageService
import {
  storageService,
  STORAGE_KEYS,
  validateAppointment,
  validateNote,
  validatePrepSummary,
  safeGet,
  safeSet,
} from './src/services/storageService.js';

import {
  HEALTH_LIBRARY_METADATA,
  searchMedicalTerms,
  searchHealthGuides,
} from './src/services/healthLibraryData.js';

console.log('==============================================');
console.log('🧪 RUNNING CAREASSIST AI STORAGE & DATA TEST SUITE');
console.log('==============================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    process.exitCode = 1;
  }
}

// ----------------------------------------------------
// TEST 1: Initial Empty State (Zero Fake Records)
// ----------------------------------------------------
console.log('Test Suite 1: Initial Empty State & Safe Retrieval');
window.localStorage.clear();
const initialApts = storageService.getAppointments();
const initialNotes = storageService.getNotes();
const initialPrep = storageService.getPrepSummaries();
const initialMetrics = storageService.getDashboardMetrics();

assert(Array.isArray(initialApts) && initialApts.length === 0, 'Appointments starts with an empty array');
assert(Array.isArray(initialNotes) && initialNotes.length === 0, 'Notes starts with an empty array');
assert(Array.isArray(initialPrep) && initialPrep.length === 0, 'Prep summaries starts with an empty array');
assert(initialMetrics.totalAppointments === 0, 'Initial total appointments is 0');
assert(initialMetrics.totalNotes === 0, 'Initial total notes is 0');

// ----------------------------------------------------
// TEST 2: Appointment CRUD
// ----------------------------------------------------
console.log('\nTest Suite 2: Appointment CRUD Operations');

// 2a: Create Appointment
let lastDispatchedEvent = null;
global.lastEventCallback = (evt) => {
  lastDispatchedEvent = evt;
};

const aptResult = storageService.addAppointment({
  doctorName: 'Dr. Sarah Mitchell',
  specialty: 'Cardiology',
  date: '2026-11-15',
  time: '10:30 AM',
  location: 'Downtown Heart Clinic',
  reason: 'Annual blood pressure evaluation and ECG follow-up',
});

assert(aptResult.success === true, 'addAppointment returned success=true');
assert(aptResult.data && aptResult.data.id && aptResult.data.id.startsWith('apt_'), 'Appointment generated unique ID with "apt_" prefix');
assert(aptResult.data.doctorName === 'Dr. Sarah Mitchell', 'Appointment doctorName saved correctly');
assert(lastDispatchedEvent && lastDispatchedEvent.type === 'careassist_storage_change', 'Storage change event fired on addAppointment');

// 2b: Read Appointment
const fetchedApts = storageService.getAppointments();
assert(fetchedApts.length === 1, 'getAppointments returns 1 item');
const fetchedApt = storageService.getAppointmentById(aptResult.data.id);
assert(fetchedApt && fetchedApt.doctorName === 'Dr. Sarah Mitchell', 'getAppointmentById retrieved correct record');

// 2c: Update Appointment
const updateResult = storageService.updateAppointment(aptResult.data.id, {
  time: '11:00 AM',
  reason: 'Updated: Annual blood pressure and stress test review',
});
assert(updateResult.success === true, 'updateAppointment returned success=true');
assert(updateResult.data.time === '11:00 AM', 'Appointment time updated to 11:00 AM');
assert(updateResult.data.id === aptResult.data.id, 'Appointment ID preserved as immutable');

// 2d: Delete Appointment
const deleteAptResult = storageService.deleteAppointment(aptResult.data.id);
assert(deleteAptResult.success === true, 'deleteAppointment returned success=true');
assert(storageService.getAppointments().length === 0, 'Appointments list is empty after deletion');

// ----------------------------------------------------
// TEST 3: Visit Notes CRUD
// ----------------------------------------------------
console.log('\nTest Suite 3: Visit Notes CRUD Operations');

// 3a: Create Note
const noteResult = storageService.addNote({
  title: 'Cardiology Visit Summary',
  content: 'Doctor advised continuing lisinopril 10mg daily. Scheduled follow-up lipid panel in 6 months.',
  doctorName: 'Dr. Sarah Mitchell',
  tags: ['Blood Pressure', 'Medication'],
  actionItems: ['Schedule lipid blood draw for May', 'Monitor home BP every Tuesday morning'],
});

assert(noteResult.success === true, 'addNote returned success=true');
assert(noteResult.data && noteResult.data.id && noteResult.data.id.startsWith('note_'), 'Note generated unique ID with "note_" prefix');
assert(noteResult.data.tags.length === 2, 'Note tags array saved');

// 3b: Read Note
const fetchedNotes = storageService.getNotes();
assert(fetchedNotes.length === 1, 'getNotes returns 1 item');
const fetchedNote = storageService.getNoteById(noteResult.data.id);
assert(fetchedNote && fetchedNote.title === 'Cardiology Visit Summary', 'getNoteById retrieved correct note');

// 3c: Update Note
const noteUpdate = storageService.updateNote(noteResult.data.id, {
  title: 'Cardiology Visit Summary (Final)',
  content: 'Doctor advised continuing lisinopril 10mg. Added dietary sodium limit.',
});
assert(noteUpdate.success === true, 'updateNote returned success=true');
assert(noteUpdate.data.title === 'Cardiology Visit Summary (Final)', 'Note title updated');

// 3d: Delete Note
const deleteNoteResult = storageService.deleteNote(noteResult.data.id);
assert(deleteNoteResult.success === true, 'deleteNote returned success=true');
assert(storageService.getNotes().length === 0, 'Notes list is empty after deletion');

// ----------------------------------------------------
// TEST 4: Input Validation Rejection
// ----------------------------------------------------
console.log('\nTest Suite 4: Input Validation');

const invalidApt = storageService.addAppointment({
  doctorName: '   ', // Blank name should fail
});
assert(invalidApt.success === false, 'addAppointment rejected empty doctor name');

const invalidNote = storageService.addNote({
  title: '',
  content: 'Content with empty title',
});
assert(invalidNote.success === false, 'addNote rejected empty note title');

const invalidNoteNoContent = storageService.addNote({
  title: 'Valid Title',
  content: '',
});
assert(invalidNoteNoContent.success === false, 'addNote rejected empty note content');

// ----------------------------------------------------
// TEST 5: Data Corruption & Parsing Resilience
// ----------------------------------------------------
console.log('\nTest Suite 5: Corrupted Data Recovery');

// Inject raw malformed JSON into localStorage
window.localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, '{{NOT_VALID_JSON---');
const recoveryApts = storageService.getAppointments();
assert(Array.isArray(recoveryApts) && recoveryApts.length === 0, 'safeGet safely handles unparseable JSON without crashing');

// Inject non-array JSON
window.localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify({ notAnArray: true }));
const nonArrayNotes = storageService.getNotes();
assert(Array.isArray(nonArrayNotes) && nonArrayNotes.length === 0, 'safeGet safely recovers when storage contains non-array JSON object');

// Inject array containing nulls or primitives
window.localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify([null, 42, 'string', { id: 'note_valid', title: 'Valid Note', content: 'Clean' }]));
const sanitizedNotes = storageService.getNotes();
assert(sanitizedNotes.length === 1 && sanitizedNotes[0].id === 'note_valid', 'safeGet filters out nulls/primitives and keeps valid objects');

// ----------------------------------------------------
// TEST 6: Health Information Reference Dataset
// ----------------------------------------------------
console.log('\nTest Suite 6: Educational Health Library Reference Dataset');

assert(HEALTH_LIBRARY_METADATA.disclaimer.includes('Not clinically reviewed'), 'Educational metadata includes clear non-clinically-reviewed disclaimer');
const bpSearch = searchMedicalTerms('blood');
assert(bpSearch.length >= 2, 'searchMedicalTerms successfully matched terms containing "blood"');
const guideSearch = searchHealthGuides('physical');
assert(guideSearch.length >= 1 && guideSearch[0].title.includes('Annual Physical'), 'searchHealthGuides successfully found Annual Physical guide');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n==============================================');
console.log(`🏁 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('==============================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
