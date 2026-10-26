/**
 * questionGeneratorService.js
 * Rule-based, transparent question generator for doctor visits.
 * 
 * Safety & Transparency Notice:
 * - This service uses deterministic, rule-based heuristics to formulate patient communication questions.
 * - It does NOT use a live AI model.
 * - It does NOT diagnose conditions, recommend treatments, or make clinical assessments.
 */

export const QUESTION_CATEGORIES = {
  CLARIFICATION: 'Understanding & Diagnosis Clarification',
  TESTS: 'Diagnostic Tests & Investigations',
  TREATMENT: 'Treatment & Daily Management Options',
  FOLLOWUP: 'Monitoring, Follow-up & Red Flags',
};

/**
 * Generate high-value, organized questions based on patient's reported entries.
 * @param {Object} prepData
 * @param {string} prepData.visitType
 * @param {string} prepData.chiefConcern
 * @param {Object} prepData.symptoms
 * @param {Array<string>} prepData.goals
 * @returns {Array<Object>} List of question objects
 */
export function generateDoctorQuestions(prepData = {}) {
  const {
    visitType = '',
    chiefConcern = '',
    symptoms = {},
    goals = [],
  } = prepData;

  const concernLower = (chiefConcern || '').toLowerCase();
  const descLower = (symptoms.description || '').toLowerCase();
  const durationLower = (symptoms.onset || '').toLowerCase();
  const severityLower = (symptoms.severity || '').toLowerCase();
  const impactLower = (symptoms.impact || '').toLowerCase();

  const questions = [];

  const addQ = (text, category) => {
    // Avoid duplicate texts
    if (!questions.some((q) => q.text.toLowerCase() === text.toLowerCase())) {
      questions.push({
        id: `q_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        text,
        category,
        checked: true,
      });
    }
  };

  // 1. Foundational Questions based on Chief Concern
  if (chiefConcern.trim()) {
    addQ(
      `Based on my symptoms of "${chiefConcern.trim()}", what potential causes or conditions are at the top of your differential list?`,
      QUESTION_CATEGORIES.CLARIFICATION
    );
  } else {
    addQ(
      'What are the primary factors that might be contributing to what I am experiencing?',
      QUESTION_CATEGORIES.CLARIFICATION
    );
  }

  // 2. Timeline & Duration Rules
  if (
    durationLower.includes('week') ||
    durationLower.includes('month') ||
    durationLower.includes('year') ||
    durationLower.includes('chronic') ||
    durationLower.includes('ongoing')
  ) {
    addQ(
      `Because this has been persisting for ${symptoms.onset || 'an extended period'}, is this consistent with a chronic issue or an ongoing flare-up?`,
      QUESTION_CATEGORIES.CLARIFICATION
    );
    addQ(
      'Should we consider baseline imaging, blood panels, or specialized diagnostic tests given the duration?',
      QUESTION_CATEGORIES.TESTS
    );
  } else {
    addQ(
      'What is the typical timeline for these symptoms to improve with appropriate care?',
      QUESTION_CATEGORIES.FOLLOWUP
    );
  }

  // 3. Severity & Daily Impact Rules
  if (
    severityLower.includes('severe') ||
    severityLower.includes('8') ||
    severityLower.includes('9') ||
    severityLower.includes('10') ||
    severityLower.includes('high')
  ) {
    addQ(
      'What are safe, short-term ways to manage the intensity of this discomfort while we investigate the underlying cause?',
      QUESTION_CATEGORIES.TREATMENT
    );
    addQ(
      'What specific acute red-flag symptoms would mean I should seek urgent medical evaluation or visit an emergency room?',
      QUESTION_CATEGORIES.FOLLOWUP
    );
  }

  if (symptoms.impact && symptoms.impact.trim()) {
    addQ(
      `These symptoms are currently impacting my daily routine (${symptoms.impact.trim()}). Are there temporary activity or ergonomic adjustments you recommend?`,
      QUESTION_CATEGORIES.TREATMENT
    );
  }

  // 4. Triggers & Relieving Factors
  if (symptoms.triggers && symptoms.triggers.trim()) {
    addQ(
      `I noticed that ${symptoms.triggers.trim()} seems to aggravate my symptoms. Does this trigger point toward any specific mechanism or condition?`,
      QUESTION_CATEGORIES.CLARIFICATION
    );
  }

  if (symptoms.relievingFactors && symptoms.relievingFactors.trim()) {
    addQ(
      `I have noticed some temporary relief from ${symptoms.relievingFactors.trim()}. Is it safe to continue this approach in the meantime?`,
      QUESTION_CATEGORIES.TREATMENT
    );
  }

  // 5. Tests & Investigations
  addQ(
    'Are there specific diagnostic tests, lab panels, or scans needed to give us a definitive answer?',
    QUESTION_CATEGORIES.TESTS
  );

  addQ(
    'If tests are ordered, how will I receive the results, and who should I follow up with if I have questions?',
    QUESTION_CATEGORIES.TESTS
  );

  // 6. Treatment Options & Side Effects
  addQ(
    'What are the non-medication or lifestyle modifications we should explore alongside any recommended treatment?',
    QUESTION_CATEGORIES.TREATMENT
  );

  addQ(
    'If a new medication or therapy is recommended, what are the most common side effects and what should I monitor?',
    QUESTION_CATEGORIES.TREATMENT
  );

  // 7. Follow-up & Next Milestones
  addQ(
    'When should I schedule a follow-up visit to review my progress or re-evaluate?',
    QUESTION_CATEGORIES.FOLLOWUP
  );

  // 8. Custom Goals Check
  if (Array.isArray(goals) && goals.length > 0) {
    goals.forEach((goal) => {
      if (goal && typeof goal === 'string' && goal.trim()) {
        addQ(`Goal: Can we make sure we discuss: "${goal.trim()}"?`, QUESTION_CATEGORIES.CLARIFICATION);
      }
    });
  }

  return questions;
}
