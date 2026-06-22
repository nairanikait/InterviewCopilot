import { useEffect, useState } from 'react';
import { useAsync } from '../hooks/useAsync';
import { sessionService } from '../services/api';
import { SessionCard } from '../components/cards/SessionCard';
import { Alert } from '../components/common/Alert';
import { Spinner } from '../components/common/Spinner';

/**
 * Sessions page – full history of all interview sessions.
 */
export default function Sessions() {
  const { loading, error, run } = useAsync();
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    run(async () => {
      const res = await sessionService.getAll();
      setSessions(res.data?.sessions || res.data || []);
    });
  }, [run]);

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-dark-900">Session History</h1>
        <p className="text-sm text-dark-500 mt-1">All your past mock interview sessions.</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <Spinner size="h-8 w-8" color="text-dark-400" />
        </div>
      ) : sessions.length === 0 ? (
        <div className="card px-5 py-16 text-center">
          <svg className="h-12 w-12 text-dark-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm font-semibold text-dark-500">No sessions yet</p>
          <p className="text-xs text-dark-400 mt-1">Start your first mock interview to see results here.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => (
            <SessionCard key={session._id || session.id} session={session} />
          ))}
        </div>
      )}
    </div>
  );
}
