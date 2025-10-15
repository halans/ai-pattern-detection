# AI Detection Tool

A simple, pattern-based AI detection system that analyzes text for AI-generated content signals.

## Overview

This tool uses **regex-based pattern matching** to detect characteristic patterns in AI-generated text, without the complexity of ML models or GPU infrastructure. It's fast, transparent, and privacy-focused with zero data retention.

## Features

- **45 Detection Patterns**: Significance statements, AI meta-text, collaborative phrases, cultural clichés, AI-favored vocabulary, business jargon, data analysis phrases, and more
- **Fast Analysis**: <50ms CPU time per request
- **Privacy-First**: Zero data retention, ephemeral processing
- **Transparent**: See exactly which patterns were detected
- **No ML Required**: Simple pattern matching, no transformers or GPUs
- **Serverless**: Cloudflare Workers backend with automatic scaling

## Architecture

```
ai-detection/
├── backend/          # Cloudflare Workers API (TypeScript)
│   ├── src/
│   │   ├── patterns/     # Pattern registry and analyzer
│   │   ├── preprocessing/# Text normalization
│   │   ├── reporting/    # Report generation
│   │   └── index.ts      # Hono API
│   └── package.json
│
├── frontend/         # React + Vite + TailwindCSS
│   ├── src/
│   │   ├── components/   # TextInput, Results
│   │   ├── utils/        # API client
│   │   └── App.tsx
│   └── package.json
│
└── openspec/         # OpenSpec proposal and specs
```

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on `http://localhost:8787`

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Frontend runs on `http://localhost:3000`

## Pattern Detection

The system detects **45 AI writing patterns** grouped by severity:

### CRITICAL (20 points each)
- **AI self-references** - "as an AI language model", "as an AI assistant"
- **Knowledge cutoff disclaimers** - "as of my last update", "as at my latest training"

### HIGH (10 points each)
- **Collaborative phrases** - "let me know if", "I hope this helps", "would you like"
- **Significance statements** - "stands as a testament", "serves as a symbol"
- **Editorializing** - "it's important to note", "it is important to remember"
- **Placeholder templates** - "[insert example here]", "[placeholder text]"
- **Helpful closings** - "Certainly!", "Of course!", "here's a summary"
- **Data analysis jargon** - "deliver actionable insights through in-depth data analysis", "leveraging data-driven insights", "drive insightful data-driven decisions"
- **Business/tech jargon** - "bandwidth", "stakeholders", "value proposition", "scalable", "paradigm shift", "synergy", "ROI"

### MEDIUM (5 points each)
- **Cultural clichés** - "rich cultural heritage", "profound legacy", "rich historical tapestry"
- **Negative parallelisms** - "not only...but also", "not just...rather"
- **Vague attributions** - "studies show", "research suggests", "experts indicate"
- **Challenges/prospects** - "despite these challenges", "despite its challenges"
- **Worth mentioning** - "worth mentioning that", "it is worth mentioning"
- **Stock phrases** - "a testament to", "it's important to note that", "this is not an exhaustive list"
- **Communication styles** - "furthermore", "on the other hand", "as previously mentioned"
- **Action words** - "unlock the secrets", "delve into", "harness", "revolutionize", "elevate", "envision", "transcend", "galvanize"
- **Contextual phrases** - "in the world of", "in today's digital age/era", "when it comes to", "folks"
- **Conductor/music analogies** - "like a conductor", "orchestrate", "symphony"
- **Hyperbolic phrases** - "break barriers", "cannot be overstated", "unwavering"
- **Connectives** - "conversely", "along with", "amidst", "towards"
- **Empowerment verbs** - "empower", "embrace", "grasp", "hinder"
- **Deep + noun patterns** - "deep understanding", "deep insights", "deep dive"
- **Hustle and bustle** - Urban energy cliché phrase
- **Quantity phrases** - "a plethora of", "a multitude of", "a journey of"
- **Significance intensifiers** - "paramount", "pivotal", "undeniable", "demonstrates significant"
- **Broken citations** - "[citation needed]", "[source]"
- **Emoji headings** - "# 🎯 Getting Started", "## 🚀 Features"

### LOW (2 points each)
- **AI transitional words** - "accordingly", "moreover", "nevertheless", "nonetheless", "thus", "undoubtedly"
- **AI-favored adjectives** - "robust", "seamless", "innovative", "holistic", "nuanced", "multifaceted", "groundbreaking", "quintessential", "visionary", "revolutionary", "paradigm-shifting"
- **AI-favored nouns** - "landscape", "realm", "tapestry", "expertise", "paradigm", "kaleidoscope", "epitome", "odyssey", "pinnacle", "nexus", "spectrum"
- **AI-favored verbs** - "delve", "facilitate", "underscore", "augment", "leverage", "utilize"
- **AI descriptors** - "meticulous", "ever-evolving", "cutting-edge", "labyrinthine", "gossamer", "key", "valuable", "fresh perspectives"
- **Ritual conclusions** - "in summary", "overall", "in conclusion"
- **Artificial ranges** - "from beginners to experts", "from design to deployment"
- **Title case headings** - "# The Complete Guide To Modern Development"
- **Em-dash spam** - Excessive use of em-dashes (—) in text

## Scoring

```
Total Score = Σ (pattern_weight × match_count)
Normalized Score = min(100, Total Score)

Classification Thresholds:
- 0-30:   Likely Human-written
- 31-69:  Mixed/Uncertain
- 70-100: Likely AI-generated
```

## API

### `POST /api/analyze`

**Request:**
```json
{
  "text": "Your text to analyze here..."
}
```

**Response:**
```json
{
  "classification": "Likely AI-generated",
  "confidence_score": 75,
  "patterns_detected": [...],
  "explanation": "...",
  "metadata": {
    "character_count": 1500,
    "word_count": 250,
    "pattern_engine_version": "1.2.0",
    "analysis_duration": 45,
    "timestamp": "2025-10-13T...",
    "warnings": []
  }
}
```

## Privacy

- **Zero Data Retention**: No text is stored
- **Ephemeral Processing**: All processing in memory
- **No Logging**: Text content never logged
- **GDPR/CCPA Compliant**: No personal data collected

## Performance

- **Target**: <50ms CPU time per request
- **Typical**: 20-40ms for 1000-word text
- **Max Input**: 20,000 characters

## Deployment

### Backend (Cloudflare Workers)

```bash
cd backend
npm run deploy
```

### Frontend (Cloudflare Pages)

```bash
cd frontend
npm run build
# Deploy dist/ to Cloudflare Pages
```

## Development

### Backend Structure
- `patterns/registry.ts` - Pattern definitions
- `patterns/analyzer.ts` - Pattern matching engine
- `preprocessing/normalizer.ts` - Text normalization
- `reporting/generator.ts` - Report generation
- `index.ts` - Hono API routes

### Frontend Structure
- `components/TextInput.tsx` - Text input with validation
- `components/Results.tsx` - Results visualization
- `utils/api.ts` - API client
- `App.tsx` - Main application

## Testing

### Backend Tests

The backend includes comprehensive test coverage using Vitest:

```bash
cd backend
npm test                  # Run all tests
npm run test:coverage     # Run tests with coverage report
```

**Test Suites:**
- **Pattern Registry Tests** (`registry.test.ts`) - 22 tests
  - Pattern structure validation
  - Pattern matching accuracy
  - Helper function correctness
  - Version validation

- **Analyzer Tests** (`analyzer.test.ts`) - 18 tests
  - Text analysis accuracy
  - Score calculation
  - Classification thresholds
  - Performance benchmarks

- **API Endpoint Tests** (`index.test.ts`) - 15 tests
  - Request/response validation
  - Error handling
  - Input validation
  - CORS configuration
  - Performance testing

**Total: 55+ backend tests**

### Frontend Tests

Frontend testing can be added using Vitest + React Testing Library:

```bash
cd frontend
npm test
```

### Running Specific Tests

```bash
# Run only pattern registry tests
npm test -- --run registry.test.ts

# Run only analyzer tests
npm test -- --run analyzer.test.ts

# Run only API tests
npm test -- --run index.test.ts

# Run with watch mode (development)
npm test
```

### Test Configuration

The tests use Vitest with a custom configuration (`vitest.config.ts`) that:
- Uses single fork mode to prevent memory issues
- Sets appropriate timeouts for pattern matching tests
- Enables Node environment for backend testing

### Known Issues & Workarounds

**Memory Issues:** Due to the comprehensive regex pattern matching (45 patterns), tests may encounter memory limits when run all together.

**Recommended approach:**
```bash
# Run test files individually
npm test -- --run registry.test.ts
npm test -- --run analyzer.test.ts
npm test -- --run index.test.ts

# Or increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm test -- --run
```

**Why this happens:** The pattern analyzer processes text against 45 complex regex patterns. While individual file tests work fine, running all tests concurrently can exceed default memory limits.

**Production impact:** None - the API runs efficiently in Cloudflare Workers with proper memory management. This only affects comprehensive test execution.

## OpenSpec

This project follows the OpenSpec proposal workflow. See `openspec/changes/add-ai-detection-tool/` for:
- `proposal.md` - Project rationale and requirements
- `design.md` - Technical decisions and architecture
- `tasks.md` - Implementation checklist
- `specs/` - Detailed specifications for each capability

## License

MIT

## Contributing

Pattern contributions welcome! To add new patterns:

1. Add pattern to `backend/src/patterns/registry.ts`
2. Assign appropriate severity and weight
3. Test against AI and human samples
4. Submit PR with examples

## Authors

JJ Halans

## Version

1.2.0 - Pattern Engine (45 patterns - Comprehensive coverage of AI writing patterns including business jargon, vocabulary, and contextual phrases)
