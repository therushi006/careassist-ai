import React, { useState } from 'react';
import { simplifyMedicalText, MEDICAL_TERMS } from '../../services/healthLibraryData';

const SAMPLE_TERMS = [
  'Hypertension',
  'Lipid Panel',
  'Dyspnea',
  'Edema',
  'Ambulatory',
  'Benign vs. Malignant',
  'Neuropathy',
  'My doctor mentioned acute vs chronic symptoms and dyspnea',
];

export default function MedicalTermSimplifier() {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState(null);

  const handleSimplify = (textToAnalyze) => {
    const text = typeof textToAnalyze === 'string' ? textToAnalyze : inputText;
    if (!text.trim()) {
      setResult(null);
      return;
    }
    const simplification = simplifyMedicalText(text);
    setResult(simplification);
  };

  const handleSelectSample = (sample) => {
    setInputText(sample);
    handleSimplify(sample);
  };

  const handleClear = () => {
    setInputText('');
    setResult(null);
  };

  return (
    <div className="card border-0 shadow-sm app-card p-4 mb-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-info text-dark">Health Literacy Tool</span>
            <span className="badge-simulated px-2 py-1 rounded">
              Rule-Based Dictionary • Not a Live AI Model
            </span>
          </div>
          <h4 className="fw-bold text-navy mb-1">Medical Terminology Simplifier</h4>
          <p className="text-secondary small mb-0">
            Translate complex clinical jargon, test names, and doctor terminology into plain, easy-to-understand English.
          </p>
        </div>
      </div>

      {/* Input Box */}
      <div className="mb-3">
        <label htmlFor="simplifierInput" className="form-label fw-semibold text-navy small">
          Enter a medical term or paste a short clinical phrase:
        </label>
        <div className="input-group">
          <input
            id="simplifierInput"
            type="text"
            className="form-control"
            placeholder="e.g. Hypertension, Dyspnea, Ambulatory, or 'The report showed benign tissue and mild edema'..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSimplify();
            }}
          />
          <button
            type="button"
            className="btn btn-primary px-3"
            onClick={() => handleSimplify()}
            disabled={!inputText.trim()}
          >
            <i className="bi bi-search me-1"></i> Simplify Term
          </button>
          {inputText && (
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClear}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Sample Quick-Click Chips */}
      <div className="mb-3">
        <span className="small text-muted me-2">Try common examples:</span>
        <div className="d-inline-flex flex-wrap gap-1 mt-1">
          {SAMPLE_TERMS.map((term, idx) => (
            <button
              key={idx}
              type="button"
              className="btn btn-sm btn-light border text-secondary rounded-pill py-0 px-2 small"
              onClick={() => handleSelectSample(term)}
              style={{ fontSize: '0.78rem' }}
            >
              {term}
            </button>
          ))}
        </div>
      </div>

      {/* Simplification Result Display */}
      {result && (
        <div className="mt-3 pt-3 border-top">
          {result.fallback ? (
            /* Safe Fallback for Unknown Term */
            <div className="alert alert-secondary border-secondary-subtle py-3 px-4 mb-0">
              <div className="d-flex align-items-start gap-2">
                <i className="bi bi-question-circle-fill text-secondary fs-4 mt-1 flex-shrink-0"></i>
                <div>
                  <h6 className="fw-bold text-dark mb-1">Term Not Found in Basic Dictionary</h6>
                  <p className="small text-secondary mb-2">
                    {result.fallbackMessage}
                  </p>
                  <div className="p-2 rounded bg-white border border-secondary-subtle small text-dark">
                    <strong className="d-block mb-1 text-primary">
                      <i className="bi bi-chat-quote me-1"></i> Recommended Doctor Question:
                    </strong>
                    {result.recommendedAction}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Matched Verified Terms */
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="small text-success fw-semibold">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  Found {result.matches.length} verified term definition{result.matches.length > 1 ? 's' : ''}:
                </span>
                <span className="badge bg-light text-muted border small">
                  Curated Healthcare Dictionary
                </span>
              </div>

              <div className="row g-3">
                {result.matches.map((item) => (
                  <div key={item.id} className="col-12">
                    <div className="card border border-light-subtle bg-soft-blue p-3 rounded-3">
                      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-2">
                        <div>
                          <h5 className="fw-bold text-navy mb-0">{item.term}</h5>
                          {item.phonetic && (
                            <span className="text-muted small fst-italic">
                              Pronounced: /{item.phonetic}/
                            </span>
                          )}
                        </div>
                        <div className="d-flex gap-1">
                          <span className="badge bg-primary-subtle text-primary border small">
                            {item.category}
                          </span>
                          <span className="badge bg-light text-secondary border small">
                            {item.reviewStatus}
                          </span>
                        </div>
                      </div>

                      {/* Plain-English Definition */}
                      <div className="mb-2">
                        <strong className="text-dark small d-block mb-1">Plain-English Meaning:</strong>
                        <p className="text-secondary small mb-0">{item.plainDefinition}</p>
                      </div>

                      {/* Why it Matters */}
                      {item.whyItMatters && (
                        <div className="mb-2">
                          <strong className="text-dark small d-block mb-1">Why It Matters for Your Health:</strong>
                          <p className="text-secondary small mb-0">{item.whyItMatters}</p>
                        </div>
                      )}

                      {/* Doctor Questions to Ask */}
                      {item.doctorQuestions && item.doctorQuestions.length > 0 && (
                        <div className="mt-2 pt-2 border-top border-light-subtle">
                          <strong className="text-navy small d-block mb-1">
                            <i className="bi bi-chat-dots-fill text-primary me-1"></i> Questions to Ask Your Doctor:
                          </strong>
                          <ul className="mb-0 small text-secondary ps-3">
                            {item.doctorQuestions.map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
