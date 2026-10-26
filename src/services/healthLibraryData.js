/**
 * healthLibraryData.js
 * Curated educational dataset for healthcare literacy and doctor visit preparation.
 * 
 * Safety & Compliance Notice:
 * This content is prepared as general educational reference material.
 * It has NOT undergone clinical review by a certified healthcare board and must NOT be used
 * as clinical diagnosis or personalized medical guidance.
 */

export const HEALTH_LIBRARY_METADATA = {
  version: '1.0.0',
  disclaimer: 'General educational reference for health literacy and appointment preparation. Not clinically reviewed; does not replace qualified medical advice.',
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
    plainDefinition: 'A preventive measure, medication, or procedure intended to defend against disease rather than treat an already established infection or illness.',
    whyItMatters: 'Examples include vaccinations, preventive antibiotics before surgery, or daily baby aspirin for specific cardiovascular profiles.',
    doctorQuestions: [
      'What are the potential side effects versus the preventive benefit of this prophylactic regimen?',
      'How long do I need to remain on this preventive therapy?',
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
    summary: 'A structured checklist of records to bring, questions to prioritize, and screenings to discuss with your primary care doctor.',
    keyPoints: [
      'Compile an accurate list of all daily prescriptions, over-the-counter vitamins, and supplements with exact dosages.',
      'Document any new family health events (e.g., a sibling or parent diagnosed with diabetes or heart issues).',
      'Write down your top 2-3 health concerns beforehand so they are addressed first before exam time runs out.',
      'Ask which age-appropriate preventive screenings (e.g., lipid panel, mammogram, colonoscopy) are due this year.',
    ],
  },
  {
    id: 'guide_2',
    title: 'Getting Ready for Routine Lab Blood Work',
    category: 'Diagnostics',
    readTime: '2 min read',
    summary: 'Essential instructions on fasting rules, hydration, and clarifying what test markers mean.',
    keyPoints: [
      'Confirm whether your blood panel requires 8 to 12 hours of fasting (no food or drinks other than plain water).',
      'Drink plenty of plain water before your blood draw—well-hydrated veins make the needle insertion quicker and more comfortable.',
      'Ask the clinic how long processing will take and whether results will be sent to your patient portal.',
      'Request a copy of the lab report and note down any flagged abnormal values to discuss at your follow-up.',
    ],
  },
  {
    id: 'guide_3',
    title: 'Maximizing Your First Visit With a Specialist',
    category: 'Specialist Consultation',
    readTime: '4 min read',
    summary: 'Specialists have tightly focused appointment windows. Here is how to present your symptom history clearly.',
    keyPoints: [
      'Bring copies of prior test reports, imaging CDs, and blood work so the specialist does not have to re-order them.',
      'Present a chronological symptom timeline: when it started, how often it occurs, and what makes it better or worse.',
      'Clarify who will manage your ongoing care: will the specialist handle prescriptions, or will they send instructions back to your primary doctor?',
      'Ask: "What are the next diagnostic steps if current tests come back inconclusive?"',
    ],
  },
  {
    id: 'guide_4',
    title: 'Questions to Ask When Prescribed a New Medication',
    category: 'Medication Safety',
    readTime: '3 min read',
    summary: 'Protect against drug interactions and side effects by asking your prescriber and pharmacist four core questions.',
    keyPoints: [
      'What is the specific name, strength, and therapeutic purpose of this medication?',
      'Should I take this with meals, at bedtime, or on an empty stomach?',
      'What are common temporary side effects versus red-flag symptoms that require stopping the medication immediately?',
      'Could this interact with any of my current supplements, coffee, alcohol, or other prescriptions?',
    ],
  },
];

// Helper functions for easy querying
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
