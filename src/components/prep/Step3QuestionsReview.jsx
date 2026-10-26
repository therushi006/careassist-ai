import React, { useState, useEffect } from 'react';
import {
  generateDoctorQuestions,
  QUESTION_CATEGORIES,
} from '../../services/questionGeneratorService';

export default function Step3QuestionsReview({ data, updateData, onNext, onBack }) {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newQuestionCategory, setNewQuestionCategory] = useState(QUESTION_CATEGORIES.CLARIFICATION);

  // Auto-generate questions on mount if none exist yet
  useEffect(() => {
    if (!data.questions || data.questions.length === 0) {
      const generated = generateDoctorQuestions(data);
      updateData({ questions: generated });
    }
  }, []);

  const questions = data.questions || [];

  // Toggle question checked state
  const handleToggleChecked = (id) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, checked: !q.checked } : q));
    updateData({ questions: updated });
  };

  // Start inline editing
  const handleStartEdit = (q) => {
    setEditingId(q.id);
    setEditText(q.text);
  };

  // Save inline edit
  const handleSaveEdit = (id) => {
    if (editText.trim()) {
      const updated = questions.map((q) => (q.id === id ? { ...q, text: editText.trim() } : q));
      updateData({ questions: updated });
    }
    setEditingId(null);
    setEditText('');
  };

  // Cancel inline edit
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  // Delete question
  const handleDeleteQuestion = (id) => {
    const updated = questions.filter((q) => q.id !== id);
    updateData({ questions: updated });
  };

  // Add custom question
  const handleAddCustomQuestion = (e) => {
    e.preventDefault();
    if (newQuestionText.trim()) {
      const newQ = {
        id: `custom_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        text: newQuestionText.trim(),
        category: newQuestionCategory,
        checked: true,
        isCustom: true,
      };
      updateData({ questions: [...questions, newQ] });
      setNewQuestionText('');
    }
  };

  // Regenerate questions from scratch if desired
  const handleRegenerate = () => {
    const regenerated = generateDoctorQuestions(data);
    updateData({ questions: regenerated });
  };

  // Group questions by category
  const categories = Object.values(QUESTION_CATEGORIES);

  const selectedCount = questions.filter((q) => q.checked).length;

  return (
    <div className="card border-0 shadow-sm app-card p-4">
      <div className="border-bottom pb-3 mb-3">
        <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
          <div>
            <span className="badge bg-primary-subtle text-primary mb-1">Step 3 of 4</span>
            <h4 className="fw-bold text-navy mb-1">Doctor Questions Generator & Checklist</h4>
            <p className="text-secondary small mb-0">
              Select, refine, or add specific questions to take into the examination room.
            </p>
          </div>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={handleRegenerate}
            title="Re-run rule-based generator from current symptom entries"
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Re-generate Questions
          </button>
        </div>
      </div>

      {/* Transparent AI & Safety Notice */}
      <div className="alert alert-info py-2 px-3 small border-info-subtle mb-4 d-flex align-items-center">
        <i className="bi bi-gear-wide-connected fs-5 me-2 text-primary flex-shrink-0"></i>
        <div>
          <span className="badge bg-warning-subtle text-dark border border-warning-subtle me-2">
            Rule-Based Generator
          </span>
          Questions are structured using deterministic logic mapped to your symptom entries. This is <em>not</em> an autonomous diagnostic tool or a live AI clinician.
        </div>
      </div>

      {/* Questions Summary Count */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <span className="small text-muted">
          Showing <strong>{questions.length}</strong> questions (<strong>{selectedCount}</strong> selected for summary agenda)
        </span>
      </div>

      {/* Question Groups by Category */}
      {categories.map((cat) => {
        const catQuestions = questions.filter((q) => q.category === cat);
        if (catQuestions.length === 0) return null;

        return (
          <div key={cat} className="mb-4">
            <h6 className="fw-bold text-navy mb-2 d-flex align-items-center">
              <span className="badge bg-light text-secondary border me-2 small">
                {catQuestions.length}
              </span>
              {cat}
            </h6>

            <div className="list-group">
              {catQuestions.map((q) => {
                const isEditing = editingId === q.id;

                return (
                  <div
                    key={q.id}
                    className={`list-group-item list-group-item-action border-light-subtle py-2 px-3 ${
                      q.checked ? 'bg-white' : 'bg-light text-muted'
                    }`}
                  >
                    {isEditing ? (
                      /* Inline Edit Mode */
                      <div className="d-flex gap-2 my-1">
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveEdit(q.id);
                            if (e.key === 'Escape') handleCancelEdit();
                          }}
                        />
                        <button
                          type="button"
                          className="btn btn-sm btn-success px-2"
                          onClick={() => handleSaveEdit(q.id)}
                        >
                          <i className="bi bi-check-lg"></i>
                        </button>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-secondary px-2"
                          onClick={handleCancelEdit}
                        >
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ) : (
                      /* View & Checkbox Mode */
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="form-check mb-0 flex-grow-1 me-2">
                          <input
                            type="checkbox"
                            id={`check_${q.id}`}
                            className="form-check-input"
                            checked={q.checked}
                            onChange={() => handleToggleChecked(q.id)}
                          />
                          <label
                            htmlFor={`check_${q.id}`}
                            className={`form-check-label small ${
                              q.checked ? 'text-dark' : 'text-decoration-line-through text-muted'
                            }`}
                            style={{ cursor: 'pointer' }}
                          >
                            {q.text}
                          </label>
                        </div>

                        <div className="btn-group btn-group-sm">
                          <button
                            type="button"
                            className="btn btn-link text-secondary p-0 me-2"
                            onClick={() => handleStartEdit(q)}
                            title="Edit question text"
                          >
                            <i className="bi bi-pencil small"></i>
                          </button>
                          <button
                            type="button"
                            className="btn btn-link text-danger p-0"
                            onClick={() => handleDeleteQuestion(q.id)}
                            title="Remove question"
                          >
                            <i className="bi bi-trash3 small"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Add Custom Question Form */}
      <div className="card bg-light border-dashed p-3 mb-4">
        <h6 className="fw-bold text-navy small mb-2">
          <i className="bi bi-plus-circle me-1 text-primary"></i> Add Your Own Custom Question
        </h6>
        <form onSubmit={handleAddCustomQuestion} className="row g-2">
          <div className="col-md-7">
            <input
              type="text"
              className="form-control form-control-sm"
              placeholder="e.g. Could my current allergy medication be interacting with this?"
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select form-select-sm"
              value={newQuestionCategory}
              onChange={(e) => setNewQuestionCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <button
              type="submit"
              className="btn btn-sm btn-primary w-100"
              disabled={!newQuestionText.trim()}
            >
              Add Question
            </button>
          </div>
        </form>
      </div>

      {/* Navigation Buttons */}
      <div className="d-flex justify-content-between pt-3 border-top">
        <button type="button" className="btn btn-outline-secondary px-3" onClick={onBack}>
          <i className="bi bi-arrow-left me-1"></i> Back to Step 2
        </button>
        <button type="button" className="btn btn-primary px-4" onClick={onNext}>
          Next: Review Summary & Print <i className="bi bi-arrow-right ms-1"></i>
        </button>
      </div>
    </div>
  );
}
