// Main API entry point for Cloudflare Workers
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { PatternAnalyzer } from './patterns/analyzer';
import { TextNormalizer } from './preprocessing/normalizer';
import { ReportGenerator } from './reporting/generator';
import { FileParser, FileProcessingError } from './file-processing/parser';

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
    service: 'Slop Detector',
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
      warnings,
      {
        submissionSource: 'text',
      }
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

app.post('/api/analyze/file', async (c) => {
  const startTime = Date.now();

  try {
    const contentType = c.req.header('Content-Type') || '';
    if (!contentType.includes('multipart/form-data')) {
      return c.json(
        {
          error: 'Invalid request',
          message: 'Content-Type must be multipart/form-data',
        },
        400
      );
    }

    const formData = await c.req.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return c.json(
        {
          error: 'Invalid request',
          message: 'Expected a file upload with form field "file"',
        },
        400
      );
    }

    const parsed = await FileParser.parse(file);
    const normalizedText = parsed.text;

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

    const formattingAnalysis = TextNormalizer.analyzeFormatting(normalizedText);
    const patternMatches = analyzer.analyze(normalizedText);
    const score = analyzer.calculateScore(patternMatches);
    const classification = analyzer.classify(score);
    const explanation = analyzer.generateExplanation(classification, patternMatches);

    const characterCount = TextNormalizer.countCharacters(normalizedText);
    const wordCount = TextNormalizer.countWords(normalizedText);
    const duration = Date.now() - startTime;

    const report = ReportGenerator.generate(
      classification,
      score,
      patternMatches,
      explanation,
      characterCount,
      wordCount,
      duration,
      formattingAnalysis.warnings,
      {
        submissionSource: 'file',
        fileMetadata: {
          name: parsed.metadata.name,
          type: parsed.metadata.type,
          character_count: parsed.metadata.characterCount,
        },
      }
    );

    return c.json(report);
  } catch (error) {
    if (error instanceof FileProcessingError) {
      return c.json(
        {
          error: 'File processing error',
          message: error.message,
        },
        error.status
      );
    }

    console.error('File analysis error:', error);
    return c.json(
      {
        error: 'Internal server error',
        message: 'An error occurred while processing your request',
      },
      500
    );
  }
});

export default app;
