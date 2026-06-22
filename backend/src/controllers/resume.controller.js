const resumeService = require('../services/resume.service');
const { sendSuccess } = require('../utils/response');

const uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded. Please attach a PDF.' });
    }

    const resume = await resumeService.uploadResume(req.file, req.user._id.toString());

    return sendSuccess(
      res,
      {
        resumeId: resume._id,
        originalName: resume.originalName,
        createdAt: resume.createdAt,
      },
      201,
      'Resume uploaded and parsed successfully.'
    );
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadResume };
