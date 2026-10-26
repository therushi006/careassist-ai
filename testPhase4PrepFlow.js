/**
 * testPhase4PrepFlow.js
 * Comprehensive automated test suite for Phase 4:
 * - Appointment Preparation Intake Form Validation
 * - Rule-Based Doctor Questions Generator
 * - Structured Summary Creation, Saving, Reopening, and Updating
 * - Cross-Component Event Notifications
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
  validatePrepSummary,
} from './src/services/storageService.js';

import {
  generateDoctorQuestions,
  QUESTION_CATEGORIES,
} from './src/services/questionGeneratorService.js';

console.log('========================================================');
console.log('🧪 RUNNING PHASE 4: APPOINTMENT PREP & QUESTION GENERATOR TESTS');
console.log('========================================================\n');

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
// TEST SUITE 1: Form Validation Logic
// ----------------------------------------------------
console.log('Test Suite 1: Form Validation & Guardrails');

const emptySummaryValidation = validatePrepSummary({});
assert(emptySummaryValidation.isValid === false, 'Rejects empty prep summary');

const nullSummaryValidation = validatePrepSummary(null);
assert(nullSummaryValidation.isValid === false, 'Rejects null input');

const validSummaryValidation = validatePrepSummary({
  chiefConcern: 'Persistent knee stiffness when walking down stairs',
});
assert(validSummaryValidation.isValid === true, 'Accepts valid prep summary with chief concern');

// ----------------------------------------------------
// TEST SUITE 2: Rule-Based Question Generator Heuristics
// ----------------------------------------------------
console.log('\nTest Suite 2: Rule-Based Doctor Questions Generator');

const mockIntake = {
  visitType: 'Specialist Consultation',
  chiefConcern: 'Sharp lower back pain',
  goals: ['Clarify whether physical therapy will help', 'Discuss non-opioid pain relief'],
  symptoms: {
    description: 'Sharp stabbing sensation that radiates down my left thigh',
    onset: 'About 6 weeks ago',
    frequency: 'Intermittent (comes and goes)',
    severity: 'Severe (8/10)',
    triggers: 'Sitting in an office chair for over 30 minutes',
    relievingFactors: 'Lying flat on a firm mattress with a pillow under knees',
    impact: 'Unable to sit through meetings or sleep continuously',
  },
};

const generatedQuestions = generateDoctorQuestions(mockIntake);

assert(Array.isArray(generatedQuestions), 'generateDoctorQuestions returns an array');
assert(generatedQuestions.length >= 7, `Generated comprehensive question set (${generatedQuestions.length} questions created)`);

// 2a: Chief concern question
const concernQ = generatedQuestions.find((q) => q.text.includes('Sharp lower back pain'));
assert(Boolean(concernQ), 'Formulated chief concern differential question');
assert(concernQ && concernQ.category === QUESTION_CATEGORIES.CLARIFICATION, 'Chief concern mapped to Clarification category');

// 2b: Prolonged duration trigger (6 weeks)
const durationQ = generatedQuestions.find((q) => q.text.includes('6 weeks ago') || q.text.includes('chronic issue'));
assert(Boolean(durationQ), 'Detected duration > 2 weeks and generated chronic timeline question');

// 2c: Severity trigger (Severe / 8/10)
const redFlagQ = generatedQuestions.find((q) => q.text.includes('red-flag'));
assert(Boolean(redFlagQ), 'Detected high severity and generated acute red-flag emergency guidance question');

// 2d: Triggers question
const triggerQ = generatedQuestions.find((q) => q.text.includes('Sitting in an office chair'));
assert(Boolean(triggerQ), 'Formulated question incorporating user-reported trigger');

// 2e: Relieving factor question
const reliefQ = generatedQuestions.find((q) => q.text.includes('Lying flat on a firm mattress'));
assert(Boolean(reliefQ), 'Formulated question incorporating user-reported relief factor');

// 2f: Daily life impact question
const impactQ = generatedQuestions.find((q) => q.text.includes('Unable to sit through meetings'));
assert(Boolean(impactQ), 'Formulated question incorporating user-reported daily life impact');

// 2g: Patient goals mapping
const goalQ = generatedQuestions.find((q) => q.text.includes('Clarify whether physical therapy will help'));
assert(Boolean(goalQ), 'Successfully mapped user visit goal into question agenda');

// ----------------------------------------------------
// TEST SUITE 3: Storage Integration & CRUD Cycle
// ----------------------------------------------------
console.log('\nTest Suite 3: Prep Summary Storage CRUD & Persistence');

window.localStorage.clear();

let storageChangeEventFired = false;
global.lastEventCallback = (evt) => {
  if (evt.type === 'careassist_storage_change') {
    storageChangeEventFired = true;
  }
};

// 3a: Save / Create Summary
const saveResult = storageService.addPrepSummary({
  title: 'Back Pain Specialist Agenda',
  visitType: 'Specialist Consultation',
  chiefConcern: mockIntake.chiefConcern,
  symptoms: mockIntake.symptoms,
  questions: generatedQuestions,
  goals: mockIntake.goals,
});

assert(saveResult.success === true, 'addPrepSummary saved successfully');
assert(saveResult.data && saveResult.data.id && saveResult.data.id.startsWith('prep_'), 'Generated unique ID with "prep_" prefix');
assert(storageChangeEventFired === true, 'careassist_storage_change event dispatched on save');

// 3b: Read / Reopen Summary
const savedId = saveResult.data.id;
const reopenedSummary = storageService.getPrepSummaryById(savedId);
assert(reopenedSummary !== null, 'getPrepSummaryById successfully retrieved saved record');
assert(reopenedSummary.title === 'Back Pain Specialist Agenda', 'Retrieved summary has matching title');
assert(reopenedSummary.questions.length === generatedQuestions.length, 'Retrieved summary preserved all generated questions');
assert(reopenedSummary.symptoms.severity === 'Severe (8/10)', 'Retrieved summary preserved symptom severity');

// 3c: Update Summary
const updateResult = storageService.updatePrepSummary(savedId, {
  title: 'Back Pain Specialist Agenda (Reviewed)',
  notes: 'Remember to ask about MRI referral authorization',
});

assert(updateResult.success === true, 'updatePrepSummary returned success=true');
assert(updateResult.data.title === 'Back Pain Specialist Agenda (Reviewed)', 'Title updated in storage');
assert(updateResult.data.id === savedId, 'ID preserved as immutable across updates');

// 3d: Dashboard metrics reflect new prep summary
const dashboardMetrics = storageService.getDashboardMetrics();
assert(dashboardMetrics.totalPrepSummaries === 1, 'Dashboard metrics reflects 1 saved prep summary');

// 3e: Delete Summary
const deleteResult = storageService.deletePrepSummary(savedId);
assert(deleteResult.success === true, 'deletePrepSummary returned success=true');
assert(storageService.getPrepSummaries().length === 0, 'Prep summaries list is empty after deletion');
assert(storageService.getDashboardMetrics().totalPrepSummaries === 0, 'Dashboard metrics reflects 0 prep summaries after deletion');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n========================================================');
console.log(`🏁 PHASE 4 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('========================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
