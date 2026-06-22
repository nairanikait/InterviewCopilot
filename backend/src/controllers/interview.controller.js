const interviewService = require('../services/interview.service');
const { sendSuccess } = require('../utils/response');

const startInterview = async (req, res, next) => {
  try {
    const { resumeId, questionCount } = req.body;
    const session = await interviewService.startSession(
      req.user._id.toString(),
      resumeId,
      questionCount
    );

    return sendSuccess(
      res,
      {
        sessionId: session._id,
        status: session.status,
        questions: session.questions.map((q, i) => ({
          index: i,
          question: q.question,
        })),
      },
      201,
      'Interview session started.'
    );
  } catch (err) {
    next(err);
  }
};

const evaluateInterview = async (req, res, next) => {
  try {
    const { sessionId, answers } = req.body;
    const session = await interviewService.evaluateSession(
      sessionId,
      req.user._id.toString(),
      answers
    );

    return sendSuccess(
      res,
      {
        sessionId: session._id,
        status: session.status,
        overallScore: session.overallScore,
        overallFeedback: session.overallFeedback,
        questions: session.questions.map((q, i) => ({
          index: i,
          question: q.question,
          answer: q.answer,
          score: q.score,
          feedback: q.feedback,
        })),
      },
      200,
      'Interview evaluated successfully.'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { startInterview, evaluateInterview };
