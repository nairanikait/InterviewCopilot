const { z } = require('zod');

const startInterviewSchema = z.object({
  resumeId: z.string().min(1, 'resumeId is required.'),
  questionCount: z.number().int().min(1).max(20).default(5).optional(),
});

const evaluateInterviewSchema = z.object({
  sessionId: z.string().min(1, 'sessionId is required.'),
  answers: z
    .array(
      z.object({
        questionIndex: z.number().int().min(0),
        answer: z.string().max(5000, 'Answer exceeds maximum length.').default(''),
      })
    )
    .min(1, 'At least one answer is required.'),
});

module.exports = { startInterviewSchema, evaluateInterviewSchema };
