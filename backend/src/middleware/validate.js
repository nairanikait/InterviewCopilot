
/**
 * Validates req.body against a Zod schema.
 * Passes ZodError to the global error handler on failure.
 */
const validate = (schema) => (req, _res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    next(err); // errorHandler handles ZodError
  }
};

module.exports = { validate };
