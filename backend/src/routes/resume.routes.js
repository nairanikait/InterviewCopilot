const { Router } = require('express');
const { uploadResume } = require('../controllers/resume.controller');
const { authenticate } = require('../middleware/auth');
const { upload } = require('../config/multer');

const router = Router();

// POST /api/resume/upload
router.post('/upload', authenticate, upload.single('resume'), uploadResume);

module.exports = router;
