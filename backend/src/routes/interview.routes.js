const { Router } = require('express');
const { startInterview, evaluateInterview } = require('../controllers/interview.controller');
const { authenticate } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { aiLimiter } = require('../middleware/rateLimiter');
const { startInterviewSchema, evaluateInterviewSchema } = require('./interview.schema');

const router = Router();

// All interview routes require authentication
router.use(authenticate);

// POST /api/interview/start
router.post('/start', aiLimiter, validate(startInterviewSchema), startInterview);

// POST /api/interview/evaluate
router.post('/evaluate', aiLimiter, validate(evaluateInterviewSchema), evaluateInterview);

module.exports = router;
