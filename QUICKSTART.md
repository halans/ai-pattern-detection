# Quick Start Guide

Get the Slop Detector running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- Terminal/Command line

## Step 1: Install Backend Dependencies

```bash
cd backend
npm install
```

## Step 2: Start Backend Server

```bash
npm run dev
```

You should see:
```
⛅️ wrangler 3.x.x
------------------
[wrangler:inf] Ready on http://localhost:8787
```

Keep this terminal open.

## Step 3: Install Frontend Dependencies

Open a **new terminal** window:

```bash
cd frontend
npm install
```

## Step 4: Configure Frontend

```bash
cp .env.example .env
```

The default configuration points to `http://localhost:8787` which should work with the backend running locally.

## Step 5: Start Frontend

```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
```

## Step 6: Open Browser

Navigate to: **http://localhost:3000**

## Step 7: Test the Tool

1. Paste some text into the textarea (minimum 100 characters)
2. Click "Analyze Text"
3. View the results showing:
   - Classification (AI-generated, Mixed, or Human-written)
   - Confidence score
   - Detected patterns
   - Metadata

### Example Test Text

Try this AI-like text:

```
I hope this helps! Let me know if you need anything else. It's important to note
that this stands as a testament to the capabilities of modern systems. As an AI
language model, I can provide assistance with various tasks. Would you like me
to explain further? Here's a comprehensive overview of the topic.
```

This should score high for AI-generated content due to multiple collaborative phrases and AI self-references.

### Example Human Text

Try this human-written text:

```
I went to the store yesterday and bought some groceries. The weather was nice,
so I decided to walk instead of driving. On my way home, I ran into an old
friend from college. We grabbed coffee and caught up for about an hour. It was
really great to see them again after all these years.
```

This should score low for AI-generated content.

## Testing the API Directly

You can also test the backend API directly:

```bash
curl -X POST http://localhost:8787/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"text":"I hope this helps! Let me know if you need anything else. As an AI language model, I can assist with various tasks."}'
```

## Troubleshooting

### Backend won't start

- Make sure you're in the `backend/` directory
- Run `npm install` again
- Check Node.js version: `node --version` (should be 18+)

### Frontend won't connect to backend

- Make sure backend is running on port 8787
- Check `.env` file has correct `VITE_API_URL`
- Look for CORS errors in browser console

### Port already in use

If port 3000 or 8787 is already in use:

**Backend:** Edit `wrangler.toml` to change port
**Frontend:** Vite will automatically use next available port

## What's Next?

- Read the full [README.md](README.md) for complete documentation
- Check [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) for technical details
- Explore the pattern registry in `backend/src/patterns/registry.ts`
- Review the OpenSpec proposal in `openspec/changes/add-ai-detection-tool/`

## Development Commands

### Backend

```bash
cd backend
npm run dev      # Start dev server
npm run deploy   # Deploy to Cloudflare Workers
npm test         # Run tests (when implemented)
npm run lint     # Run ESLint
```

### Frontend

```bash
cd frontend
npm run dev      # Start dev server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Production Deployment

See [README.md](README.md) for deployment instructions to Cloudflare Workers and Cloudflare Pages.

---

**Questions?** Check the documentation or open an issue!
