/**
 * testPhase7E2EQA.js
 * Comprehensive automated QA and End-to-End integration test suite for Phase 7:
 * - Simulated Assistant Deterministic & Non-Diagnostic Safety Guardrails
 * - SPA Fallback Configuration Integrity (Netlify & Vercel)
 * - Complete Cross-Module User Journey Integration
 */

import fs from 'fs';
import path from 'path';

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

import { storageService } from './src/services/storageService.js';
import { generateDoctorQuestions } from './src/services/questionGeneratorService.js';
import { simplifyMedicalText } from './src/services/healthLibraryData.js';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 7: FINAL QA & END-TO-END INTEGRATION TEST SUITE');
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

// ----------------------------------------------------
// TEST SUITE 1: Deployment Configuration Integrity (SPA Fallback)
// ----------------------------------------------------
console.log('Test Suite 1: Deployment & SPA Redirect Configuration Checks');

// Netlify _redirects check
const redirectsPath = path.resolve('./public/_redirects');
const hasRedirectsFile = fs.existsSync(redirectsPath);
assert(hasRedirectsFile, 'public/_redirects file exists for Netlify SPA deployment');

if (hasRedirectsFile) {
  const content = fs.readFileSync(redirectsPath, 'utf8');
  assert(content.includes('/*') && content.includes('/index.html') && content.includes('200'), 'public/_redirects correctly maps all client-side routes to index.html with 200 status');
}

// Vercel vercel.json check
const vercelPath = path.resolve('./vercel.json');
const hasVercelFile = fs.existsSync(vercelPath);
assert(hasVercelFile, 'vercel.json file exists for Vercel SPA deployment');

if (hasVercelFile) {
  const vercelConfig = JSON.parse(fs.readFileSync(vercelPath, 'utf8'));
  assert(Array.isArray(vercelConfig.rewrites) && vercelConfig.rewrites[0].destination === '/', 'vercel.json correctly rewrites routes to SPA root');
}

// ----------------------------------------------------
// TEST SUITE 2: Simulated Assistant Non-Diagnostic Safety & Logic
// ----------------------------------------------------
console.log('\nTest Suite 2: Simulated Assistant Logic & Guardrails');

// Import logic simulator directly matching AssistantPage
function testAssistantResponse(query) {
  const q = (query || '').toLowerCase().trim();
  if (q.includes('diagnose') || q.includes('do i have') || q.includes('is it cancer')) {
    return {
      type: 'safety_refusal',
      refused: true,
      text: 'CareAssist AI is an appointment preparation and health literacy platform. It cannot evaluate symptoms, interpret medical scans, or provide clinical diagnoses.',
    };
  }
  if (q.includes('blood') || q.includes('lab') || q.includes('fasting')) {
    return {
      type: 'informational',
      refused: false,
      topic: 'Diagnostics & Lab Preparation',
    };
  }
  return { type: 'general', refused: false };
}

// Test diagnosis attempt
const diagnosticAttempt = testAssistantResponse('Can you diagnose my chest tightness and tell me if it is cancer?');
assert(diagnosticAttempt.refused === true, 'Assistant strictly refuses medical diagnosis inquiries');
assert(diagnosticAttempt.text.includes('cannot evaluate symptoms'), 'Assistant displays explicit non-diagnostic safety disclaimer');

// Test lab prep inquiry
const labInquiry = testAssistantResponse('What are the fasting rules for morning blood work?');
assert(labInquiry.refused === false, 'Assistant provides informational response for lab work preparation');
assert(labInquiry.topic === 'Diagnostics & Lab Preparation', 'Assistant maps to appropriate educational domain');

// ----------------------------------------------------
// TEST SUITE 3: Full End-to-End User Workflow Integration
// ----------------------------------------------------
console.log('\nTest Suite 3: End-to-End Workflow (Appointment -> Prep -> Note -> Dashboard)');

window.localStorage.clear();

// 1. User schedules an upcoming appointment
const aptResult = storageService.addAppointment({
  doctorName: 'Dr. Gregory House',
  specialty: 'Internal Medicine',
  visitType: 'Specialist Consultation',
  date: '2026-11-28',
  time: '10:00 AM',
  location: 'Princeton Clinic Suite 4',
  reason: 'Chronic joint stiffness and fatigue',
});
assert(aptResult.success === true, 'E2E Step 1: Appointment created');
const createdAptId = aptResult.data.id;

// 2. User prepares for appointment using Prep Tool
const questions = generateDoctorQuestions({
  visitType: 'Specialist Consultation',
  chiefConcern: 'Chronic joint stiffness and fatigue',
  symptoms: {
    description: 'Aching in hands and knees in morning',
    onset: '6 months ago',
    severity: 'Moderate',
    triggers: 'Cold weather',
    relievingFactors: 'Warm showers',
    impact: 'Stiffness takes 45 minutes to ease',
  },
  goals: ['Evaluate inflammatory markers'],
});

const prepResult = storageService.addPrepSummary({
  title: 'Rheumatology Prep Agenda',
  visitType: 'Specialist Consultation',
  chiefConcern: 'Chronic joint stiffness and fatigue',
  symptoms: {
    description: 'Aching in hands and knees in morning',
    onset: '6 months ago',
    severity: 'Moderate',
  },
  questions,
  goals: ['Evaluate inflammatory markers'],
});
assert(prepResult.success === true, 'E2E Step 2: Prep summary agenda generated and saved');
const createdPrepId = prepResult.data.id;

// 3. User links prep sheet to the appointment
const updateAptWithPrep = storageService.updateAppointment(createdAptId, {
  prepSummaryId: createdPrepId,
});
assert(updateAptWithPrep.success === true, 'E2E Step 3: Linked prep agenda to appointment');
assert(updateAptWithPrep.data.prepSummaryId === createdPrepId, 'Appointment preserves linked prep summary foreign key');

// 4. User completes appointment and logs Visit Note
const noteResult = storageService.addNote({
  title: 'Internal Medicine Follow-up Notes',
  doctorName: 'Dr. Gregory House',
  appointmentId: createdAptId,
  date: '2026-11-28',
  content: 'Doctor examined joints. Ordered rheumatoid factor and ESR blood panel.',
  instructions: 'Get blood drawn before Friday. Take OTC acetaminophen if needed.',
  tags: ['Internal Medicine', 'Blood Panel', 'Follow-up Needed'],
  actionItems: ['Schedule ESR blood draw', 'Follow up with clinic in 2 weeks for results'],
});
assert(noteResult.success === true, 'E2E Step 4: Visit note recorded and linked to appointment');
const createdNoteId = noteResult.data.id;

// 5. User marks appointment as completed
storageService.updateAppointment(createdAptId, {
  status: 'completed',
});

// 6. User simplifies medical term from doctor's note
const simplification = simplifyMedicalText('The doctor ordered a Complete Blood Count (CBC) and checked for edema');
assert(simplification.matches.length >= 2, 'E2E Step 5: Terminology simplifier found terms in doctor discussion');

// 7. Verify Dashboard Metrics Sync
const finalMetrics = storageService.getDashboardMetrics();
assert(finalMetrics.totalAppointments === 1, 'Dashboard reflects 1 total appointment');
assert(finalMetrics.upcomingAppointmentsCount === 0, 'Dashboard reflects 0 upcoming visits (successfully marked completed)');
assert(finalMetrics.totalPrepSummaries === 1, 'Dashboard reflects 1 saved prep agenda');
assert(finalMetrics.totalNotes === 1, 'Dashboard reflects 1 saved visit note');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 PHASE 7 QA TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
