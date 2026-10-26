import React, { useState } from 'react';

const FREQUENCY_OPTIONS = [
  'Constant (all day)',
  'Intermittent (comes and goes)',
  'Mostly in the morning',
  'Mostly in the evening or at night',
  'Only during or after physical activity',
  'Occasional / unpredictable',
];

const SEVERITY_LEVELS = [
  { level: 'Mild', desc: 'Noticeable, but does not interfere with daily routine' },
  { level: 'Moderate', desc: 'Disrupts some activities or requires resting periodically' },
  { level: 'Severe', desc: 'Significantly impairs ability to work, sleep, or move comfortably' },
];

export default function Step2SymptomsImpact({ data, updateData, onNext, onBack }) {
  const [errors, setErrors] = useState({});

  const symptoms = data.symptoms || {};

  const updateSymptomField = (field, value) => {
    updateData({
      symptoms: {
        ...symptoms,
        [field]: value,
      },
    });
    if (field === 'description' && errors.description) {
      setErrors({ ...errors, description: null });
    }
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!symptoms.description || !symptoms.description.trim()) {
      newErrors.description = 'Please provide a brief description of how your symptoms feel.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onNext();
  };

  return (
    <div className="card border-0 shadow-sm app-card p-4">
      <div className="border-bottom pb-3 mb-4">
        <span className="badge bg-primary-subtle text-primary mb-1">Step 2 of 4</span>
        <h4 className="fw-bold text-navy mb-1">Symptom Details & Daily Impact</h4>
        <p className="text-secondary small mb-0">
          Document the timing, frequency, and real-life impact to help your doctor see the full clinical picture.
        </p>
      </div>

      {/* Cautious Emergency Reminder Callout */}
      <div className="alert alert-warning py-2 px-3 small border-warning-subtle mb-4">
        <i className="bi bi-shield-exclamation text-danger me-1"></i>
        <strong>Clinical Safety Check:</strong> If you are experiencing sudden acute symptoms (such as crushing chest pain, difficulty breathing, sudden face drooping, or severe bleeding), please call <strong>911</strong> or visit the nearest emergency facility immediately.
      </div>

      <form onSubmit={handleContinue}>
        {/* Symptom Description (REQUIRED) */}
        <div className="mb-4">
          <label htmlFor="symptomDescTextarea" className="form-label fw-semibold text-navy">
            How do the symptoms feel? <span className="text-danger">*</span>
          </label>
          <textarea
            id="symptomDescTextarea"
            rows="3"
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="e.g. Dull, aching pressure in the lower back that radiates into the hip; sharp pain when bending over..."
            value={symptoms.description || ''}
            onChange={(e) => updateSymptomField('description', e.target.value)}
          ></textarea>
          {errors.description ? (
            <div className="invalid-feedback">{errors.description}</div>
          ) : (
            <div className="form-text small">
              Describe the sensations (e.g. sharp, dull, throbbing, burning, stiff, tingling, fatigue).
            </div>
          )}
        </div>

        {/* Duration / Onset & Frequency */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="onsetInput" className="form-label fw-semibold text-navy small">
              When did this start? / Duration <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <input
              id="onsetInput"
              type="text"
              className="form-control"
              placeholder="e.g. 4 days ago, about 3 weeks, past 6 months"
              value={symptoms.onset || ''}
              onChange={(e) => updateSymptomField('onset', e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="frequencySelect" className="form-label fw-semibold text-navy small">
              How often does it occur? <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <select
              id="frequencySelect"
              className="form-select"
              value={symptoms.frequency || ''}
              onChange={(e) => updateSymptomField('frequency', e.target.value)}
            >
              <option value="">Select frequency pattern...</option>
              {FREQUENCY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Severity Description */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-navy small d-block mb-2">
            Severity as described by you <span className="text-muted fw-normal">(Optional)</span>
          </label>
          <div className="row g-2">
            {SEVERITY_LEVELS.map((item) => {
              const isSelected = symptoms.severity === item.level;
              return (
                <div key={item.level} className="col-md-4">
                  <div
                    className={`card h-100 p-3 border text-start ${
                      isSelected ? 'border-primary bg-primary-subtle' : 'border-light-subtle bg-light'
                    }`}
                    style={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                    onClick={() => updateSymptomField('severity', item.level)}
                  >
                    <div className="d-flex align-items-center mb-1">
                      <input
                        type="radio"
                        name="severityRadio"
                        className="form-check-input me-2 mt-0"
                        checked={isSelected}
                        onChange={() => updateSymptomField('severity', item.level)}
                      />
                      <strong className={isSelected ? 'text-primary' : 'text-navy'}>
                        {item.level}
                      </strong>
                    </div>
                    <span className="text-secondary small">{item.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Triggers & Relieving Factors */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="triggersInput" className="form-label fw-semibold text-navy small">
              What seems to make it worse? (Triggers) <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <input
              id="triggersInput"
              type="text"
              className="form-control"
              placeholder="e.g. Prolonged sitting, lifting heavy bags, cold weather..."
              value={symptoms.triggers || ''}
              onChange={(e) => updateSymptomField('triggers', e.target.value)}
            />
          </div>

          <div className="col-md-6">
            <label htmlFor="relievingInput" className="form-label fw-semibold text-navy small">
              What seems to help or relieve it? <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <input
              id="relievingInput"
              type="text"
              className="form-control"
              placeholder="e.g. Heating pad, resting, stretching, over-the-counter pain reliever..."
              value={symptoms.relievingFactors || ''}
              onChange={(e) => updateSymptomField('relievingFactors', e.target.value)}
            />
          </div>
        </div>

        {/* Daily Life Impact */}
        <div className="mb-4">
          <label htmlFor="impactInput" className="form-label fw-semibold text-navy small">
            Impact on daily activities <span className="text-muted fw-normal">(Optional)</span>
          </label>
          <input
            id="impactInput"
            type="text"
            className="form-control"
            placeholder="e.g. Trouble falling asleep, having to take breaks while standing, difficulty concentrating at work..."
            value={symptoms.impact || ''}
            onChange={(e) => updateSymptomField('impact', e.target.value)}
          />
          <div className="form-text small">
            Doctors prioritize issues that directly affect your sleep, mobility, work, or daily self-care.
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="d-flex justify-content-between pt-3 border-top">
          <button type="button" className="btn btn-outline-secondary px-3" onClick={onBack}>
            <i className="bi bi-arrow-left me-1"></i> Back to Step 1
          </button>
          <button type="submit" className="btn btn-primary px-4">
            Next: Generate Questions <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
