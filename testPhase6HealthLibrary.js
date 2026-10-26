/**
 * testPhase6HealthLibrary.js
 * Comprehensive automated test suite for Phase 6:
 * - Searchable Health Information Library & Category Filtering
 * - Guide Detail Retrieval & Metadata Verification
 * - Medical Terminology Simplifier (Exact, Sentence & Fallback Matching)
 * - Safe Non-Diagnostic Educational Guardrails
 */

import {
  HEALTH_GUIDES,
  MEDICAL_TERMS,
  HEALTH_LIBRARY_METADATA,
  searchHealthGuides,
  getGuideById,
  searchMedicalTerms,
  getTermById,
  simplifyMedicalText,
} from './src/services/healthLibraryData.js';

console.log('================================================================');
console.log('🧪 RUNNING PHASE 6: HEALTH LIBRARY & TERMINOLOGY SIMPLIFIER TESTS');
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
// TEST SUITE 1: Educational Metadata & Safety Disclaimers
// ----------------------------------------------------
console.log('Test Suite 1: Educational Metadata & Safety Labels');

assert(
  HEALTH_LIBRARY_METADATA.reviewStatus.includes('Not Clinically Reviewed'),
  'Metadata explicitly states content is Not Clinically Reviewed'
);
assert(
  HEALTH_LIBRARY_METADATA.disclaimer.includes('does not replace qualified medical advice'),
  'Metadata contains non-diagnostic clinical disclaimer'
);
assert(
  HEALTH_GUIDES.every((g) => g.reviewStatus === 'Not Clinically Reviewed'),
  'All educational guides are tagged with unreviewed educational draft status'
);
assert(
  MEDICAL_TERMS.every((t) => t.reviewStatus === 'Not Clinically Reviewed'),
  'All medical terms are tagged with unreviewed educational draft status'
);

// ----------------------------------------------------
// TEST SUITE 2: Health Guides Search & Category Filtering
// ----------------------------------------------------
console.log('\nTest Suite 2: Health Guides Search & Category Filtering');

// 2a: Empty query returns full list
const allGuides = searchHealthGuides('');
assert(allGuides.length === HEALTH_GUIDES.length, 'Empty search returns all health guides');

// 2b: Keyword search by title
const bloodGuides = searchHealthGuides('blood');
assert(bloodGuides.length >= 1, 'Search by keyword "blood" matched relevant diagnostic guide');
assert(bloodGuides.some((g) => g.title.includes('Blood Work')), 'Matched "Getting Ready for Routine Lab Blood Work"');

// 2c: Keyword search by summary
const specialistGuides = searchHealthGuides('specialist');
assert(specialistGuides.length >= 1, 'Search by keyword "specialist" matched specialist guide');

// 2d: Non-matching query returns empty list
const zeroGuides = searchHealthGuides('completely_nonexistent_topic_xyz');
assert(zeroGuides.length === 0, 'Non-matching search cleanly returns empty array');

// 2e: Category filtering
const diagnosticCategoryGuides = HEALTH_GUIDES.filter((g) => g.category === 'Diagnostics');
assert(diagnosticCategoryGuides.length === 1, 'Filtered guides by "Diagnostics" category');

// 2f: Guide Detail Retrieval by ID
const physicalGuide = getGuideById('guide_1');
assert(physicalGuide !== null, 'getGuideById retrieved guide_1 successfully');
assert(physicalGuide.title === 'Preparing for Your Annual Physical Exam', 'Retrieved guide has correct title');
assert(Array.isArray(physicalGuide.keyPoints) && physicalGuide.keyPoints.length >= 4, 'Guide has structured key preparation points');
assert(physicalGuide.detailedContent.toLowerCase().includes('annual physical'), 'Guide contains detailed content section');

// ----------------------------------------------------
// TEST SUITE 3: Medical Terms Search & Glossary Retrieval
// ----------------------------------------------------
console.log('\nTest Suite 3: Medical Terms Search & Glossary Retrieval');

const allTerms = searchMedicalTerms('');
assert(allTerms.length === MEDICAL_TERMS.length, 'Empty search returns all medical terms');

const bpTerms = searchMedicalTerms('hypertension');
assert(bpTerms.length === 1 && bpTerms[0].term === 'Hypertension', 'Search for "hypertension" matched exact term');
assert(bpTerms[0].phonetic === 'hy-per-TEN-shun', 'Matched term includes phonetic pronunciation guide');

const termById = getTermById('term_7');
assert(termById !== null && termById.term === 'Dyspnea', 'getTermById retrieved term_7 (Dyspnea)');

// ----------------------------------------------------
// TEST SUITE 4: Medical Terminology Simplifier Logic
// ----------------------------------------------------
console.log('\nTest Suite 4: Medical Terminology Simplifier Engine');

// 4a: Exact single term lookup
const exactResult = simplifyMedicalText('Hypertension');
assert(exactResult.fallback === false, 'Exact term lookup succeeded without fallback');
assert(exactResult.matches.length === 1, 'Matched exactly 1 term');
assert(exactResult.matches[0].term === 'Hypertension', 'Matched term is Hypertension');
assert(exactResult.matches[0].plainDefinition.includes('high blood pressure'), 'Definition translates into plain English');

// 4b: Sentence parsing with embedded medical term
const sentenceInput = 'The nurse mentioned I have mild edema in my legs and noted dyspnea after walking.';
const sentenceResult = simplifyMedicalText(sentenceInput);
assert(sentenceResult.fallback === false, 'Sentence parsing succeeded without fallback');
assert(sentenceResult.matches.length >= 2, `Sentence matched multiple terms (found ${sentenceResult.matches.length})`);
const foundEdema = sentenceResult.matches.some((m) => m.term === 'Edema');
const foundDyspnea = sentenceResult.matches.some((m) => m.term === 'Dyspnea');
assert(foundEdema && foundDyspnea, 'Detected both "Edema" and "Dyspnea" in complex sentence');

// 4c: Unknown term safe fallback
const unknownResult = simplifyMedicalText('pseudomyxoma_complex_xyz');
assert(unknownResult.fallback === true, 'Unknown term safely triggered fallback mode');
assert(unknownResult.matches.length === 0, 'No false matches returned for unknown term');
assert(unknownResult.fallbackMessage.includes('could not find a verified definition'), 'Fallback contains clear non-fabrication notice');
assert(unknownResult.recommendedAction.includes('asking your doctor'), 'Fallback provides safe recommendation to ask a doctor');

// 4d: Empty input handling
const emptyResult = simplifyMedicalText('   ');
assert(emptyResult.matches.length === 0 && emptyResult.fallback === false, 'Blank input handled safely without errors');

// ----------------------------------------------------
// SUMMARY
// ----------------------------------------------------
console.log('\n================================================================');
console.log(`🏁 PHASE 6 TEST RESULTS: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('================================================================\n');

if (passedTests === totalTests) {
  process.exit(0);
} else {
  process.exit(1);
}
