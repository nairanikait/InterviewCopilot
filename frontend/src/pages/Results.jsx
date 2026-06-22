import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAsync } from '../hooks/useAsync';
import { sessionService } from '../services/api';
import { ScoreRing } from '../components/common/ScoreRing';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';

/**
 * Results page – shows performance score, detailed feedback, and critical question analysis.
 * Matches the provided UI screenshot design.
 */
export default function Results() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const { loading, error, run } = useAsync();
  const [session, setSession] = useState(null);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  useEffect(() => {
    if (!sessionId) return;
    run(async () => {
      // Sessions endpoint returns array; find by id
      const res = await sessionService.getAll();
      const sessions = res.data?.sessions || res.data || [];
      const found = sessions.find((s) => (s._id || s.id) === sessionId);
      setSession(found || null);
    });
  }, [sessionId, run]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="h-8 w-8" color="text-dark-400" />
      </div>
    );
  }

  if (error) {
    return <Alert variant="error">{error}</Alert>;
  }

  if (!session) {
    return (
      <div className="card p-10 text-center">
        <p className="text-dark-500 text-sm">Session not found.</p>
        <Button variant="secondary" className="mt-4" onClick={() => navigate('/sessions')}>
          Back to Sessions
        </Button>
      </div>
    );
  }

  const questions = session.questions || [];
  const activeQ = questions[activeQuestionIndex];

  // Backend: overallScore is 0–10, ScoreRing expects 0–100
  const overallScore = session.overallScore ?? null;
  const normalizedScore = overallScore != null ? Math.round(overallScore * 10) : 0;

  const formattedDate = session.createdAt
    ? new Date(session.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : '—';

  // Backend stores duration in seconds if present
  const duration = session.duration
    ? `${Math.floor(session.duration / 60)}m ${session.duration % 60}s`
    : '—';

  // Backend returns overallFeedback as a single string, not { strengths, improvements }
  // Per-question feedback lives in questions[].feedback (string)
  // Build strengths/improvements by scanning per-question feedback scores
  const highScoreQs = questions.filter((q) => q.score != null && q.score >= 7);
  const lowScoreQs  = questions.filter((q) => q.score != null && q.score < 7);
  const strengths    = highScoreQs.map((q) => q.feedback).filter(Boolean);
  const improvements = lowScoreQs.map((q) => q.feedback).filter(Boolean);
  const overallFeedbackText = session.overallFeedback || '';

  return (
    <div className="animate-fade-in">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-dark-900">Interview Performance</h1>
          <p className="text-sm text-dark-500 mt-1">
            {session.role || 'Interview Session'} · {formattedDate}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            id="results-download-report"
            variant="secondary"
            onClick={() => window.print()}
          >
            Download Report
          </Button>
          <Button
            id="results-try-again"
            variant="primary"
            onClick={() => navigate('/interview')}
          >
            Try Again
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-5">
        {/* ── Left column ─────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Score ring card */}
          <div className="card p-6 flex flex-col items-center gap-4">
            <ScoreRing score={normalizedScore} max={100} />
            {overallFeedbackText && (
              <p className="text-xs text-dark-500 text-center leading-relaxed mt-2">
                {overallFeedbackText}
              </p>
            )}
          </div>

          {/* Session summary card */}
          <div className="card p-5 space-y-4">
            <h3 className="text-sm font-bold text-dark-900">Session Summary</h3>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-dark-100">
                {[
                  { label: 'Role', value: session.role || '—' },
                  { label: 'Date', value: formattedDate },
                  { label: 'Duration', value: duration },
                  { label: 'Questions', value: questions.length > 0 ? `${questions.length} Answered` : '—' },
                ].map(({ label, value }) => (
                  <tr key={label}>
                    <td className="py-2.5 text-dark-400 font-medium">{label}</td>
                    <td className="py-2.5 text-dark-900 text-right font-semibold">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* Detailed feedback */}
          <div className="card p-6">
            <h2 className="text-lg font-bold text-dark-900 mb-5">Detailed Feedback</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Strengths */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-green-600 flex items-center gap-1.5 mb-3">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Key Strengths
                </p>
                {strengths.length > 0 ? (
                  <ul className="space-y-2.5">
                    {strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-dark-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-dark-400">Feedback will appear after evaluation.</p>
                )}
              </div>

              {/* Areas for improvement */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-1.5 mb-3">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Areas for Improvement
                </p>
                {improvements.length > 0 ? (
                  <ul className="space-y-2.5">
                    {improvements.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-dark-700">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-red-400 flex-shrink-0" />
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-dark-400">Feedback will appear after evaluation.</p>
                )}
              </div>
            </div>
          </div>

          {/* Critical question analysis */}
          {questions.length > 0 && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-dark-900">Critical Question Analysis</h2>
                <span className="text-xs font-bold bg-dark-900 text-white px-2.5 py-1 rounded-full uppercase tracking-wide">
                  Question {activeQuestionIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Question navigator */}
              {questions.length > 1 && (
                <div className="flex gap-1.5 mb-5 flex-wrap">
                  {questions.map((_, i) => (
                    <button
                      key={i}
                      id={`results-question-tab-${i}`}
                      onClick={() => setActiveQuestionIndex(i)}
                      className={`h-7 px-3 rounded-full text-xs font-medium transition-colors ${
                        i === activeQuestionIndex
                          ? 'bg-dark-900 text-white'
                          : 'bg-dark-100 text-dark-500 hover:bg-dark-200'
                      }`}
                    >
                      Q{i + 1}
                    </button>
                  ))}
                </div>
              )}

              {activeQ && (
                <div className="space-y-4">
                  {/* Question text */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-dark-400 mb-2">The Question</p>
                    <blockquote className="text-sm font-medium text-dark-700 italic">
                      "{activeQ.text || activeQ.question}"
                    </blockquote>
                  </div>

                  {/* Answer comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-dark-400 flex items-center gap-1.5 mb-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Your Answer
                      </p>
                      <div className="rounded-xl border border-dark-200 bg-dark-50 p-3 text-sm text-dark-700 leading-relaxed min-h-[100px]">
                        {activeQ.answer || <span className="text-dark-400 italic">No answer recorded.</span>}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600 flex items-center gap-1.5 mb-2">
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        Improved Answer
                      </p>
                      <div className="rounded-xl border border-brand-200 bg-brand-50 p-3 text-sm text-dark-700 leading-relaxed min-h-[100px]">
                        {activeQ.feedback || <span className="text-dark-400 italic">Feedback will appear after evaluation.</span>}
                      </div>
                    </div>
                  </div>

                  {/* Expert insight */}
                  {activeQ.feedback && (
                    <div className="rounded-xl border border-dark-200 bg-dark-50 p-4 flex items-start gap-3">
                      <svg className="h-5 w-5 text-dark-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <div>
                        <p className="text-xs font-bold text-dark-700 mb-1">Question Feedback</p>
                        <p className="text-sm text-dark-600 leading-relaxed">{activeQ.feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
