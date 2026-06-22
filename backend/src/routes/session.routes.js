const { Router } = require('express');
const { getSessions } = require('../controllers/session.controller');
const { authenticate } = require('../middleware/auth');

const router = Router();

// GET /api/sessions
router.get('/', authenticate, getSessions);

module.exports = router;
