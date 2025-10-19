# Frontend UI Capability - Spec Delta

## ADDED Requirements

### Requirement: Terms and Conditions Page

The frontend MUST provide an accessible Terms and Conditions page describing the terms of use, limitations, and disclaimers for Slop Detector.

#### Scenario: Dedicated terms route

**Given** a user navigates to the `/terms` URL
**When** the page loads
**Then** the Terms and Conditions page MUST render
**And** the page MUST display comprehensive terms covering service description, acceptable use, disclaimers, and liability limitations
**And** the content MUST use semantic HTML headings (h1 for page title, h2 for sections, h3 for subsections)

#### Scenario: Terms content structure

**Given** the Terms and Conditions page is rendered
**When** a user views the page
**Then** the following sections MUST be present:
  - Acceptance of Terms
  - Description of Service
  - Acceptable Use Policy
  - Accuracy and Limitations Disclaimer
  - Intellectual Property
  - Privacy and Data Handling reference
  - Limitation of Liability
  - Service Modifications
  - Changes to Terms
**And** each section MUST have clear, readable content relevant to Slop Detector

#### Scenario: Accessibility compliance

**Given** the Terms and Conditions page is rendered
**When** accessed using assistive technologies
**Then** the page MUST use semantic headings for navigation
**And** the page MUST maintain readable contrast ratios (WCAG AA)
**And** keyboard navigation MUST work correctly
**And** focus indicators MUST be visible

#### Scenario: Consistent styling with Privacy Policy

**Given** both Privacy Policy and Terms pages exist
**When** comparing their visual presentation
**Then** the Terms page MUST use the same styling patterns as Privacy Policy
**And** both pages MUST use the glass-panel effect for consistency
**And** typography and spacing MUST match

### Requirement: Footer T&C Link

The frontend footer MUST include a link to the Terms and Conditions page labeled "T&C" to maintain a compact footer design.

#### Scenario: T&C link in footer

**Given** a user views any page of the application
**When** they look at the footer
**Then** a link labeled "T&C" MUST be present
**And** the link MUST be positioned after the "Privacy Policy" link
**And** the link MUST use the same separator pattern (•) as other footer links

#### Scenario: T&C link navigation

**Given** a user clicks the "T&C" link in the footer
**When** the click event is handled
**Then** the page MUST navigate to the Terms and Conditions view
**And** the navigation MUST use client-side routing (no page reload)
**And** the URL MUST update to `/terms`
**And** the browser history MUST update to allow back button navigation

#### Scenario: T&C link styling

**Given** the "T&C" link is rendered in the footer
**When** viewing the link
**Then** it MUST use the same CSS classes as the Privacy Policy link
**And** it MUST have underline on default state
**And** it MUST remove underline on hover
**And** it MUST be keyboard focusable
**And** it MUST have visible focus indicators

### Requirement: Client-Side Routing for Terms Page

The application MUST support client-side routing for the `/terms` route without full page reloads.

#### Scenario: Initial load on terms URL

**Given** a user navigates directly to `/terms` in their browser
**When** the application initializes
**Then** the view state MUST be set to 'terms'
**And** the TermsAndConditions component MUST render
**And** no page reload MUST occur

#### Scenario: View state synchronization

**Given** the user is on the Terms and Conditions page
**When** the view changes to 'terms'
**Then** the URL MUST update to `/terms` using history.replaceState
**And** the URL MUST remain `/terms` until the user navigates away
**And** the main content area MUST display the TermsAndConditions component

#### Scenario: Navigation from home to terms

**Given** a user is on the home page
**When** they click the "T&C" footer link
**Then** the view MUST change to 'terms'
**And** the TermsAndConditions component MUST replace the home content
**And** the header and footer MUST remain visible
**And** the transition MUST be instant (no loading state needed for static content)

#### Scenario: Navigation from terms to home

**Given** a user is on the Terms and Conditions page
**When** they click the "Slop Detector" link in the footer or header
**Then** the view MUST change to 'home'
**And** the home page content MUST render
**And** the URL MUST update to `/`

### Requirement: Terms Component Implementation

A TermsAndConditions React component MUST be created following the same patterns as the PrivacyPolicy component.

#### Scenario: Component export and import

**Given** the TermsAndConditions component is created
**When** imported in App.tsx
**Then** it MUST be a default export from `frontend/src/pages/TermsAndConditions.tsx`
**And** it MUST be a functional component
**And** it MUST require no props

#### Scenario: Component rendering

**Given** the TermsAndConditions component is rendered
**When** displayed in the main content area
**Then** it MUST return JSX with the complete terms content
**And** it MUST use semantic HTML (h1, h2, h3, p, ul, etc.)
**And** it MUST apply Tailwind CSS classes for styling
**And** it MUST be contained within appropriate wrapper divs with max-width constraints

#### Scenario: Last updated date

**Given** the Terms and Conditions content is displayed
**When** a user views the page
**Then** a "Last Updated" date MUST be visible
**And** the date MUST be in a human-readable format (e.g., "October 19, 2025")
**And** the date MUST be accurate and updated when terms change

## MODIFIED Requirements

### Requirement: View State Management in App Component

The App component view state MUST support 'terms' as an additional view option alongside 'home' and 'privacy'.

#### Scenario: View state type includes terms

**Given** the App component defines view state
**When** TypeScript types are checked
**Then** the view state type MUST be `'home' | 'privacy' | 'terms'`
**And** all view state handling code MUST accommodate the 'terms' option

#### Scenario: Conditional rendering with terms view

**Given** the App component renders the main content area
**When** the view state is 'terms'
**Then** the TermsAndConditions component MUST render
**And** the TextInput, Results, and other home page components MUST NOT render
**And** the PrivacyPolicy component MUST NOT render
