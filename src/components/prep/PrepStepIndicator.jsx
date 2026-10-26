import React from 'react';

export default function PrepStepIndicator({ currentStep, onStepClick, maxAccessibleStep }) {
  const steps = [
    { number: 1, label: 'Visit & Concern', icon: 'bi-clipboard2-pulse' },
    { number: 2, label: 'Symptoms & Impact', icon: 'bi-activity' },
    { number: 3, label: 'Doctor Questions', icon: 'bi-chat-left-dots' },
    { number: 4, label: 'Summary & Print', icon: 'bi-file-earmark-check' },
  ];

  return (
    <div className="prep-step-indicator mb-4 no-print">
      <div className="d-flex justify-content-between align-items-center position-relative">
        {/* Connecting Line */}
        <div
          className="position-absolute w-100"
          style={{
            height: '3px',
            backgroundColor: '#e2e8f0',
            top: '22px',
            zIndex: 1,
          }}
        ></div>

        {/* Active Progress Line */}
        <div
          className="position-absolute"
          style={{
            height: '3px',
            backgroundColor: '#0d6efd',
            top: '22px',
            zIndex: 1,
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            transition: 'width 0.3s ease',
          }}
        ></div>

        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          const isClickable = step.number <= maxAccessibleStep;

          return (
            <div
              key={step.number}
              className="text-center position-relative"
              style={{ zIndex: 2 }}
            >
              <button
                type="button"
                className={`btn rounded-circle d-flex align-items-center justify-content-center mx-auto shadow-sm p-0 ${
                  isActive
                    ? 'btn-primary text-white border-2 border-white'
                    : isCompleted
                    ? 'btn-success text-white'
                    : 'btn-light border text-muted'
                }`}
                style={{
                  width: '44px',
                  height: '44px',
                  cursor: isClickable ? 'pointer' : 'not-allowed',
                }}
                onClick={() => isClickable && onStepClick(step.number)}
                disabled={!isClickable}
                aria-label={`Go to step ${step.number}: ${step.label}`}
              >
                {isCompleted ? (
                  <i className="bi bi-check-lg fs-5"></i>
                ) : (
                  <i className={`bi ${step.icon} fs-6`}></i>
                )}
              </button>
              <div
                className={`small mt-2 d-none d-sm-block ${
                  isActive ? 'fw-bold text-primary' : isCompleted ? 'text-dark' : 'text-muted'
                }`}
              >
                {step.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
