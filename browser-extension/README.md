# Slop Detector Chrome Extension

Chrome side panel extension that captures webpage text or highlighted selections and submits them to the Slop Detector API.

## Getting Started

1. Install dependencies:

```bash
cd browser-extension
npm install
```

2. (Optional) Set a custom API endpoint for development (defaults to `https://api.slopdetector.me`):

```bash
export VITE_EXTENSION_API_URL=http://localhost:8787
```

3. Build the extension:

```bash
npm run build
```

The compiled output is generated in `browser-extension/dist/`.

4. Load in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Choose **Load unpacked** and select `browser-extension/dist`

## Development

- `npm run dev` – builds the extension in watch mode
- `npm run build` – production build
- `npm run lint` – TypeScript checks

## How It Works

- Content script collects text (selection or full page) and responds to messages from the background service worker.
- Side panel UI (React) displays a preview, calls the API, and renders formatted results.
- API base URL defaults to `https://api.slopdetector.me` and can be overridden at build time with `VITE_EXTENSION_API_URL`.

## Permissions

- `activeTab`, `scripting`, `sidePanel`
- Host permissions: `https://api.slopdetector.me/*`, `http://localhost:8787/*`

## Minimum Requirements

- Chrome 116+ (side panel API)
- Backend Slop Detector API reachable from the browser
- Hosted privacy policy: https://slopdetector.me/privacy (required for Chrome Web Store listing)

## Troubleshooting

- Ensure the selection contains at least 100 characters.
- If API requests fail, confirm the backend is reachable and (if overridden) `VITE_EXTENSION_API_URL` matches the target environment when building the extension.
