import React, { useState } from 'react';

const VISIT_TYPES = [
  'General Consultation',
  'Annual Physical Checkup',
  'Specialist Consultation',
  'Follow-up on Previous Visit',
  'Review Lab or Imaging Results',
  'Chronic Condition Management',
  'Second Medical Opinion',
  'Other Healthcare Inquiry',
];

const COMMON_GOALS = [
  'Understand potential cause of symptoms',
  'Discuss diagnostic test options',
  'Review current medication or dosages',
  'Explore non-medication lifestyle solutions',
  'Get specialist referral if needed',
  'Establish clear next steps and timeline',
];

export default function Step1VisitConcern({ data, updateData, onNext }) {
  const [errors, setErrors] = useState({});
  const [customGoal, setCustomGoal] = useState('');

  const handleGoalToggle = (goal) => {
    const current = data.goals || [];
    if (current.includes(goal)) {
      updateData({ goals: current.filter((g) => g !== goal) });
    } else {
      updateData({ goals: [...current, goal] });
    }
  };

  const handleAddCustomGoal = (e) => {
    e.preventDefault();
    if (customGoal.trim()) {
      const current = data.goals || [];
      if (!current.includes(customGoal.trim())) {
        updateData({ goals: [...current, customGoal.trim()] });
      }
      setCustomGoal('');
    }
  };

  const handleRemoveGoal = (goalToRemove) => {
    const current = data.goals || [];
    updateData({ goals: current.filter((g) => g !== goalToRemove) });
  };

  const handleContinue = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!data.chiefConcern || !data.chiefConcern.trim()) {
      newErrors.chiefConcern = 'Please enter your main health concern or reason for visit.';
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
        <span className="badge bg-primary-subtle text-primary mb-1">Step 1 of 4</span>
        <h4 className="fw-bold text-navy mb-1">Appointment Purpose & Main Concern</h4>
        <p className="text-secondary small mb-0">
          Tell us about the upcoming appointment and what you most want to address with your doctor.
        </p>
      </div>

      <form onSubmit={handleContinue}>
        {/* Visit Type */}
        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label htmlFor="visitTypeSelect" className="form-label fw-semibold text-navy small">
              Visit Type <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <select
              id="visitTypeSelect"
              className="form-select"
              value={data.visitType || 'General Consultation'}
              onChange={(e) => updateData({ visitType: e.target.value })}
            >
              {VISIT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label htmlFor="doctorNameInput" className="form-label fw-semibold text-navy small">
              Doctor or Clinic Name <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <input
              id="doctorNameInput"
              type="text"
              className="form-control"
              placeholder="e.g. Dr. Sarah Mitchell or City Health Clinic"
              value={data.doctorName || ''}
              onChange={(e) => updateData({ doctorName: e.target.value })}
            />
          </div>
        </div>

        {/* Target Appointment Date */}
        <div className="row g-3 mb-4">
          <div className="col-md-6">
            <label htmlFor="targetDateInput" className="form-label fw-semibold text-navy small">
              Target Appointment Date <span className="text-muted fw-normal">(Optional)</span>
            </label>
            <input
              id="targetDateInput"
              type="date"
              className="form-control"
              value={data.targetDate || ''}
              onChange={(e) => updateData({ targetDate: e.target.value })}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="summaryTitleInput" className="form-label fw-semibold text-navy small">
              Agenda Title <span className="text-muted fw-normal">(Optional - defaults to concern)</span>
            </label>
            <input
              id="summaryTitleInput"
              type="text"
              className="form-control"
              placeholder="e.g. November Checkup Agenda"
              value={data.title || ''}
              onChange={(e) => updateData({ title: e.target.value })}
            />
          </div>
        </div>

        {/* Chief Concern (REQUIRED) */}
        <div className="mb-4">
          <label htmlFor="chiefConcernTextarea" className="form-label fw-semibold text-navy">
            Main Health Concern or Primary Question <span className="text-danger">*</span>
          </label>
          <textarea
            id="chiefConcernTextarea"
            rows="3"
            className={`form-control ${errors.chiefConcern ? 'is-invalid' : ''}`}
            placeholder="e.g. Persistent lower back stiffness in the mornings, ongoing knee soreness when walking stairs, or reviewing recent lab results..."
            value={data.chiefConcern || ''}
            onChange={(e) => {
              updateData({ chiefConcern: e.target.value });
              if (errors.chiefConcern) {
                setErrors({ ...errors, chiefConcern: null });
              }
            }}
          ></textarea>
          {errors.chiefConcern ? (
            <div className="invalid-feedback">{errors.chiefConcern}</div>
          ) : (
            <div className="form-text small">
              Describe in your own words what is bothering you most or what prompted you to schedule this visit.
            </div>
          )}
        </div>

        {/* Primary Goals for this Appointment */}
        <div className="mb-4">
          <label className="form-label fw-semibold text-navy small d-block mb-1">
            What do you hope to accomplish in this visit? <span className="text-muted fw-normal">(Select all that apply)</span>
          </label>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {COMMON_GOALS.map((goal) => {
              const isSelected = (data.goals || []).includes(goal);
              return (
                <button
                  key={goal}
                  type="button"
                  className={`btn btn-sm ${
                    isSelected ? 'btn-primary' : 'btn-outline-secondary'
                  } rounded-pill`}
                  onClick={() => handleGoalToggle(goal)}
                >
                  <i className={`bi bi-${isSelected ? 'check-circle-fill' : 'plus'} me-1`}></i>
                  {goal}
                </button>
              );
            })}
          </div>

          {/* Custom Goal Input */}
          <div className="input-group input-group-sm" style={{ maxWidth: '480px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Add another personal visit goal..."
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddCustomGoal(e);
                }
              }}
            />
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={handleAddCustomGoal}
              disabled={!customGoal.trim()}
            >
              Add Goal
            </button>
          </div>

          {/* Selected Goals Display */}
          {(data.goals || []).length > 0 && (
            <div className="mt-2 pt-2 border-top">
              <span className="small text-muted me-2">Selected Goals:</span>
              {(data.goals || []).map((g, idx) => (
                <span key={idx} className="badge bg-light text-dark border me-1 mb-1">
                  {g}{' '}
                  <i
                    className="bi bi-x-circle text-danger ms-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveGoal(g)}
                    title="Remove goal"
                  ></i>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Navigation Actions */}
        <div className="d-flex justify-content-end pt-3 border-top">
          <button type="submit" className="btn btn-primary px-4">
            Next: Describe Symptoms <i className="bi bi-arrow-right ms-1"></i>
          </button>
        </div>
      </form>
    </div>
  );
}
