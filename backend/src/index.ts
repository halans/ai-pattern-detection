// Main API entry point for Cloudflare Workers
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PatternAnalyzer } from './patterns/analyzer';
import { TextNormalizer } from './preprocessing/normalizer';
import { ReportGenerator } from './reporting/generator';

const app = new Hono();

// Enable CORS for frontend access
app.use('/*', cors({
  origin: '*', // Configure appropriately for production
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

// Initialize pattern analyzer once
const analyzer = new PatternAnalyzer();

// Health check endpoint
app.get('/', (c) => {
  return c.json({
    service: 'Slop Detection Tool',
    version: '1.0.0',
    status: 'operational',
  });
});

// Text analysis endpoint
app.post('/api/analyze', async (c) => {
  const startTime = Date.now();

  try {
    const body = await c.req.json();
    const { text } = body;

    if (!text || typeof text !== 'string') {
      return c.json(
        {
          error: 'Missing or invalid text field',
          message: 'Request body must contain a "text" field with string content',
        },
        400
      );
    }

    // Normalize text
    const normalizedText = TextNormalizer.normalize(text);

    // Validate text length
    const validation = TextNormalizer.validate(normalizedText);
    if (!validation.valid) {
      return c.json(
        {
          error: 'Validation error',
          message: validation.error,
        },
        400
      );
    }

    // Analyze formatting
    const formattingAnalysis = TextNormalizer.analyzeFormatting(normalizedText);
    const warnings = formattingAnalysis.warnings;

    // Analyze patterns
    const patternMatches = analyzer.analyze(normalizedText);

    // Calculate score and classification
    const score = analyzer.calculateScore(patternMatches);
    const classification = analyzer.classify(score);

    // Generate explanation
    const explanation = analyzer.generateExplanation(classification, patternMatches);

    // Collect metadata
    const characterCount = TextNormalizer.countCharacters(normalizedText);
    const wordCount = TextNormalizer.countWords(normalizedText);
    const duration = Date.now() - startTime;

    // Generate report
    const report = ReportGenerator.generate(
      classification,
      score,
      patternMatches,
      explanation,
      characterCount,
      wordCount,
      duration,
      warnings
    );

    return c.json(report);
  } catch (error) {
    console.error('Analysis error:', error);
    return c.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
      },
      500
    );
  }
});

// File analysis endpoint (placeholder - will be implemented with file parsing libraries)
app.post('/api/analyze/file', async (c) => {
  return c.json(
    {
      error: 'Not implemented',
      message: 'File analysis endpoint is not yet implemented. Use /api/analyze for text input.',
    },
    501
  );
});

export default app;
