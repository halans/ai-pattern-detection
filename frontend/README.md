# Slop Detection Tool - Frontend

React + TypeScript + Vite frontend for the Slop Detection Tool.

## Features

- **Text Input**: Textarea with character counter and validation
- **Results Display**: Clear visualization of analysis results
- **Pattern Breakdown**: Grouped by severity with examples
- **Confidence Score**: Visual progress bar and color coding
- **Export**: Download results as JSON
- **Responsive**: Mobile-friendly design with TailwindCSS
- **Dark Mode**: Automatic dark mode support

## Architecture

```
src/
├── components/
│   ├── TextInput.tsx     # Text input with validation
│   └── Results.tsx       # Results display with visualization
├── types/
│   └── index.ts          # TypeScript type definitions
├── utils/
│   └── api.ts            # API client and utilities
├── App.tsx               # Main application component
├── main.tsx              # React entry point
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

## Components

### TextInput

- Textarea with character counter (100-20,000 chars)
- Real-time validation
- Submit button with loading state
- Disabled state during analysis

### Results

- Classification with color coding:
  - **Red**: Likely AI Slop (70-100)
  - **Yellow**: Mixed/Uncertain (31-69)
  - **Green**: Likely Human (0-30)
- Confidence score with progress bar
- Pattern breakdown grouped by severity
- Metadata display
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
