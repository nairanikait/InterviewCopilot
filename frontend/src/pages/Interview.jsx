import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { interviewService } from '../services/api';
import { ProgressBar } from '../components/common/ProgressBar';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';

function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0;
}

/**
 * Interview page – full-screen focus mode matching the UI screenshot.
 * Flow: start session → receive questions → submit answers one-by-one.
 */
export default function Interview() {
  const navigate = useNavigate();
  const { loading: starting, error: startError, errorCode: startErrorCode, run: runStart } = useAsync();
  const { loading: submitting, error: submitError, errorCode: submitErrorCode, run: runSubmit } = useAsync();

  // Session state
  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [resultsId, setResultsId] = useState(null);

  // Setup form state — role is display-only; backend needs resumeId from localStorage
  const [role, setRole] = useState('');
  const [questionCount, setQuestionCount] = useState(5);
  // resumeId stored in localStorage after resume upload on Dashboard
  const resumeId = localStorage.getItem('ic_resume_id') || '';

  // Start session — backend requires resumeId (not role/type)
  const handleStart = async () => {
    await runStart(async () => {
      // POST /api/interview/start: { resumeId, questionCount }
      const res = await interviewService.start({ resumeId, questionCount });
      // After envelope unwrap: res.data = { sessionId, status, questions: [{ index, question }] }
      const data = res.data;
      setSessionId(data.sessionId);
      setQuestions(data.questions || []);
      setStarted(true);
    });
  };

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;
  const currentAnswer = answers[currentIndex] || '';
  const wordCount = countWords(currentAnswer);

  const handleAnswerChange = useCallback((e) => {
    setAnswers((prev) => ({ ...prev, [currentIndex]: e.target.value }));
  }, [currentIndex]);

  const handleNext = async () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      // Submit all answers for evaluation
      await runSubmit(async () => {
        // POST /api/interview/evaluate: { sessionId, answers: [{ questionIndex, answer }] }
        const answersArray = questions.map((_, i) => ({
          questionIndex: i,
          answer: answers[i] || '',
        }));
        const res = await interviewService.evaluate({ sessionId, answers: answersArray });
        // After envelope unwrap: res.data = { sessionId, status, overallScore, ... }
        setResultsId(res.data.sessionId || sessionId);
        setFinished(true);
      });
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSkip = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex((i) => i + 1);
  };

  const handleExit = () => {
    if (window.confirm('Exit the interview? Your progress will be lost.')) {
      navigate('/dashboard');
    }
  };

  // ── Finished state ───────────────────────────────────────────────────
  if (finished) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm px-6 animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center mx-auto">
            <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-900">Interview Complete!</h2>
            <p className="text-sm text-dark-500 mt-2">Your answers have been submitted. Check your results now.</p>
          </div>
          <Button
            id="interview-view-results"
            variant="primary"
            className="w-full py-3"
            onClick={() => navigate(resultsId ? `/results/${resultsId}` : '/sessions')}
          >
            View Results
          </Button>
        </div>
      </div>
    );
  }

  // ── Error Recovery state ──────────────────────────────────────────────
  if (startErrorCode === 'AI_UNAVAILABLE' || submitErrorCode === 'AI_UNAVAILABLE') {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center space-y-6 max-w-sm px-6 animate-fade-in">
          <div className="h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mx-auto">
             <svg className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-dark-900">Question generation temporarily unavailable</h2>
            <p className="text-sm text-dark-500 mt-2">AI interview generation is currently unavailable.<br/>Please try again in a few minutes.</p>
          </div>
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full py-3"
              loading={starting || submitting}
              onClick={startErrorCode === 'AI_UNAVAILABLE' ? handleStart : handleNext}
            >
              Retry
            </Button>
            <Button
              variant="secondary"
              className="w-full py-3"
              onClick={() => navigate('/dashboard')}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Setup screen (before starting) ──────────────────────────────────
  if (!started) {
    return (
      <div className="fixed inset-0 bg-dark-50 flex items-center justify-center p-6">
        <div className="card w-full max-w-lg p-8 space-y-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span className="font-bold text-dark-900">InterviewCopilot</span>
            </div>
            <button id="interview-setup-exit" onClick={() => navigate('/dashboard')} className="btn-ghost text-sm gap-1.5">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-dark-900">Set up your session</h1>
            <p className="text-sm text-dark-500 mt-1">Configure your mock interview before starting.</p>
          </div>

          {startError && startErrorCode !== 'AI_UNAVAILABLE' && <Alert variant="error">{startError}</Alert>}

          {/* Guard: resume must be uploaded first */}
          {!resumeId && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              No resume uploaded yet. Please{' '}
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="font-semibold underline hover:text-amber-900"
              >
                upload your resume
              </button>{' '}
              on the Dashboard first.
            </div>
          )}

          <div className="space-y-4">
            {/* Role is shown for context but not sent to backend */}
            <div className="space-y-1.5">
              <label htmlFor="interview-role" className="block text-sm font-medium text-dark-700">
                Target role <span className="text-dark-400 font-normal">(display only)</span>
              </label>
              <input
                id="interview-role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
                className="input"
              />
            </div>

            {/* questionCount maps directly to backend schema */}
            <div className="space-y-1.5">
              <label htmlFor="interview-question-count" className="block text-sm font-medium text-dark-700">
                Number of questions
              </label>
              <select
                id="interview-question-count"
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="input"
              >
                {[3, 5, 8, 10].map((n) => (
                  <option key={n} value={n}>{n} questions</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            id="interview-start-session"
            variant="primary"
            className="w-full py-3"
            loading={starting}
            disabled={!resumeId || starting}
            onClick={handleStart}
          >
            {starting ? 'Generating interview…' : 'Start Interview'}
          </Button>
        </div>
      </div>
    );
  }

  // ── Active interview ─────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-white flex flex-col">
      {/* Top bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-dark-100">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
          <span className="font-bold text-dark-900">InterviewCopilot</span>
        </div>
        <button
          id="interview-exit-focus"
          onClick={handleExit}
          className="flex items-center gap-1.5 text-sm text-dark-500 hover:text-dark-900 transition-colors"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit Focus
        </button>
      </header>

      {/* Progress section */}
      <div className="px-6 pt-6 pb-4 max-w-3xl mx-auto w-full">
        <p className="text-xs font-semibold tracking-widest text-dark-400 uppercase mb-1">
          {role || 'Mock Interview'}
        </p>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-dark-900">
            Question {currentIndex + 1} of {totalQuestions}
          </h2>
          <span className="text-sm font-medium text-dark-500">{progress}% Complete</span>
        </div>
        <ProgressBar value={currentIndex + 1} max={totalQuestions} />
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col max-w-3xl mx-auto w-full px-6 pb-4 overflow-y-auto">
        {submitError && submitErrorCode !== 'AI_UNAVAILABLE' && <Alert variant="error">{submitError}</Alert>}

        <div className="text-center space-y-3 py-8">
          <blockquote className="text-2xl font-bold text-dark-900 leading-tight text-balance">
            "{currentQuestion?.question}"
          </blockquote>
          {currentQuestion?.hint && (
            <p className="text-sm text-dark-400">{currentQuestion.hint}</p>
          )}
        </div>

        {/* Answer textarea */}
        <div className="relative rounded-2xl border border-dark-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent transition-all">
          {currentAnswer === '' && (
            <div className="absolute top-4 left-4 right-4 pointer-events-none">
              <p className="text-dark-300 text-sm">Type your response here...</p>
            </div>
          )}

          {/* AI Prompt tooltip */}
          {currentQuestion?.aiPrompt && (
            <div className="absolute left-4 top-12 z-10 max-w-[220px]">
              <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 shadow-sm">
                <p className="text-xs font-semibold text-brand-600 mb-1 flex items-center gap-1">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Prompt
                </p>
                <p className="text-xs text-brand-700 leading-relaxed">{currentQuestion.aiPrompt}</p>
              </div>
            </div>
          )}

          <textarea
            id={`interview-answer-${currentIndex}`}
            value={currentAnswer}
            onChange={handleAnswerChange}
            className="w-full min-h-[260px] resize-none p-4 text-sm text-dark-900 focus:outline-none bg-transparent"
            spellCheck
          />
        </div>

        {/* Answer meta */}
        <div className="flex items-center justify-between mt-3 text-xs text-dark-400">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Auto-saving...
            </span>
            <span className="h-3 w-px bg-dark-300" />
            <span>{wordCount} Words</span>
          </div>
          <div className="flex items-center gap-2">
            <button id="interview-microphone" aria-label="Voice input" className="btn-ghost p-1.5 rounded-lg">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </button>
            <button id="interview-settings" aria-label="Settings" className="btn-ghost p-1.5 rounded-lg">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <footer className="border-t border-dark-100 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-3xl mx-auto w-full">
        <button
          id="interview-prev-question"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 text-sm font-medium text-dark-600 hover:text-dark-900 disabled:opacity-40 disabled:cursor-not-allowed transition-colors w-full sm:w-auto justify-center sm:justify-start order-2 sm:order-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Previous Question
        </button>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto order-1 sm:order-2">
          {currentIndex < totalQuestions - 1 && (
            <Button id="interview-skip" variant="secondary" className="w-full sm:w-auto" onClick={handleSkip}>
              Skip for Now
            </Button>
          )}
          <Button
            id="interview-next-question"
            variant="primary"
            className="w-full sm:w-auto"
            loading={submitting}
            onClick={handleNext}
          >
            {currentIndex < totalQuestions - 1 ? 'Next Question' : 'Submit Answers'}
            {!submitting && (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
