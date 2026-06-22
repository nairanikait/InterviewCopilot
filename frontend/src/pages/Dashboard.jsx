import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useAsync } from '../hooks/useAsync';
import { sessionService, resumeService } from '../services/api';
import { StatCard } from '../components/cards/StatCard';
import { SessionCard } from '../components/cards/SessionCard';
import { ResumeCard } from '../components/cards/ResumeCard';
import { AIInsightBanner } from '../components/cards/AIInsightBanner';
import { DashboardSkeleton } from '../components/common/DashboardSkeleton';
import { Button } from '../components/common/Button';
import { Alert } from '../components/common/Alert';
import { ResumeUpload } from '../components/forms/ResumeUpload';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { loading, error, run } = useAsync();
  const [sessions, setSessions] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeUploading, setResumeUploading] = useState(false);
  const [resumeError, setResumeError] = useState('');
  const [resumeFileName, setResumeFileName] = useState(
    () => localStorage.getItem('ic_resume_name') || '',
  );
  // resumeId is persisted for Interview page to use in POST /interview/start
  const [resumeId, setResumeId] = useState(
    () => localStorage.getItem('ic_resume_id') || '',
  );

  // Fetch sessions on mount
  useEffect(() => {
    run(async () => {
      const res = await sessionService.getAll();
      // After envelope unwrap: res.data = { sessions: [...] }
      setSessions(res.data?.sessions || []);
    });
  }, [run]);

  const handleResumeUpload = async (file) => {
    setResumeFile(file);
    setResumeError('');
    setResumeUploading(true);
    try {
      const res = await resumeService.upload(file);
      // After envelope unwrap: res.data = { resumeId, originalName, createdAt }
      const { resumeId: newResumeId, originalName } = res.data;
      localStorage.setItem('ic_resume_name', originalName || file.name);
      localStorage.setItem('ic_resume_id', newResumeId);
      setResumeFileName(originalName || file.name);
      setResumeId(newResumeId);
      setShowUpload(false);
    } catch (err) {
      setResumeError(err?.message || 'Upload failed. Please try again.');
    } finally {
      setResumeUploading(false);
    }
  };

  // Derive metrics from sessions
  const completedCount = sessions.length;
  // Backend field is overallScore (number 0-10), not score
  const avgScore =
    completedCount > 0
      ? (sessions.reduce((sum, s) => sum + (s.overallScore || 0), 0) / completedCount).toFixed(1)
      : '—';
  const lastSession =
    sessions.length > 0
      ? (() => {
          const d = new Date(sessions[0].createdAt);
          const diffDays = Math.floor((Date.now() - d.getTime()) / 86400000);
          if (diffDays === 0) return 'Today';
          if (diffDays === 1) return 'Yesterday';
          return `${diffDays}d ago`;
        })()
      : '—';

  const recentSessions = sessions.slice(0, 3);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-6 animate-fade-in">
      {error && <Alert variant="error">{error}</Alert>}

      {/* ── Hero + Resume row ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">
        {/* Welcome hero */}
        <div className="card relative overflow-hidden px-7 py-6 flex flex-col justify-between min-h-[180px]">
          {/* Decorative icon */}
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-5">
            <svg className="h-40 w-40 text-dark-900" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={0.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div className="space-y-2 relative z-10">
            <h2 className="text-2xl font-bold text-dark-900">
              Welcome back, {user?.name?.split(' ')[0] || 'there'}.
            </h2>
            <p className="text-sm text-dark-500 max-w-sm">
              Ready for your next mock interview? Your dream role is just a few sessions away.
            </p>
          </div>
          <Button
            id="dashboard-start-interview"
            variant="primary"
            className="self-start mt-4 relative z-10"
            onClick={() => navigate('/interview')}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start New Mock Interview
          </Button>
        </div>

        {/* Resume card */}
        <ResumeCard
          fileName={resumeFileName}
          status={resumeFileName ? 'OPTIMIZED' : undefined}
          onUpdate={() => setShowUpload((v) => !v)}
        />
      </div>

      {/* Resume upload drawer */}
      {showUpload && (
        <div className="card p-5 space-y-3 animate-fade-in">
          <h3 className="text-sm font-semibold text-dark-900">Upload new resume</h3>
          <ResumeUpload onFile={handleResumeUpload} currentFileName={resumeFile?.name} />
          {resumeError && <Alert variant="error">{resumeError}</Alert>}
          {resumeUploading && (
            <p className="text-xs text-dark-400 animate-pulse">Uploading...</p>
          )}
        </div>
      )}

      {/* ── Stats row ─────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Interviews Completed"
          value={completedCount}
          icon={
            <svg className="h-5 w-5 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          }
        />
        <StatCard
          label="Average Score"
          value={avgScore !== '—' ? `${avgScore} /10` : '—'}
          icon={
            <svg className="h-5 w-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
        />
        <StatCard
          label="Last Session"
          value={lastSession}
          icon={
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
      </div>

      {/* ── Recent Sessions ───────────────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-dark-900">Recent Sessions</h3>
          <button
            id="dashboard-view-all-history"
            onClick={() => navigate('/sessions')}
            className="text-sm text-dark-500 hover:text-dark-900 font-medium transition-colors"
          >
            View All History
          </button>
        </div>

        {recentSessions.length === 0 ? (
          <div className="card px-5 py-10 text-center">
            <p className="text-sm text-dark-400">No sessions yet. Start your first mock interview!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentSessions.map((session) => (
              <SessionCard key={session._id || session.id} session={session} />
            ))}
          </div>
        )}
      </div>

      {/* ── AI Insight ───────────────────────────────────────────────── */}
      <AIInsightBanner message="Based on your last sessions, focus on structuring your answers with the STAR method and quantifying your impact for stronger responses." />
    </div>
  );
}
