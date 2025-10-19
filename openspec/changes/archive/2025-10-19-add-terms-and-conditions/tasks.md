# Implementation Tasks: Add Terms and Conditions Page

## Component Creation

- [x] Create TermsAndConditions component file at `frontend/src/pages/TermsAndConditions.tsx`
  - Create new file in the pages directory
  - Export default functional component (no props)
  - Follow same structure as PrivacyPolicy.tsx

- [x] Implement Terms and Conditions content structure
  - Add main wrapper div with max-width and padding (match PrivacyPolicy styling)
  - Use h1 for "Terms and Conditions" page title
  - Create sections with h2 headings for major topics
  - Use h3 for subsections as needed
  - Apply glass-panel styling for consistency

- [x] Write Terms and Conditions content
  - **Section 1: Acceptance of Terms** - explain that using the service means accepting the terms
  - **Section 2: Description of Service** - describe Slop Detector as a pattern-based AI detection tool
  - **Section 3: Acceptable Use Policy** - define legitimate uses and prohibited activities
  - **Section 4: Accuracy and Limitations Disclaimer** - state that results are probabilistic, not definitive
  - **Section 5: Intellectual Property** - clarify ownership of patterns and algorithms
  - **Section 6: Privacy and Data Handling** - reference Privacy Policy, mention zero retention
  - **Section 7: Limitation of Liability** - disclaim warranties and limit liability
  - **Section 8: Service Modifications** - reserve right to modify or discontinue
  - **Section 9: Changes to Terms** - explain how terms may be updated
  - **Section 10: Contact Information** - provide contact details or GitHub link

- [x] Add "Last Updated" date to Terms and Conditions
  - Display current date (October 19, 2025 or actual implementation date)
  - Position at top or bottom of content
  - Use readable format (e.g., "Last Updated: October 19, 2025")

- [x] Apply Tailwind CSS styling matching PrivacyPolicy
  - Use same spacing classes (space-y-4, space-y-6, etc.)
  - Apply text size and weight classes (text-sm, font-semibold, etc.)
  - Use theme-aware colors (text-text-muted, dark:text-text-dark-muted)
  - Add glass-panel class for container
  - Ensure responsive design with proper breakpoints

## App Component Updates

- [x] Update view state type in `frontend/src/App.tsx`
  - Change view state type from `'home' | 'privacy'` to `'home' | 'privacy' | 'terms'`
  - Ensure TypeScript accepts 'terms' as valid value

- [x] Update view state initialization in `frontend/src/App.tsx`
  - Modify useState initialization to check for `/terms` pathname
  - Add condition: if pathname starts with '/terms', initialize view as 'terms'
  - Keep existing logic for '/privacy' and default to 'home'

- [x] Add TermsAndConditions import in `frontend/src/App.tsx`
  - Import statement: `import TermsAndConditions from './pages/TermsAndConditions';`
  - Place near other page imports (e.g., after PrivacyPolicy import)

- [x] Update conditional rendering in main content area
  - Add condition to render `<TermsAndConditions />` when view is 'terms'
  - Place alongside existing 'privacy' condition
  - Ensure only one view renders at a time (home, privacy, or terms)

- [x] Update useEffect for URL synchronization
  - Add case for 'terms' view: target path should be '/terms'
  - Update history.replaceState call to include '/terms' case
  - Verify URL updates correctly when view changes

## Footer Updates

- [x] Add T&C link to footer in `frontend/src/App.tsx`
  - Locate footer section (around line 161-182)
  - Add link after "Privacy Policy" link
  - Use separator: `&nbsp;•&nbsp;`
  - Link text: "T&C"
  - href: "/terms"

- [x] Implement click handler for T&C link
  - Add onClick event handler: `(event) => { event.preventDefault(); setView('terms'); }`
  - Prevent default link behavior to avoid page reload
  - Set view state to 'terms'

- [x] Apply consistent styling to T&C link
  - Use same CSS classes as Privacy Policy link
  - Classes: `mx-auto md:mx-0 text-sm underline hover:no-underline`
  - Ensure keyboard focusability
  - Verify focus indicators are visible

## Testing

- [x] Test direct navigation to /terms URL
  - Open browser to http://localhost:5173/terms (or deployment URL)
  - Verify Terms and Conditions page loads
  - Check that view state is 'terms'
  - Confirm no errors in browser console

- [x] Test footer link navigation
  - Start on home page
  - Click "T&C" link in footer
  - Verify page navigates to Terms and Conditions
  - Check URL updates to /terms
  - Confirm no page reload occurs (client-side routing)

- [x] Test navigation between all views
  - Navigate: home → terms → privacy → home
  - Verify each transition works correctly
  - Check browser back button functionality
  - Ensure URL updates appropriately for each view

- [x] Test keyboard navigation
  - Tab to "T&C" link using keyboard
  - Verify focus indicator is visible
  - Press Enter to navigate
  - Confirm navigation works via keyboard

- [x] Test responsive design
  - View Terms page on desktop, tablet, and mobile sizes
  - Verify content is readable and properly sized
  - Check footer link wrapping behavior on small screens
  - Ensure consistent styling across breakpoints

- [x] Test accessibility
  - Run axe DevTools or Lighthouse accessibility audit
  - Verify heading hierarchy is correct (h1 → h2 → h3)
  - Test with screen reader (NVDA, JAWS, or VoiceOver)
  - Confirm WCAG AA contrast ratios
  - Verify all interactive elements are keyboard accessible

## Code Quality

- [x] Run TypeScript type checking
  - Execute `npm run type-check` in frontend directory
  - Fix any type errors related to view state changes
  - Ensure TermsAndConditions component has correct types

- [x] Run linter
  - Execute `npm run lint` (if configured)
  - Fix any ESLint warnings or errors
  - Ensure code follows project conventions

- [x] Format code
  - Run Prettier or configured formatter
  - Ensure consistent indentation (2 spaces)
  - Verify import order is correct

- [x] Review code for consistency
  - Compare TermsAndConditions.tsx with PrivacyPolicy.tsx
  - Ensure similar structure and styling patterns
  - Verify naming conventions match project standards

## Build and Deployment

- [x] Build frontend for production
  - Run `npm run build` in frontend directory
  - Verify build completes without errors
  - Check bundle size is reasonable

- [x] Test production build locally
  - Run `npm run preview` or serve dist/ folder
  - Test all navigation and functionality with production build
  - Verify no runtime errors in optimized code

- [x] Verify routing works with production build
  - Test direct URL access: /terms
  - Ensure client-side routing functions correctly
  - Check that refreshing on /terms doesn't cause 404

## Documentation

- [x] Update README or documentation if needed
  - Document new /terms route (if routes are documented)
  - Mention T&C page in feature list (if applicable)

- [x] Add changelog entry
  - Document: "Added Terms and Conditions page"
  - Note: "Added T&C link to footer"
  - Specify date or version of change

## Validation

- [x] Run unit tests (if component tests exist)
  - Test TermsAndConditions component renders
  - Test view state changes correctly
  - Test link click handlers

- [x] Run E2E tests (if configured)
  - Test navigation flow including /terms route
  - Verify footer links work in automated tests

- [x] Manual smoke test checklist
  - [x] /terms URL loads correctly
  - [x] T&C footer link works
  - [x] Content is readable and well-formatted
  - [x] All sections are present
  - [x] Last Updated date is visible
  - [x] Page is accessible via keyboard
  - [x] Styling matches Privacy Policy
  - [x] No console errors
  - [x] Browser back/forward buttons work
