/**
 * testPhase5AppointmentsNotes.js
 * Comprehensive automated test suite for Phase 5:
 * - Appointment Manager CRUD, Status Transitions & Validation
 * - Visit Notes CRUD, Appointment Linking & Validation
 * - Search, Filter & Multi-Criteria Retrieval
 * - Event-Driven Dashboard Metrics Reactivity
 */

// 1. Mock Browser Environment
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

import {
  storageService,
  validateAppointment,
  validateNote,
} from './src/services/storageService.js';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 5: APPOINTMENTS & VISIT NOTES CRUD TEST SUITE');
console.log('================================================================\n');

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

// Clear store for fresh testing
window.localStorage.clear();

let storageEventFired = false;
global.lastEventCallback = (evt) => {
  if (evt.type === 'careassist_storage_change') {
    storageEventFired = true;
  }
};

// ----------------------------------------------------
// TEST SUITE 1: Appointment Validation
// ----------------------------------------------------
console.log('Test Suite 1: Appointment Validation & Date Handling');

const blankDocValidation = validateAppointment({ doctorName: '   ' });
assert(blankDocValidation.isValid === false, 'Rejects appointment with blank doctor name');

const invalidDateValidation = validateAppointment({
  doctorName: 'Dr. Jane Smith',
  date: 'invalid-date-format-999',
});
assert(invalidDateValidation.isValid === false, 'Rejects appointment with invalid date string');

const validAptValidation = validateAppointment({
  doctorName: 'Dr. Jane Smith',
  date: '2026-11-20',
});
assert(validAptValidation.isValid === true, 'Accepts valid appointment with doctor and valid date');

// ----------------------------------------------------
// TEST SUITE 2: Appointment CRUD & Status Transitions
// ----------------------------------------------------
console.log('\nTest Suite 2: Appointment CRUD & Status Transitions');

storageEventFired = false;
const createAptResult = storageService.addAppointment({
  doctorName: 'Dr. Michael Chen',
  specialty: 'Endocrinology',
  visitType: 'Specialist Consultation',
  date: '2026-12-05',
  time: '02:15 PM',
  location: 'Clinic Suite 305',
  reason: 'Routine thyroid nodule ultrasound review',
  notes: 'Fasting not required',
  status: 'scheduled',
});

assert(createAptResult.success === true, 'addAppointment succeeded');
assert(createAptResult.data.id.startsWith('apt_'), 'Appointment generated unique ID with "apt_" prefix');
assert(storageEventFired === true, 'Dispatched careassist_storage_change event on appointment creation');

const aptId = createAptResult.data.id;

// Read
const fetchedApt = storageService.getAppointmentById(aptId);
assert(fetchedApt !== null && fetchedApt.doctorName === 'Dr. Michael Chen', 'Retrieved appointment by ID');
assert(fetchedApt.specialty === 'Endocrinology', 'Specialty preserved in storage');

// Update: Change time and mark as completed
storageEventFired = false;
const updateAptResult = storageService.updateAppointment(aptId, {
  time: '03:00 PM',
  status: 'completed',
  notes: 'Fasting not required. Arrive 10 min early.',
});

assert(updateAptResult.success === true, 'updateAppointment succeeded');
assert(updateAptResult.data.status === 'completed', 'Appointment status transitioned to completed');
assert(updateAptResult.data.time === '03:00 PM', 'Appointment time updated');
assert(updateAptResult.data.id === aptId, 'Appointment ID preserved as immutable');
assert(storageEventFired === true, 'Dispatched storage change event on appointment update');

// Dashboard metrics reflects completion
const metricsAfterCompletion = storageService.getDashboardMetrics();
assert(metricsAfterCompletion.totalAppointments === 1, 'Total appointments counter is 1');
assert(metricsAfterCompletion.upcomingAppointmentsCount === 0, 'Upcoming count decreased to 0 after marking completed');

// Delete
const deleteAptResult = storageService.deleteAppointment(aptId);
assert(deleteAptResult.success === true, 'deleteAppointment succeeded');
assert(storageService.getAppointments().length === 0, 'Appointments list is empty after deletion');

// ----------------------------------------------------
// TEST SUITE 3: Visit Notes Validation & CRUD
// ----------------------------------------------------
console.log('\nTest Suite 3: Visit Notes Validation & CRUD');

// Validation
const blankNoteTitle = validateNote({ title: '   ', content: 'Discussion points' });
assert(blankNoteTitle.isValid === false, 'Rejects note with blank title');

const blankNoteContent = validateNote({ title: 'Valid Title', content: '   ' });
assert(blankNoteContent.isValid === false, 'Rejects note with blank content');

// Create Note
storageEventFired = false;
const createNoteResult = storageService.addNote({
  title: 'Endocrinology Ultrasound Findings',
  date: '2026-12-05',
  doctorName: 'Dr. Michael Chen',
  appointmentId: 'apt_test_linked_123',
  content: 'Reviewed ultrasound images. Thyroid nodule measures 1.2cm, unchanged since previous year. No suspicious microcalcifications.',
  instructions: 'Repeat neck ultrasound in 12 months. Continue levothyroxine 50mcg daily.',
  tags: ['Endocrinology', 'Ultrasound', 'Prescription & Medication'],
  actionItems: [
    'Schedule repeat ultrasound for December next year',
    'Get TSH blood draw in 6 months',
  ],
});

assert(createNoteResult.success === true, 'addNote succeeded');
assert(createNoteResult.data.id.startsWith('note_'), 'Note generated unique ID with "note_" prefix');
assert(createNoteResult.data.appointmentId === 'apt_test_linked_123', 'Note correctly linked to appointment ID');
assert(storageEventFired === true, 'Dispatched careassist_storage_change on note creation');

const noteId = createNoteResult.data.id;

// Read
const fetchedNote = storageService.getNoteById(noteId);
assert(fetchedNote !== null && fetchedNote.title === 'Endocrinology Ultrasound Findings', 'Retrieved note by ID');
assert(fetchedNote.actionItems.length === 2, 'Action items checklist preserved');
assert(fetchedNote.instructions.includes('levothyroxine 50mcg'), 'Doctor instructions field preserved');

// Update Note
storageEventFired = false;
const updateNoteResult = storageService.updateNote(noteId, {
  title: 'Endocrinology Ultrasound Findings (Reviewed)',
  instructions: 'Repeat neck ultrasound in 12 months. Continue levothyroxine 50mcg daily with water 30 mins before breakfast.',
});

assert(updateNoteResult.success === true, 'updateNote succeeded');
assert(updateNoteResult.data.title === 'Endocrinology Ultrasound Findings (Reviewed)', 'Note title updated');
assert(updateNoteResult.data.id === noteId, 'Note ID preserved as immutable');
assert(storageEventFired === true, 'Dispatched storage change event on note update');

// ----------------------------------------------------
// TEST SUITE 4: Search & Filtering Logic
// ----------------------------------------------------
console.log('\nTest Suite 4: Search & Filtering Logic');

// Add second note for multi-criteria search
storageService.addNote({
  title: 'Cardiology Annual Check',
  date: '2026-11-10',
  doctorName: 'Dr. Sarah Mitchell',
  appointmentId: 'apt_cardio_456',
  content: 'Blood pressure was 122/78. Resting heart rate 64. Continue walking 30 mins daily.',
  instructions: 'Monitor BP on Tuesdays.',
  tags: ['Cardiology', 'Diet & Lifestyle'],
  actionItems: ['Buy home BP monitor'],
});

const allNotes = storageService.getNotes();
assert(allNotes.length === 2, 'Total 2 notes in storage');

// Keyword Search
const searchResultsUltrasound = allNotes.filter((n) =>
  (n.title + ' ' + n.content + ' ' + n.instructions).toLowerCase().includes('ultrasound')
);
assert(searchResultsUltrasound.length === 1 && searchResultsUltrasound[0].id === noteId, 'Keyword search matched note by content ("ultrasound")');

const searchResultsBloodPressure = allNotes.filter((n) =>
  (n.title + ' ' + n.content + ' ' + (n.tags || []).join(' ')).toLowerCase().includes('cardiology')
);
assert(searchResultsBloodPressure.length === 1 && searchResultsBloodPressure[0].doctorName === 'Dr. Sarah Mitchell', 'Keyword search matched note by tag/doctor ("cardiology")');

// Tag Filter
const tagFilterResult = allNotes.filter((n) => (n.tags || []).includes('Ultrasound'));
assert(tagFilterResult.length === 1, 'Tag filter matched exactly 1 note');

// Appointment Link Filter
const aptLinkResult = allNotes.filter((n) => n.appointmentId === 'apt_test_linked_123');
assert(aptLinkResult.length === 1 && aptLinkResult[0].id === noteId, 'Appointment ID filter matched linked note');

// Delete Note
const deleteNoteResult = storageService.deleteNote(noteId);
assert(deleteNoteResult.success === true, 'deleteNote succeeded');
assert(storageService.getNotes().length === 1, 'Notes list contains 1 item after deletion');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 PHASE 5 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
