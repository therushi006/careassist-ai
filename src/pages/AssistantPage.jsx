import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SUGGESTED_PROMPTS = [
  {
    title: 'Preparing for an Annual Physical',
    query: 'What should I bring and ask during my annual physical checkup?',
  },
  {
    title: 'Questions for a Specialist Visit',
    query: 'How do I clearly present my symptom history to a new specialist?',
  },
  {
    title: 'Routine Blood Test Preparation',
    query: 'What are the fasting rules and key questions for lab blood work?',
  },
  {
    title: 'New Prescription Safety',
    query: 'What 4 core questions should I ask before starting a new medication?',
  },
];

/**
 * Deterministic, rule-guided response generator.
 * Transparently simulated — does NOT use a live AI model.
 */
function getSimulatedResponse(query) {
  const q = (query || '').toLowerCase().trim();

  // Safety trigger: Diagnostic refusal
  if (
    q.includes('diagnose') ||
    q.includes('do i have') ||
    q.includes('what disease') ||
    q.includes('is it cancer') ||
    q.includes('am i sick')
  ) {
    return {
      type: 'safety_refusal',
      badge: 'Safety Refusal • Non-Diagnostic System',
      text: 'CareAssist AI is an appointment preparation and health literacy platform. It cannot evaluate symptoms, interpret medical scans, or provide clinical diagnoses. Medical diagnosis requires examination by a licensed physician.\n\nIf you are experiencing new or concerning symptoms, we recommend noting down when they began and bringing them to your primary care doctor. In case of acute emergencies (severe chest pain, difficulty breathing, sudden numbness), call 911 immediately.',
      actionLink: '/prep',
      actionText: 'Structure Symptoms for Doctor Visit',
    };
  }

  // Topic: Annual Physical
  if (q.includes('physical') || q.includes('annual') || q.includes('checkup')) {
    return {
      type: 'informational',
      badge: 'Visit Preparation Guide',
      text: `Here is a structured strategy for your annual physical:\n\n1. **Medication & Supplement List**: Carry an exact list of all daily prescriptions, over-the-counter vitamins, and herbs with dosages.\n2. **Family History Updates**: Inform your physician of any newly diagnosed conditions in parents or siblings.\n3. **Top 2 Concerns**: Write down your primary questions in advance so they are covered before time runs out.\n4. **Preventive Screenings**: Ask which screenings (lipid panel, fasting blood glucose, mammogram, colonoscopy) you are due for based on your age and risk factors.`,
      actionLink: '/prep',
      actionText: 'Build Annual Physical Agenda in Prep Tool',
    };
  }

  // Topic: Blood work & Lab tests
  if (q.includes('blood') || q.includes('lab') || q.includes('test') || q.includes('fasting')) {
    return {
      type: 'informational',
      badge: 'Diagnostics & Lab Preparation',
      text: `Key reminders when preparing for routine blood work:\n\n• **Fasting Requirements**: Verify whether your panel requires 8–12 hours of fasting (common for lipid panels and fasting glucose). Drink plenty of plain water—hydration plumps up veins and makes collection smoother.\n• **Medication Schedule**: Ask if morning pills should be taken before or after the blood draw.\n• **Questions for Doctor**:\n  1. "Are any of my counts outside the standard reference range?"\n  2. "If a marker is slightly elevated, what lifestyle factors could contribute to that?"\n  3. "When will these results appear on my patient portal?"`,
      actionLink: '/library',
      actionText: 'Read Full Lab Blood Work Guide in Library',
    };
  }

  // Topic: Specialist Visit
  if (q.includes('specialist') || q.includes('referral') || q.includes('cardiologist') || q.includes('neurologist')) {
    return {
      type: 'informational',
      badge: 'Specialist Communication Guide',
      text: `Specialists have tightly scheduled windows. Make every minute count:\n\n1. **Bring Prior Records**: Bring physical copies or CDs of past blood work and imaging so tests are not needlessly repeated.\n2. **Chronological Timeline**: Present your symptom onset clearly: when it started, how often it occurs, and what makes it better or worse.\n3. **Care Coordination**: Ask: "Will you be managing my prescriptions directly, or sending recommendations back to my primary care doctor?"\n4. **Next Steps**: Ask: "If this initial evaluation is inconclusive, what diagnostic steps do you recommend next?"`,
      actionLink: '/prep',
      actionText: 'Create Specialist Discussion Agenda',
    };
  }

  // Topic: Medications
  if (q.includes('medication') || q.includes('prescription') || q.includes('drug') || q.includes('pill')) {
    return {
      type: 'informational',
      badge: 'Medication Safety Checklist',
      text: `Always clarify these 4 core questions with your doctor and pharmacist before starting a new medication:\n\n1. **Name & Purpose**: "What is the exact name, strength, and therapeutic goal of this medication?"\n2. **Dosing & Timing**: "Should I take this with meals, at bedtime, or on an empty stomach? Can the tablet be split?"\n3. **Interactions**: "Could this interact with any of my current supplements, vitamins, coffee, or alcohol?"\n4. **Side Effects & Red Flags**: "What are mild expected adjustments versus acute symptoms that require stopping the medication immediately?"`,
      actionLink: '/notes',
      actionText: 'Record Medication Instructions in Visit Notes',
    };
  }

  // Fallback: General Doctor Visit Prep Advice
  return {
    type: 'general',
    badge: 'General Healthcare Preparation',
    text: `Here is a patient-empowerment framework to prepare for your inquiry:\n\n• **Clarify Your Chief Goal**: What is the single most important outcome you need from this appointment (e.g., pain relief, a diagnosis, a test order, or a medication change)?\n• **Document Details**: Note the duration, intensity, and impact on your sleep or daily work.\n• **Ask for Written Instructions**: Ask your doctor to summarize their recommendations before you leave the room.\n\nWould you like to build a structured discussion agenda using our Appointment Prep tool?`,
    actionLink: '/prep',
    actionText: 'Start Appointment Preparation Sheet',
  };
}

export default function AssistantPage() {
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      badge: 'Simulated Assistant • Rule-Guided Mode',
      text: 'Hello! I am your CareAssist Healthcare Information Assistant.\n\nI can help you prepare questions for your doctor, understand visit workflows, review blood test instructions, and formulate clear agendas for your next appointment.\n\n**Note**: I use transparent, deterministic rule-based guidance. I am not a live AI clinician and cannot diagnose medical conditions or prescribe treatment.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSendMessage = (queryText) => {
    const textToSend = typeof queryText === 'string' ? queryText : inputQuery;
    if (!textToSend.trim()) return;

    const userMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: textToSend.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate responsive brief pause
    setTimeout(() => {
      const simulated = getSimulatedResponse(textToSend);
      const assistantMessage = {
        id: `asst_${Date.now()}`,
        sender: 'assistant',
        badge: simulated.badge,
        text: simulated.text,
        actionLink: simulated.actionLink,
        actionText: simulated.actionText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 400);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: 'welcome_reset',
        sender: 'assistant',
        badge: 'Simulated Assistant • Rule-Guided Mode',
        text: 'Chat history cleared. How can I assist you with your upcoming doctor visit preparation today?',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary text-white">Interactive Health Guide</span>
            <span className="badge-simulated px-2 py-1 rounded">
              Rule-Guided Demo • Zero Live AI Claims
            </span>
          </div>
          <h2 className="fw-bold text-navy mb-0">Health Information Assistant</h2>
        </div>

        <button
          type="button"
          className="btn btn-outline-secondary btn-sm"
          onClick={handleClearChat}
        >
          <i className="bi bi-arrow-counterclockwise me-1"></i> Reset Conversation
        </button>
      </div>

      {/* Safety Notice */}
      <div className="alert alert-light border border-light-subtle shadow-sm py-2 px-3 small d-flex align-items-center mb-4">
        <i className="bi bi-shield-check text-success fs-5 me-2 flex-shrink-0"></i>
        <span className="text-secondary">
          <strong>Transparency Notice:</strong> This assistant generates deterministic guidance mapped to common doctor visit scenarios. It does not provide medical diagnoses or replace clinical care. All responses run locally in your browser.
        </span>
      </div>

      {/* Chat Container */}
      <div className="card border-0 shadow-sm app-card mb-4" style={{ minHeight: '480px' }}>
        {/* Messages List */}
        <div
          className="card-body p-3 p-md-4 d-flex flex-column gap-3 overflow-auto"
          style={{ maxHeight: '520px', minHeight: '360px', backgroundColor: '#f8fafc' }}
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`d-flex flex-column ${
                msg.sender === 'user' ? 'align-items-end' : 'align-items-start'
              }`}
            >
              {/* Message Meta */}
              <div className="d-flex align-items-center gap-2 mb-1 px-1">
                {msg.sender === 'assistant' ? (
                  <>
                    <span className="badge bg-primary text-white small" style={{ fontSize: '0.72rem' }}>
                      <i className="bi bi-robot me-1"></i> CareAssist Assistant
                    </span>
                    {msg.badge && (
                      <span className="badge-simulated px-2 py-0 rounded" style={{ fontSize: '0.7rem' }}>
                        {msg.badge}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="badge bg-secondary text-white small" style={{ fontSize: '0.72rem' }}>
                    <i className="bi bi-person-fill me-1"></i> You
                  </span>
                )}
                <span className="text-muted small" style={{ fontSize: '0.7rem' }}>
                  {msg.timestamp}
                </span>
              </div>

              {/* Message Bubble */}
              <div
                className={`p-3 rounded-3 shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-white text-dark border border-light-subtle'
                }`}
                style={{
                  maxWidth: '85%',
                  whiteSpace: 'pre-line',
                  lineHeight: '1.5',
                  fontSize: '0.92rem',
                }}
              >
                {msg.text}

                {/* Call-to-action button if attached */}
                {msg.actionLink && msg.actionText && (
                  <div className="mt-3 pt-2 border-top border-light-subtle">
                    <Link to={msg.actionLink} className="btn btn-sm btn-outline-primary fw-semibold">
                      {msg.actionText} <i className="bi bi-arrow-right ms-1"></i>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="d-flex align-items-center gap-2 text-muted small p-2">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Thinking...</span>
              </div>
              <span>Formulating visit preparation recommendations...</span>
            </div>
          )}
        </div>

        {/* Suggested Prompt Chips */}
        <div className="p-3 bg-white border-top border-light-subtle">
          <span className="small text-muted d-block mb-2">Suggested visit preparation queries:</span>
          <div className="d-flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                type="button"
                className="btn btn-sm btn-light border text-navy rounded-pill py-1 px-3 small"
                onClick={() => handleSendMessage(prompt.query)}
              >
                <i className="bi bi-lightbulb me-1 text-warning"></i>
                {prompt.title}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="card-footer bg-light border-top border-light-subtle p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="input-group"
          >
            <input
              type="text"
              className="form-control"
              placeholder="Ask about visit preparation, test fasting rules, questions for specialists..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              disabled={isTyping}
            />
            <button
              type="submit"
              className="btn btn-primary px-4"
              disabled={!inputQuery.trim() || isTyping}
            >
              <i className="bi bi-send-fill me-1"></i> Send
            </button>
          </form>
          <div className="text-muted small mt-2" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-shield-lock me-1 text-success"></i>
            Responses are generated deterministically in your browser. No queries are transmitted to external servers.
          </div>
        </div>
      </div>
    </div>
  );
}
