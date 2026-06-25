const { ZodError } = require('zod');

/**
 * Express global error handler.
 * Must be registered AFTER all routes (4-arg signature required by Express).
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, _req, res, _next) => {
  console.error('[Error]', err);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'File too large.' });
  }
  if (err.message === 'Only PDF files are accepted.') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed.',
      errors: err.errors.map((e) => ({ field: e.path.join('.'), message: e.message })),
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    return res.status(409).json({ success: false, message: `${field} is already in use.` });
  }

  // Mongoose validation
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages.join(' ') });
  }

  // AI specific errors
  if (err.code === 'AI_UNAVAILABLE') {
    return res.status(503).json({
      success: false,
      code: 'AI_UNAVAILABLE',
      retryable: true,
      message: err.message
    });
  }

  const statusCode = err.statusCode || 500;
  const message = statusCode < 500 ? err.message : 'Internal server error.';
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { errorHandler };
