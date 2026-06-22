import { sessionService } from './api';

// ─── Placeholder used ONLY when backend returns no sessions ───────────────────
const PLACEHOLDER = {
  totalInterviews: 0,
  averageScore: null,
  strongestTopic: null,
  weakestTopic: null,
  lastSessionScore: null,
  prevSessionScore: null,
  lastDelta: null,
  recent: [],
};

/**
 * Derive analytics summary from raw session array.
 * Sessions are expected in newest-first order from the API.
 *
 * @param {Array} sessions  - raw InterviewSession objects from /api/sessions
 * @returns {Object}        - analytics shape consumed by useAnalytics
 */
function deriveAnalytics(sessions) {
  if (!sessions || sessions.length === 0) return PLACEHOLDER;

  const completed = sessions.filter((s) => s.status === 'completed' && s.overallScore != null);

  const totalInterviews = sessions.length;

  // Average score (0-10 → converted to 0-100 for display consistency)
  const averageScore =
    completed.length > 0
      ? Math.round(
          (completed.reduce((sum, s) => sum + (s.overallScore || 0), 0) / completed.length) * 10,
        )
      : null;

  // Topic frequency map: derive from question feedback keywords
  // Since the schema has no explicit topic field, we derive the "type" label
  // from the session itself (future: can use session.type when added)
  // For now, bucket by score quartile-based label
  const topicScores = {}; // { label: { total, count } }

  completed.forEach((s) => {
    s.questions?.forEach((q) => {
      if (q.score == null) return;
      // Infer topic from feedback keywords — lightweight heuristic
      const topic = inferTopic(q.feedback || '');
      if (!topicScores[topic]) topicScores[topic] = { total: 0, count: 0 };
      topicScores[topic].total += q.score;
      topicScores[topic].count += 1;
    });
  });

  const topicAverages = Object.entries(topicScores).map(([label, { total, count }]) => ({
    label,
    avg: total / count,
  }));

  topicAverages.sort((a, b) => b.avg - a.avg);

  const strongestTopic = topicAverages[0]?.label ?? null;
  const weakestTopic = topicAverages[topicAverages.length - 1]?.label ?? null;

  // Delta between last two completed sessions
  const lastSessionScore =
    completed[0] != null ? Math.round((completed[0].overallScore || 0) * 10) : null;
  const prevSessionScore =
    completed[1] != null ? Math.round((completed[1].overallScore || 0) * 10) : null;

  const lastDelta =
    lastSessionScore != null && prevSessionScore != null
      ? lastSessionScore - prevSessionScore
      : null;

  // Recent rows for history table (up to 5)
  const recent = sessions.slice(0, 5).map((s) => ({
    id: s._id || s.id,
    date: s.createdAt
      ? new Date(s.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '—',
    type: s.type || 'General',
    score: s.overallScore != null ? Math.round(s.overallScore * 10) : null,
    status: s.status || 'pending',
  }));

  return {
    totalInterviews,
    averageScore,
    strongestTopic,
    weakestTopic,
    lastSessionScore,
    prevSessionScore,
    lastDelta,
    recent,
  };
}

/**
 * Lightweight heuristic to categorise a question feedback string into a topic.
 * Extend this map as the platform grows without touching analytics logic.
 */
const TOPIC_KEYWORDS = {
  'System Design': ['system design', 'architecture', 'scalability', 'design'],
  Behavioral: ['behavioral', 'situation', 'star', 'teamwork', 'conflict', 'leadership'],
  Technical: ['technical', 'algorithm', 'data structure', 'code', 'complexity'],
  Communication: ['communication', 'clarity', 'concise', 'articulate', 'structure'],
  React: ['react', 'component', 'hook', 'state', 'props', 'jsx'],
  'Problem Solving': ['problem', 'solution', 'approach', 'optimise', 'optimize'],
};

function inferTopic(text) {
  const lower = text.toLowerCase();
  for (const [topic, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    if (keywords.some((kw) => lower.includes(kw))) return topic;
  }
  return 'General';
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Fetch and compute analytics for the authenticated user.
 * Falls back to placeholder data if the endpoint fails or returns no sessions.
 */
export const analyticsService = {
  getAnalytics: async () => {
    try {
      const res = await sessionService.getAll();
      const sessions = res.data?.sessions || res.data || [];
      return deriveAnalytics(sessions);
    } catch {
      // Backend unavailable – return neutral placeholder so the page still renders
      return PLACEHOLDER;
    }
  },
};
