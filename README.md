# AI Detection Tool

A simple, pattern-based AI detection system that analyzes text for AI-generated content signals.

## Overview

This tool uses **regex-based pattern matching** to detect characteristic patterns in AI-generated text, without the complexity of ML models or GPU infrastructure. It's fast, transparent, and privacy-focused with zero data retention.

## Features

- **20+ Detection Patterns**: Significance statements, AI meta-text, collaborative phrases, cultural clichés, and more
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

The system detects **21 AI writing patterns** grouped by severity:

### CRITICAL (20 points each)
- **AI self-references** - "as an AI language model", "as an AI assistant"
- **Knowledge cutoff disclaimers** - "as of my last update", "as at my latest training"

### HIGH (10 points each)
- **Collaborative phrases** - "let me know if", "I hope this helps", "would you like"
- **Significance statements** - "stands as a testament", "serves as a symbol"
- **Editorializing** - "it's important to note", "it is important to remember"
- **Placeholder templates** - "[insert example here]", "[placeholder text]"
- **Helpful closings** - "Certainly!", "Of course!", "here's a summary"

### MEDIUM (5 points each)
- **Cultural clichés** - "rich cultural heritage", "profound legacy", "rich historical tapestry"
- **Negative parallelisms** - "not only...but also", "not just...rather"
- **Vague attributions** - "studies show", "research suggests", "experts indicate"
- **Challenges/prospects** - "despite these challenges", "despite its challenges"
- **Worth mentioning** - "worth mentioning that", "it is worth mentioning"
- **Broken citations** - "[citation needed]", "[source]"
- **Emoji headings** - "# 🎯 Getting Started", "## 🚀 Features"

### LOW (2 points each)
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
    "pattern_engine_version": "1.0.0",
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

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

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

1.0.0 - Pattern Engine
