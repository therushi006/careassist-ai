import React, { useState } from 'react';
import {
  HEALTH_GUIDES,
  MEDICAL_TERMS,
  HEALTH_LIBRARY_METADATA,
} from '../services/healthLibraryData';
import MedicalTermSimplifier from '../components/library/MedicalTermSimplifier';
import GuideDetailModal from '../components/library/GuideDetailModal';

export default function HealthLibraryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeGuide, setActiveGuide] = useState(null);
  const [activeTab, setActiveTab] = useState('guides'); // 'guides' | 'terms'

  // Extract unique guide categories
  const guideCategories = Array.from(new Set(HEALTH_GUIDES.map((g) => g.category)));
  const termCategories = Array.from(new Set(MEDICAL_TERMS.map((t) => t.category)));

  // Filter Guides
  const filteredGuides = HEALTH_GUIDES.filter((guide) => {
    if (selectedCategory !== 'all' && guide.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = guide.title.toLowerCase().includes(q);
      const matchSummary = guide.summary.toLowerCase().includes(q);
      const matchCategory = guide.category.toLowerCase().includes(q);
      const matchPoints = (guide.keyPoints || []).some((p) => p.toLowerCase().includes(q));
      return matchTitle || matchSummary || matchCategory || matchPoints;
    }
    return true;
  });

  // Filter Terms
  const filteredTerms = MEDICAL_TERMS.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTerm = item.term.toLowerCase().includes(q);
      const matchDef = item.plainDefinition.toLowerCase().includes(q);
      const matchCategory = item.category.toLowerCase().includes(q);
      const matchWhy = (item.whyItMatters || '').toLowerCase().includes(q);
      return matchTerm || matchDef || matchCategory || matchWhy;
    }
    return true;
  });

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-4">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-primary text-white">Educational Reference</span>
            <span className="badge bg-warning-subtle text-dark border border-warning-subtle">
              {HEALTH_LIBRARY_METADATA.reviewStatus}
            </span>
          </div>
          <h2 className="fw-bold text-navy mb-0">Health Information & Literacy Hub</h2>
        </div>
      </div>

      {/* Educational Notice Banner */}
      <div className="alert alert-light border border-light-subtle shadow-sm py-2 px-3 small d-flex align-items-center mb-4">
        <i className="bi bi-shield-check text-success fs-5 me-2 flex-shrink-0"></i>
        <span className="text-secondary">
          <strong>Notice:</strong> All library topics and terminology definitions are general educational reference materials. They have <em>not</em> undergone certified clinical board review and are not a substitute for diagnosis, consultation, or treatment by a licensed physician.
        </span>
      </div>

      {/* 1. Medical Terminology Simplifier Component */}
      <MedicalTermSimplifier />

      {/* 2. Health Library Directory Header & Tabs */}
      <div className="card border-0 shadow-sm app-card p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 border-bottom pb-3 mb-3">
          <div>
            <h4 className="fw-bold text-navy mb-1">Searchable Healthcare Guides & Glossary</h4>
            <p className="text-secondary small mb-0">
              Browse doctor visit checklists, fasting guides, and plain-English clinical terms.
            </p>
          </div>

          <div className="btn-group btn-group-sm" role="group">
            <button
              type="button"
              className={`btn ${activeTab === 'guides' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                setActiveTab('guides');
                setSelectedCategory('all');
              }}
            >
              <i className="bi bi-journal-check me-1"></i> Visit Guides ({HEALTH_GUIDES.length})
            </button>
            <button
              type="button"
              className={`btn ${activeTab === 'terms' ? 'btn-primary' : 'btn-outline-secondary'}`}
              onClick={() => {
                setActiveTab('terms');
                setSelectedCategory('all');
              }}
            >
              <i className="bi bi-book me-1"></i> Medical Glossary ({MEDICAL_TERMS.length})
            </button>
          </div>
        </div>

        {/* Search Bar & Category Filters */}
        <div className="row g-2 align-items-center mb-3">
          <div className="col-md-6">
            <div className="input-group input-group-sm">
              <span className="input-group-text bg-white border-end-0">
                <i className="bi bi-search text-muted"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0"
                placeholder={
                  activeTab === 'guides'
                    ? 'Search guides by title, checklist items, or keywords...'
                    : 'Search medical terms or definitions...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setSearchQuery('')}
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          <div className="col-md-4">
            <select
              className="form-select form-select-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {(activeTab === 'guides' ? guideCategories : termCategories).map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm w-100"
              onClick={handleClearFilters}
              disabled={selectedCategory === 'all' && !searchQuery}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Content Section: Visit Guides View */}
        {activeTab === 'guides' && (
          <div>
            {filteredGuides.length === 0 ? (
              /* Empty State */
              <div className="text-center py-5 px-3 bg-light rounded-3 border border-dashed">
                <i className="bi bi-search fs-1 text-muted d-block mb-2"></i>
                <h6 className="fw-bold text-navy mb-1">No Healthcare Guides Matched</h6>
                <p className="text-secondary small mb-3">
                  No educational guides matched your filter "{searchQuery || selectedCategory}".
                </p>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleClearFilters}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {filteredGuides.map((guide) => (
                  <div key={guide.id} className="col-md-6">
                    <div className="card h-100 border border-light-subtle p-3 app-card d-flex flex-column">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <span className="badge bg-primary-subtle text-primary small">
                          {guide.category}
                        </span>
                        <span className="text-muted small">
                          <i className="bi bi-clock me-1"></i> {guide.readTime}
                        </span>
                      </div>

                      <h5 className="fw-bold text-navy mb-2">{guide.title}</h5>
                      <p className="text-secondary small mb-3">{guide.summary}</p>

                      <div className="mt-auto pt-2 border-top d-flex justify-content-between align-items-center">
                        <span className="badge bg-light text-secondary border small">
                          {guide.reviewStatus}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline-primary btn-sm"
                          onClick={() => setActiveGuide(guide)}
                        >
                          Read Guide & Checklist <i className="bi bi-arrow-right ms-1"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Content Section: Medical Terms Glossary View */}
        {activeTab === 'terms' && (
          <div>
            {filteredTerms.length === 0 ? (
              /* Empty State */
              <div className="text-center py-5 px-3 bg-light rounded-3 border border-dashed">
                <i className="bi bi-search fs-1 text-muted d-block mb-2"></i>
                <h6 className="fw-bold text-navy mb-1">No Medical Terms Found</h6>
                <p className="text-secondary small mb-3">
                  No terms matched your search "{searchQuery || selectedCategory}".
                </p>
                <button
                  type="button"
                  className="btn btn-sm btn-primary"
                  onClick={handleClearFilters}
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="row g-3">
                {filteredTerms.map((item) => (
                  <div key={item.id} className="col-md-6">
                    <div className="card h-100 border border-light-subtle p-3 app-card">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h5 className="fw-bold text-navy mb-0">{item.term}</h5>
                          {item.phonetic && (
                            <span className="text-muted small fst-italic">
                              /{item.phonetic}/
                            </span>
                          )}
                        </div>
                        <span className="badge bg-primary-subtle text-primary small">
                          {item.category}
                        </span>
                      </div>

                      <p className="text-secondary small mb-2">{item.plainDefinition}</p>

                      {item.whyItMatters && (
                        <div className="p-2 rounded bg-light border border-light-subtle small text-dark mb-2">
                          <strong>Why it matters:</strong> {item.whyItMatters}
                        </div>
                      )}

                      {item.doctorQuestions && (
                        <div className="mt-2 pt-2 border-top small">
                          <strong className="text-navy d-block mb-1">Questions for Doctor:</strong>
                          <ul className="mb-0 text-secondary ps-3">
                            {item.doctorQuestions.slice(0, 2).map((q, qIdx) => (
                              <li key={qIdx}>{q}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Guide Detail Reader Modal */}
      <GuideDetailModal
        guide={activeGuide}
        isOpen={Boolean(activeGuide)}
        onClose={() => setActiveGuide(null)}
      />
    </div>
  );
}
