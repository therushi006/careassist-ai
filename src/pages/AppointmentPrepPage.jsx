import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import PrepStepIndicator from '../components/prep/PrepStepIndicator';
import Step1VisitConcern from '../components/prep/Step1VisitConcern';
import Step2SymptomsImpact from '../components/prep/Step2SymptomsImpact';
import Step3QuestionsReview from '../components/prep/Step3QuestionsReview';
import Step4SummaryReview from '../components/prep/Step4SummaryReview';
import { storageService } from '../services/storageService';

const INITIAL_PREP_DATA = {
  id: null,
  title: '',
  visitType: 'General Consultation',
  doctorName: '',
  targetDate: '',
  chiefConcern: '',
  goals: [],
  symptoms: {
    description: '',
    onset: '',
    frequency: '',
    severity: 'Moderate',
    triggers: '',
    relievingFactors: '',
    impact: '',
  },
  questions: [],
  notes: '',
};

export default function AppointmentPrepPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const summaryIdFromUrl = searchParams.get('id');

  const [currentStep, setCurrentStep] = useState(1);
  const [maxAccessibleStep, setMaxAccessibleStep] = useState(1);
  const [prepData, setPrepData] = useState(INITIAL_PREP_DATA);
  const [savedSummaries, setSavedSummaries] = useState([]);
  const [showSavedList, setShowSavedList] = useState(false);

  // Load saved summaries and check for URL param
  useEffect(() => {
    loadSavedSummaries();
  }, []);

  useEffect(() => {
    if (summaryIdFromUrl) {
      loadSpecificSummary(summaryIdFromUrl);
    }
  }, [summaryIdFromUrl]);

  const loadSavedSummaries = () => {
    const list = storageService.getPrepSummaries();
    setSavedSummaries(list);
  };

  const loadSpecificSummary = (id) => {
    const found = storageService.getPrepSummaryById(id);
    if (found) {
      setPrepData(found);
      setCurrentStep(4); // Open straight into Summary View
      setMaxAccessibleStep(4);
    }
  };

  const updateData = (fields) => {
    setPrepData((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const goToStep = (stepNumber) => {
    setCurrentStep(stepNumber);
    if (stepNumber > maxAccessibleStep) {
      setMaxAccessibleStep(stepNumber);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNew = () => {
    setPrepData(INITIAL_PREP_DATA);
    setCurrentStep(1);
    setMaxAccessibleStep(1);
    setSearchParams({});
  };

  const handleSelectSaved = (summary) => {
    setPrepData(summary);
    setCurrentStep(4);
    setMaxAccessibleStep(4);
    setShowSavedList(false);
    setSearchParams({ id: summary.id });
  };

  const handleDeleteSaved = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved preparation agenda?')) {
      storageService.deletePrepSummary(id);
      loadSavedSummaries();
      if (prepData.id === id) {
        handleStartNew();
      }
    }
  };

  return (
    <div className="container py-4">
      {/* Page Header (Hidden during print) */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4 no-print">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary text-white">Visit Readiness Tool</span>
            <span className="badge-simulated px-2 py-1 rounded">Rule-Based Assistant</span>
          </div>
          <h2 className="fw-bold text-navy mb-0">Appointment Preparation Assistant</h2>
        </div>

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            onClick={() => setShowSavedList(!showSavedList)}
          >
            <i className="bi bi-folder2-open me-1"></i>
            Saved Agendas ({savedSummaries.length})
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleStartNew}
          >
            <i className="bi bi-plus-lg me-1"></i> New Prep
          </button>
        </div>
      </div>

      {/* Saved Summaries Drawer / List (Hidden during print) */}
      {showSavedList && (
        <div className="card border-0 shadow-sm app-card p-3 mb-4 bg-light no-print">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h6 className="fw-bold text-navy mb-0">
              <i className="bi bi-archive me-1 text-primary"></i> Previously Saved Prep Sheets
            </h6>
            <button
              type="button"
              className="btn-close btn-close-sm"
              onClick={() => setShowSavedList(false)}
              aria-label="Close"
            ></button>
          </div>

          {savedSummaries.length === 0 ? (
            <p className="text-muted small mb-0 py-2">
              No saved preparation sheets found in your browser. Complete the form below and click "Save Agenda" to store your notes.
            </p>
          ) : (
            <div className="row g-2 mt-1">
              {savedSummaries.map((s) => (
                <div key={s.id} className="col-md-6 col-lg-4">
                  <div
                    className={`card p-2 h-100 ${
                      prepData.id === s.id ? 'border-primary bg-white shadow-sm' : 'border-light-subtle bg-white'
                    }`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleSelectSaved(s)}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <strong className="text-navy small text-truncate" style={{ maxWidth: '80%' }}>
                        {s.title || s.chiefConcern || 'Untitled Prep'}
                      </strong>
                      <button
                        type="button"
                        className="btn btn-link text-danger p-0 ms-2"
                        onClick={(e) => handleDeleteSaved(s.id, e)}
                        title="Delete saved agenda"
                      >
                        <i className="bi bi-trash3 small"></i>
                      </button>
                    </div>
                    <span className="badge bg-light text-secondary border small my-1 align-self-start">
                      {s.visitType || 'General'}
                    </span>
                    <span className="text-muted small" style={{ fontSize: '0.75rem' }}>
                      {s.targetDate ? `Visit: ${s.targetDate}` : `Saved: ${new Date(s.updatedAt || s.createdAt).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step Indicator (Hidden during print) */}
      <PrepStepIndicator
        currentStep={currentStep}
        onStepClick={goToStep}
        maxAccessibleStep={maxAccessibleStep}
      />

      {/* Multi-Step Views */}
      {currentStep === 1 && (
        <Step1VisitConcern
          data={prepData}
          updateData={updateData}
          onNext={() => goToStep(2)}
        />
      )}

      {currentStep === 2 && (
        <Step2SymptomsImpact
          data={prepData}
          updateData={updateData}
          onNext={() => goToStep(3)}
          onBack={() => goToStep(1)}
        />
      )}

      {currentStep === 3 && (
        <Step3QuestionsReview
          data={prepData}
          updateData={updateData}
          onNext={() => goToStep(4)}
          onBack={() => goToStep(2)}
        />
      )}

      {currentStep === 4 && (
        <Step4SummaryReview
          data={prepData}
          updateData={updateData}
          onBack={() => goToStep(3)}
          onSaved={(savedRecord) => {
            loadSavedSummaries();
            if (savedRecord?.id) {
              setSearchParams({ id: savedRecord.id });
            }
          }}
          onStartNew={handleStartNew}
        />
      )}
    </div>
  );
}
