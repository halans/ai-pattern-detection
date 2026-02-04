// Main API entry point for Cloudflare Workers
import { Hono } from 'hono';
import type { Context } from 'hono';
import { cors } from 'hono/cors';
import { PatternAnalyzer } from './patterns/analyzer';
import { TextNormalizer } from './preprocessing/normalizer';
import { ReportGenerator } from './reporting/generator';
import { FileParser, FileProcessingError } from './file-processing/parser';

const app = new Hono();

const ALLOWED_ORIGINS = new Set([
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:8788',
  'https://slopdetector.me',
  'https://slop.halans.dev',
  'https://ai.slopdetector.me',
  'https://ai.socialrecommendator.com',
]);

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const MAX_JSON_BYTES = 50_000;
const MAX_FILE_BYTES = 1_000_000;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Enable CORS for frontend access
app.use('/*', cors({
  origin: (origin) => {
    if (!origin) {
      return '*';
    }

    if (origin.startsWith('chrome-extension://')) {
      return origin;
    }

    if (ALLOWED_ORIGINS.has(origin)) {
      return origin;
    }

    return null;
  },
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}));

app.use('/*', async (c, next) => {
  await next();

  c.header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'no-referrer');
  c.header('Permissions-Policy', 'interest-cohort=()');
  c.header('Cache-Control', 'no-store');
  c.header('X-Frame-Options', 'DENY');
});

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
    const rateLimitResponse = enforceRateLimit(c);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    const lengthHeader = c.req.header('Content-Length');
    if (lengthHeader && Number(lengthHeader) > MAX_JSON_BYTES) {
      return c.json(
        {
          error: 'Payload too large',
          message: `Request body exceeds ${MAX_JSON_BYTES} bytes`,
        },
        413
      );
    }

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
    const rateLimitResponse = enforceRateLimit(c);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

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

    if (!isFileUpload(file)) {
      return c.json(
        {
          error: 'Invalid request',
          message: 'Expected a file upload with form field "file"',
        },
        400
      );
    }

    if (file.size > MAX_FILE_BYTES) {
      return c.json(
        {
          error: 'Payload too large',
          message: `File exceeds ${MAX_FILE_BYTES} bytes`,
        },
        413
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
        error.status as 400 | 413 | 415 | 422 | 500
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

function enforceRateLimit(c: Context) {
  const now = Date.now();
  const clientId =
    c.req.header('CF-Connecting-IP') ||
    c.req.header('X-Forwarded-For')?.split(',')[0]?.trim() ||
    'unknown';

  const current = rateLimitStore.get(clientId);
  if (!current || now > current.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return null;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return c.json(
      {
        error: 'Rate limit exceeded',
        message: 'Too many requests, please try again later',
      },
      429
    );
  }

  current.count += 1;
  rateLimitStore.set(clientId, current);
  return null;
}

function isFileUpload(value: unknown): value is File {
  return (
    !!value &&
    typeof value === 'object' &&
    'name' in value &&
    'size' in value &&
    'type' in value
  );
}
