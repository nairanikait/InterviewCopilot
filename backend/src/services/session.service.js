const InterviewSession = require('../models/InterviewSession');

/**
 * Returns all sessions for a user, sorted newest first.
 * @param {string} userId
 * @returns {Promise<InterviewSession[]>}
 */
const getUserSessions = async (userId) => {
  const sessions = await InterviewSession.find({ userId })
    .sort({ createdAt: -1 })
    .populate('resumeId', 'originalName createdAt')
    .lean();
  return sessions;
};

module.exports = { getUserSessions };
