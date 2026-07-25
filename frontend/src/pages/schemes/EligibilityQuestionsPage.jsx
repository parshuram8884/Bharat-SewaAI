import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, RefreshCw } from 'lucide-react';
import {
  EligibilityProgress,
  EligibilityQuestionCard,
  EligibilityNavigation
} from '../../components/schemes/EligibilityQuestionnaireComponents';
import { useEligibilityQuestions, useEvaluateEligibility } from '../../hooks/useSchemeQuery';
import { useSchemeEligibilityUiStore } from '../../stores/schemeEligibilityUiStore';
import { MOCK_CITIZEN_PROFILE } from '../../data/mockSchemesData';

export default function EligibilityQuestionsPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();

  const { data: qData, isLoading, isError } = useEligibilityQuestions(schemeId);
  const evaluateMutation = useEvaluateEligibility();

  const {
    activeSchemeId,
    initSession,
    currentQuestionIndex,
    setQuestionIndex,
    setAnswer,
    getDraftAnswers,
    clearSchemeDraft
  } = useSchemeEligibilityUiStore();

  useEffect(() => {
    if (!activeSchemeId || activeSchemeId !== schemeId) {
      initSession(schemeId);
    }
  }, [schemeId, activeSchemeId, initSession]);

  const questions = qData?.data || [];
  const currentQuestion = questions[currentQuestionIndex];
  const draftAnswers = getDraftAnswers(schemeId);
  const currentAnswer = currentQuestion ? draftAnswers[currentQuestion.fieldKey] : undefined;

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Evaluate eligibility
      evaluateMutation.mutate(
        {
          schemeId,
          profile: MOCK_CITIZEN_PROFILE,
          answers: draftAnswers
        },
        {
          onSuccess: (data) => {
            if (data?.resultId) {
              navigate(`/schemes/${schemeId}/eligibility/result?resultId=${data.resultId}`);
            }
          }
        }
      );
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleExit = () => {
    if (window.confirm('Save progress and exit eligibility check?')) {
      navigate(`/schemes/${schemeId}`);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center max-w-md mx-auto my-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p className="text-sm font-semibold text-primary">Loading eligibility questions...</p>
      </div>
    );
  }

  if (isError || questions.length === 0) {
    return (
      <div className="p-8 text-center bg-surface-container-lowest border border-outline-variant rounded-2xl max-w-md mx-auto my-12">
        <h2 className="text-lg font-bold text-primary mb-2">Eligibility questions not available</h2>
        <p className="text-xs text-on-surface-variant mb-4">You can review the scheme details or try again later.</p>
        <button
          onClick={() => navigate(`/schemes/${schemeId}`)}
          className="min-h-[44px] px-4 py-2 bg-primary text-on-primary font-bold text-xs rounded-xl"
        >
          Back to Scheme
        </button>
      </div>
    );
  }

  const isLastStep = currentQuestionIndex === questions.length - 1;
  const canNext = currentAnswer !== undefined || !currentQuestion?.required;

  return (
    <div className="bg-background text-on-background min-h-screen pb-24 font-sans px-4 pt-4">
      {/* Header */}
      <header className="max-w-xl mx-auto flex items-center justify-between gap-3 mb-4">
        <span className="text-xs font-bold text-primary uppercase tracking-wider">Eligibility Check</span>
        <button
          onClick={handleExit}
          type="button"
          aria-label="Save and exit eligibility check"
          className="min-w-[44px] min-h-[44px] flex items-center justify-center rounded-full hover:bg-surface-container-low text-on-surface-variant"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      <main className="max-w-xl mx-auto">
        <EligibilityProgress currentStep={currentQuestionIndex} totalSteps={questions.length} />

        {currentQuestion && (
          <EligibilityQuestionCard
            question={currentQuestion}
            answerValue={currentAnswer}
            onChangeAnswer={(val) => setAnswer(currentQuestion.fieldKey, val)}
          />
        )}

        <EligibilityNavigation
          onPrev={handlePrev}
          onNext={handleNext}
          canPrev={currentQuestionIndex > 0}
          canNext={canNext && !evaluateMutation.isPending}
          isLastStep={isLastStep}
        />

        {evaluateMutation.isPending && (
          <div className="text-center mt-4 text-xs font-bold text-secondary flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>Evaluating eligibility rules...</span>
          </div>
        )}
      </main>
    </div>
  );
}
