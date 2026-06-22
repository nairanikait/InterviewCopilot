const sessionService = require('../services/session.service');
const { sendSuccess } = require('../utils/response');

const getSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.getUserSessions(req.user._id.toString());
    return sendSuccess(res, { sessions }, 200, 'Sessions retrieved.');
  } catch (err) {
    next(err);
  }
};

module.exports = { getSessions };
