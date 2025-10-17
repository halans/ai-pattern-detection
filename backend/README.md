# Slop Detector - Backend

Pattern-based AI detection system running on Cloudflare Workers.

## Features

- **Pattern-Based Detection**: 20+ regex patterns detecting AI writing signals
- **Fast**: <50ms CPU time per analysis
- **Privacy-First**: Zero data retention, ephemeral processing
- **Serverless**: Cloudflare Workers with automatic scaling

## Architecture

```
src/
├── index.ts              # Main API entry point
├── types/                # TypeScript type definitions
├── patterns/
│   ├── registry.ts       # Pattern definitions and weights
│   └── analyzer.ts       # Pattern matching engine
├── preprocessing/
│   └── normalizer.ts     # Text normalization and validation
└── reporting/
    └── generator.ts      # Report generation
```

## API Endpoints

### `POST /api/analyze`

Analyze text for AI-generated content patterns.

**Request:**
```json
{
  "text": "Your text content here..."
}
```

**Response:**
```json
{
  "classification": "Likely AI Slop" | "Mixed/Uncertain" | "Likely Human",
  "confidence_score": 75,
  "patterns_detected": [
    {
      "patternId": "ai-self-reference",
      "patternName": "AI Self-Reference",
      "severity": "CRITICAL",
      "matches": [...],
      "count": 2
    }
  ],
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

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd backend
npm install
```

### Run Locally

```bash
npm run dev
```

Server runs on `http://localhost:8787`

### Deploy

```bash
npm run deploy
```

## Pattern Registry

The system detects **21 AI writing patterns** grouped by severity:

### CRITICAL (20 points)
- AI self-references ("as an AI language model")
- Knowledge cutoff disclaimers ("as of my last update")

### HIGH (10 points)
- Collaborative phrases ("let me know if", "I hope this helps", "would you like")
- Significance statements ("stands as a testament")
- Editorializing ("it's important to note")
- Placeholder templates ("[insert example here]")
- Helpful closings ("Certainly!", "here's a summary")

### MEDIUM (5 points)
- Cultural clichés ("rich cultural heritage", "profound legacy")
- Negative parallelisms ("not only...but also")
- Vague attributions ("studies show")
- Challenges/prospects ("despite these challenges")
- Worth mentioning ("worth mentioning that")
- Broken citations ("[citation needed]")
- Emoji headings ("# 🎯 Features")

### LOW (2 points)
- Ritual conclusions ("in summary", "overall")
- Artificial ranges ("from X to Y")
- Title case headings ("# The Complete Guide To...")
- Em-dash spam (excessive use of —)

## Scoring

```
Total Score = Σ (pattern_weight × match_count)
Normalized Score = min(100, Total Score)

Classification Thresholds:
- 0-34: Likely Human
- 35-64: Mixed/Uncertain
- 65-100: Likely AI Slop
```

## Performance

- Target: <50ms CPU time per request
- Typical: 20-40ms for 1000-word text
- Max input: 20,000 characters

## Privacy

- **Zero data retention**: No text is stored
- **Ephemeral processing**: All processing in memory
- **No logging**: Text content never logged
- **GDPR/CCPA compliant**: No personal data collected

## Testing

```bash
npm test
npm run test:coverage
```

## License

MIT
