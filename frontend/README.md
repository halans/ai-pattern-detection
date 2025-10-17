# Slop Detector - Frontend

React + TypeScript + Vite frontend for the Slop Detector.

## Features

- **Text Input**: Textarea with character counter and validation
- **File Upload**: Support for text, PDF, DOCX, Markdown, and HTML files
- **Results Display**: Clear visualization of analysis results
- **Pattern Breakdown**: Grouped by severity with examples
- **Confidence Score**: Visual progress bar and color coding
- **Export**: Download results as JSON, Markdown, or PDF
- **Responsive**: Mobile-friendly design with TailwindCSS
- **Theme Toggle**: Light/dark mode with system preference detection
- **Accessibility**: WCAG 2.1 compliant with full keyboard navigation

## Architecture

```
src/
├── components/
│   ├── TextInput.tsx     # Text input with validation and file upload
│   └── Results.tsx       # Results display with visualization
├── theme/
│   └── ThemeProvider.tsx # Theme state management and persistence
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   ├── api.ts            # API client and download utilities
│   ├── pdf.ts            # PDF export generation
│   ├── markdown.ts       # Markdown conversion
│   └── fileParser.ts     # File upload parsing
├── App.tsx               # Main application component
├── main.tsx              # React entry point with ThemeProvider
└── index.css             # Global styles and Tailwind
```

## Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
cd frontend
npm install
```

### Configuration

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` to point to your backend URL:

```
VITE_API_URL=http://localhost:8787
```

### Run Locally

```bash
npm run dev
```

App runs on `http://localhost:3000`

### Build

```bash
npm run build
```

Output in `dist/` directory.

### Testing

**Note**: Make sure you're in the `frontend/` directory before running these commands.

```bash
cd frontend  # Run this first!

# Run unit tests
npm test

# Run e2e tests with Playwright
npm run test:e2e

# Run e2e tests in UI mode (interactive)
npm run test:e2e:ui

# View last test report
npm run test:e2e:report
```

See [PLAYWRIGHT_GUIDE.md](PLAYWRIGHT_GUIDE.md) for detailed testing documentation.

## Components

### TextInput

- Textarea with character counter (100-20,000 chars)
- Real-time validation
- Submit button with loading state
- Disabled state during analysis
- File upload control for `.txt`, `.md`, `.html` with client-side validation

### Results

- Classification with color coding:
  - **Red**: Likely AI Slop (65-100)
  - **Yellow**: Mixed/Uncertain (35-64)
  - **Green**: Likely Human (0-34)
- Confidence score with progress bar
- Pattern breakdown grouped by severity
- Metadata display
- Submission source & file metadata (filename, type, processed length)
- Export buttons

## Color Scheme

- **AI-generated**: Red (`text-red-600`)
- **Mixed/Uncertain**: Yellow (`text-yellow-600`)
- **Human-written**: Green (`text-green-600`)

### Pattern Severity Colors

- **CRITICAL**: Red
- **HIGH**: Orange
- **MEDIUM**: Yellow
- **LOW**: Blue

## Deployment

### Cloudflare Pages

```bash
npm run build
# Deploy dist/ to Cloudflare Pages
```

### Environment Variables

Set `VITE_API_URL` to your production backend URL.

## License

MIT
