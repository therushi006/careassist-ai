/**
 * healthLibraryData.js
 * Curated educational dataset for healthcare literacy, medical terminology simplification,
 * and doctor visit preparation.
 * 
 * Safety & Compliance Notice:
 * - This content is prepared as general educational reference material.
 * - It has NOT undergone clinical board review by a certified healthcare board and must NOT be used
 *   as clinical diagnosis, medical prescription, or individual emergency triage.
 * - All simplification logic is deterministic and dictionary-driven; it does NOT use a live AI model.
 */

export const HEALTH_LIBRARY_METADATA = {
  version: '1.2.0',
  disclaimer: 'General educational reference for health literacy and appointment preparation. Not clinically reviewed; does not replace qualified medical advice.',
  source: 'Curated General Healthcare Literacy Reference',
  reviewStatus: 'Educational Draft (Not Clinically Reviewed)',
  lastUpdated: '2026-10-26',
};

/**
 * Common medical terminology translated into plain, patient-friendly English.
 */
export const MEDICAL_TERMS = [
  {
    id: 'term_1',
    term: 'Hypertension',
    phonetic: 'hy-per-TEN-shun',
    category: 'Cardiovascular',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'Consistently high blood pressure against the walls of your arteries. Often called a "silent condition" because it rarely causes noticeable symptoms on its own.',
    whyItMatters: 'Over time, unmanaged high blood pressure can strain your heart, blood vessels, and kidneys.',
    doctorQuestions: [
      'What was my reading today, and what is my target blood pressure number?',
      'Do you recommend monitoring my blood pressure at home, and which cuff type is best?',
      'Are there specific dietary changes (like sodium intake) that could help lower my numbers?',
    ],
  },
  {
    id: 'term_2',
    term: 'Lipid Panel',
    phonetic: 'LIP-id PAN-ul',
    category: 'Lab Tests',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'A routine blood test that measures the amount of specific fats (cholesterol and triglycerides) in your bloodstream.',
    whyItMatters: 'Helps evaluate cardiovascular health and assess your risk for arterial plaque buildup or heart disease.',
    doctorQuestions: [
      'What do my LDL ("bad") and HDL ("good") cholesterol numbers indicate?',
      'Did I need to fast before this test, and would fasting change the results?',
      'Should we address this through lifestyle adjustments first, or is medication indicated?',
    ],
  },
  {
    id: 'term_3',
    term: 'Acute vs. Chronic',
    phonetic: 'uh-KYOOT vs KRON-ik',
    category: 'General Clinical Terms',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: '"Acute" means a condition that starts suddenly and typically lasts a short time (e.g., a sprained ankle or strep throat). "Chronic" means a condition that develops slowly and persists long-term (e.g., asthma or arthritis).',
    whyItMatters: 'Knowing whether an illness is acute or chronic helps you understand treatment goals—curing an infection vs. managing long-term symptoms.',
    doctorQuestions: [
      'Is this an acute flare-up or an indicator of an underlying chronic condition?',
      'How long should I expect symptoms to last before seeking another evaluation?',
    ],
  },
  {
    id: 'term_4',
    term: 'Complete Blood Count (CBC)',
    phonetic: 'kum-PLEET blud kownt',
    category: 'Lab Tests',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'A common blood test that evaluates your overall health and detects a wide range of conditions by counting red cells, white cells, and platelets.',
    whyItMatters: 'Identifies signs of anemia, active infections, clotting issues, and immune system response.',
    doctorQuestions: [
      'Are any of my red or white blood cell counts outside the reference range?',
      'If any numbers are slightly high or low, what might be causing that fluctuation?',
    ],
  },
  {
    id: 'term_5',
    term: 'Ambulatory',
    phonetic: 'AM-byuh-luh-tor-ee',
    category: 'Clinical Settings',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'Refers to medical care provided on an outpatient basis, meaning you walk in, receive treatment or a procedure, and leave the same day without an overnight hospital stay.',
    whyItMatters: 'Clarifies that you will not be admitted to an inpatient hospital bed.',
    doctorQuestions: [
      'Will I need someone to drive me home after this ambulatory procedure?',
      'What are my recovery instructions for the first 24 hours at home?',
    ],
  },
  {
    id: 'term_6',
    term: 'Benign vs. Malignant',
    phonetic: 'buh-NINE vs muh-LIG-nunt',
    category: 'Pathology & Tissue',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: '"Benign" refers to a growth or condition that is non-cancerous and does not spread to other parts of the body. "Malignant" describes cells that are cancerous, invade nearby tissue, and can spread.',
    whyItMatters: 'Provides immediate clarity on whether a biopsy finding or growth presents an invasive cancer risk.',
    doctorQuestions: [
      'Does a benign result still require ongoing monitoring or follow-up imaging?',
      'What specific signs or changes should prompt me to come back for a re-check?',
    ],
  },
  {
    id: 'term_7',
    term: 'Dyspnea',
    phonetic: 'disp-NEE-uh',
    category: 'Respiratory',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'The clinical term for shortness of breath, labored breathing, or feeling like you cannot draw enough air into your lungs.',
    whyItMatters: 'Dyspnea can stem from respiratory, cardiac, allergic, or anxiety-related causes and always warrants careful evaluation.',
    doctorQuestions: [
      'Does this shortness of breath correspond to my heart, lungs, or an allergic reaction?',
      'What warning signs would mean I should go straight to urgent care or the emergency department?',
    ],
  },
  {
    id: 'term_8',
    term: 'Prophylactic',
    phonetic: 'pro-fuh-LAK-tik',
    category: 'Preventive Care',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'A preventive measure, medication, or procedure intended to defend against disease rather than treat an already established infection or illness.',
    whyItMatters: 'Examples include vaccinations, preventive antibiotics before surgery, or daily baby aspirin for specific cardiovascular profiles.',
    doctorQuestions: [
      'What are the potential side effects versus the preventive benefit of this prophylactic regimen?',
      'How long do I need to remain on this preventive therapy?',
    ],
  },
  {
    id: 'term_9',
    term: 'Edema',
    phonetic: 'ih-DEE-muh',
    category: 'Cardiovascular & Renal',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'Swelling caused by excess fluid trapped in your body\'s tissues, most frequently noticeable in feet, ankles, legs, or hands.',
    whyItMatters: 'Can indicate heart, liver, or kidney circulation imbalances, or medication side effects.',
    doctorQuestions: [
      'What is the underlying reason for fluid accumulating in my lower extremities?',
      'Should I wear compression socks, and are there specific salt restrictions I should follow?',
    ],
  },
  {
    id: 'term_10',
    term: 'Neuropathy',
    phonetic: 'noo-ROP-uh-thee',
    category: 'Neurology',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    plainDefinition: 'Nerve damage that typically causes weakness, numbness, tingling, or burning sensations, often starting in hands and feet.',
    whyItMatters: 'Commonly linked to diabetes, vitamin deficiencies, repetitive stress, or chemotherapy.',
    doctorQuestions: [
      'Is my nerve tingling reversible, or are we aiming to prevent progression?',
      'What safety steps should I take to protect my feet if I have diminished sensation?',
    ],
  },
];

/**
 * Educational Appointment Preparation Guides
 */
export const HEALTH_GUIDES = [
  {
    id: 'guide_1',
    title: 'Preparing for Your Annual Physical Exam',
    category: 'Checkup & Preventive',
    readTime: '3 min read',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    summary: 'A structured checklist of records to bring, questions to prioritize, and screenings to discuss with your primary care doctor.',
    detailedContent: `An annual physical is a comprehensive preventive checkup designed to review your overall health baseline, identify early warning signs before they become symptomatic, and update your personal preventive plan.

### Key Focus Areas:
1. **Medication & Supplement Reconciliation**: Bring a complete list of every prescription, over-the-counter vitamin, and herbal supplement with exact strengths.
2. **Family History Updates**: Inform your doctor of any recent illnesses diagnosed in first-degree relatives (parents, siblings, children).
3. **Preventive Screenings**: Inquire which age-based screenings you are due for (blood lipid panels, diabetes checks, cancer screenings like mammograms or colonoscopies).
4. **Vaccination Updates**: Check status of annual flu, tetanus (Tdap), shingles, and pneumonia immunizations.`,
    keyPoints: [
      'Compile an accurate list of all daily prescriptions, over-the-counter vitamins, and supplements with exact dosages.',
      'Document any new family health events (e.g., a sibling or parent diagnosed with diabetes or heart issues).',
      'Write down your top 2-3 health concerns beforehand so they are addressed first before exam time runs out.',
      'Ask which age-appropriate preventive screenings (e.g., lipid panel, mammogram, colonoscopy) are due this year.',
    ],
    discussionChecklist: [
      'What are my current numbers (blood pressure, BMI, resting pulse)?',
      'Are there specific lifestyle changes that would benefit my current health baseline?',
      'When should my next routine blood work occur?',
    ],
  },
  {
    id: 'guide_2',
    title: 'Getting Ready for Routine Lab Blood Work',
    category: 'Diagnostics',
    readTime: '2 min read',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    summary: 'Essential instructions on fasting rules, hydration, and clarifying what test markers mean.',
    detailedContent: `Laboratory blood tests are essential diagnostic tools that provide insight into organ function, blood composition, and metabolic markers. Preparing correctly ensures lab accuracy and prevents need for repeat blood draws.

### Preparation Checklist:
- **Fasting Protocols**: Confirm whether your panel requires 8 to 12 hours of fasting (e.g., lipid panels or fasting glucose).
- **Water Hydration**: Drink ample plain water. Hydration plumps up veins, making blood collection faster and less uncomfortable.
- **Medication Timing**: Ask whether regular morning medications should be taken before or immediately following the blood draw.`,
    keyPoints: [
      'Confirm whether your blood panel requires 8 to 12 hours of fasting (no food or drinks other than plain water).',
      'Drink plenty of plain water before your blood draw—well-hydrated veins make the needle insertion quicker and more comfortable.',
      'Ask the clinic how long processing will take and whether results will be sent to your patient portal.',
      'Request a copy of the lab report and note down any flagged abnormal values to discuss at your follow-up.',
    ],
    discussionChecklist: [
      'Do any of my results fall outside the normal laboratory reference range?',
      'If a marker is borderline, does it require re-testing or immediate intervention?',
      'Can I review the raw lab report on my patient portal?',
    ],
  },
  {
    id: 'guide_3',
    title: 'Maximizing Your First Visit With a Specialist',
    category: 'Specialist Consultation',
    readTime: '4 min read',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    summary: 'Specialists have tightly focused appointment windows. Here is how to present your symptom history clearly.',
    detailedContent: `Specialist consultations (such as cardiology, neurology, or orthopedics) often have limited appointment durations. Presenting structured clinical history maximizes diagnostic efficiency.

### What to Prepare:
1. **Prior Records**: Carry printed summaries of previous imaging, lab work, and notes from your primary care physician.
2. **Symptom Timeline**: Present when symptoms began, whether they are worsening, and specific triggers.
3. **Care Coordination**: Establish whether the specialist or your primary doctor will be managing future refills.`,
    keyPoints: [
      'Bring copies of prior test reports, imaging CDs, and blood work so the specialist does not have to re-order them.',
      'Present a chronological symptom timeline: when it started, how often it occurs, and what makes it better or worse.',
      'Clarify who will manage your ongoing care: will the specialist handle prescriptions, or will they send instructions back to your primary doctor?',
      'Ask: "What are the next diagnostic steps if current tests come back inconclusive?"',
    ],
    discussionChecklist: [
      'What are the most likely causes for my condition?',
      'Are there conservative or non-invasive management approaches we should try first?',
      'When will you send your visit notes to my primary care doctor?',
    ],
  },
  {
    id: 'guide_4',
    title: 'Questions to Ask When Prescribed a New Medication',
    category: 'Medication Safety',
    readTime: '3 min read',
    source: 'General Healthcare Literacy Reference',
    reviewStatus: 'Not Clinically Reviewed',
    summary: 'Protect against drug interactions and side effects by asking your prescriber and pharmacist four core questions.',
    detailedContent: `Starting a new prescription requires understanding both benefits and precautions. Taking an active role in medication reviews significantly reduces adverse drug reactions.

### Core Safety Checks:
- **Drug & Food Interactions**: Always verify whether grapefruit, alcohol, caffeine, or specific supplements (like St. John's Wort or iron) interfere with the medication.
- **Dosing Instructions**: Clarify whether pills can be crushed or split, and whether to take with food or on an empty stomach.
- **Missed Doses**: Ask what to do if you forget a scheduled dose.`,
    keyPoints: [
      'What is the specific name, strength, and therapeutic purpose of this medication?',
      'Should I take this with meals, at bedtime, or on an empty stomach?',
      'What are common temporary side effects versus red-flag symptoms that require stopping the medication immediately?',
      'Could this interact with any of my current supplements, coffee, alcohol, or other prescriptions?',
    ],
    discussionChecklist: [
      'How soon should I expect to see an improvement in my symptoms?',
      'What is the planned duration of this medication (short-term vs lifelong)?',
      'Is there an affordable generic equivalent available?',
    ],
  },
];

// ----------------------------------------------------
// QUERY & SIMPLIFICATION FUNCTIONS
// ----------------------------------------------------

export function searchMedicalTerms(query = '') {
  const clean = query.trim().toLowerCase();
  if (!clean) return MEDICAL_TERMS;
  return MEDICAL_TERMS.filter(
    (item) =>
      item.term.toLowerCase().includes(clean) ||
      item.plainDefinition.toLowerCase().includes(clean) ||
      item.category.toLowerCase().includes(clean)
  );
}

export function getTermById(id) {
  return MEDICAL_TERMS.find((t) => t.id === id) || null;
}

export function searchHealthGuides(query = '') {
  const clean = query.trim().toLowerCase();
  if (!clean) return HEALTH_GUIDES;
  return HEALTH_GUIDES.filter(
    (item) =>
      item.title.toLowerCase().includes(clean) ||
      item.summary.toLowerCase().includes(clean) ||
      item.category.toLowerCase().includes(clean)
  );
}

export function getGuideById(id) {
  return HEALTH_GUIDES.find((g) => g.id === id) || null;
}

/**
 * Deterministic Medical Terminology Simplifier.
 * Analyzes a term or sentence against the curated verified dictionary.
 * Does NOT use an AI model; uses transparent keyword and phrase matching.
 * 
 * @param {string} input - Medical term or short sentence entered by user
 * @returns {Object} { matches: Array, rawQuery: string, fallback: boolean, fallbackMessage?: string }
 */
export function simplifyMedicalText(input = '') {
  const cleanInput = (input || '').trim().toLowerCase();
  if (!cleanInput) {
    return {
      rawQuery: '',
      matches: [],
      fallback: false,
    };
  }

  // 1. Check for exact term matches or terms appearing in the sentence
  const matchedTerms = MEDICAL_TERMS.filter((termObj) => {
    const termClean = termObj.term.toLowerCase();
    // Direct match or sentence contains term
    if (cleanInput === termClean) return true;
    if (cleanInput.includes(termClean)) return true;

    // Check individual keywords for combined terms (e.g. "CBC", "Lipid", "Hypertension", "Edema")
    const words = termClean.split(/[\s/()]+/).filter((w) => w.length > 3);
    return words.some((w) => cleanInput.includes(w.toLowerCase()));
  });

  if (matchedTerms.length > 0) {
    return {
      rawQuery: input.trim(),
      matches: matchedTerms,
      fallback: false,
    };
  }

  // 2. Safe Fallback when no match exists in curated dictionary
  return {
    rawQuery: input.trim(),
    matches: [],
    fallback: true,
    fallbackMessage: `We could not find a verified definition for "${input.trim()}" in our basic terminology dictionary. Medical language and clinical abbreviations vary widely across specialties.`,
    recommendedAction: 'We recommend writing down this specific term and asking your doctor, physician assistant, or pharmacist: "Could you explain what this word means in the context of my care?"',
  };
}
