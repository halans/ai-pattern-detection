# Change Proposal: Add Privacy Policy Page

## Why
- Users and browser extension reviewers need a clear privacy statement covering the web app, backend API, and Chrome extension.
- Current documentation mentions privacy benefits but lacks a dedicated, linkable policy page.
- Compliance requirements (Chrome Web Store, Cloudflare Pages, general users) expect an accessible policy describing data handling.

## What Changes
- Create a standalone Privacy Policy page detailing real-time analysis, zero data retention, and absence of logging/caching across web, API, and extension.
- Link the new page from the main frontend footer and reference it in the extension documentation.
- Ensure the policy is readable, accessible, and versioned within the repo.

## Impact
- Frontend: new routed page or static document and navigation updates.
- Documentation: update README/extension README to reference the policy.
- No backend code changes; policy simply documents current behaviour.
