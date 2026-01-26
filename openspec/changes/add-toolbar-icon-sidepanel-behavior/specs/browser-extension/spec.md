# Browser Extension Side Panel Behavior

## MODIFIED Requirements

### Requirement: Side Panel Opening Behavior

The extension MUST use Chrome's native side panel behavior API to automatically open the side panel when the toolbar icon is clicked.

#### Scenario: Configure panel behavior on installation

**Given** the extension is installed or updated
**When** the `chrome.runtime.onInstalled` event fires
**Then** the background service worker MUST call `chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })`
**And** the call MUST complete successfully without errors
**And** the panel behavior MUST be configured for the entire extension (not per-tab)

#### Scenario: Toolbar icon click opens side panel automatically

**Given** the extension is installed and panel behavior is configured
**When** the user clicks the extension's toolbar icon
**Then** the side panel MUST open automatically
**And** no manual `chrome.sidePanel.open()` call MUST be made
**And** the panel MUST open in less than 200ms from click

#### Scenario: Panel behavior persists across browser sessions

**Given** the panel behavior has been set to `openPanelOnActionClick: true`
**When** the user restarts the browser
**And** clicks the toolbar icon
**Then** the side panel MUST still open automatically
**And** no reconfiguration MUST be required

#### Scenario: Error handling for setPanelBehavior

**Given** the extension is being installed
**When** `chrome.sidePanel.setPanelBehavior()` is called
**And** the API call fails (e.g., unsupported Chrome version)
**Then** the error MUST be caught and logged to console
**And** the extension MUST attempt to continue initialization
**And** the error MUST NOT crash the service worker

### Requirement: Removal of Manual Side Panel Opening

The extension MUST NOT use manual event handlers to open the side panel on toolbar clicks.

#### Scenario: No action.onClicked listener for side panel

**Given** the background service worker is loaded
**When** searching for `chrome.action.onClicked` listeners
**Then** there MUST NOT be a listener that calls `chrome.sidePanel.open()`
**And** toolbar click handling MUST be delegated to Chrome's native behavior

#### Scenario: ensureSidePanel function removal

**Given** the `ensureSidePanel()` function was previously used to manually open the side panel
**When** reviewing the background.ts code
**Then** the function MUST be removed if it's only used for toolbar click handling
**Or** it MUST be documented as legacy/unused if kept for other purposes

### Requirement: Side Panel Configuration on Install

The extension MUST configure the side panel's default path and behavior during installation.

#### Scenario: Set default panel path on install

**Given** the extension is installed or updated
**When** the `chrome.runtime.onInstalled` event fires
**Then** the background worker MUST call `chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true })`
**And** the panel path MUST be set before calling `setPanelBehavior()`
**And** both API calls MUST be made in the same try-catch block

#### Scenario: Panel enabled by default

**Given** the side panel options are being configured
**When** `chrome.sidePanel.setOptions()` is called
**Then** the `enabled` property MUST be set to `true`
**And** the side panel MUST be immediately available for use

### Requirement: Chrome API Version Compatibility

The extension MUST ensure compatibility with the required Chrome API version for `setPanelBehavior()`.

#### Scenario: Minimum Chrome version requirement

**Given** the extension uses `chrome.sidePanel.setPanelBehavior()`
**When** the manifest.json is validated
**Then** the extension MUST work on Chrome 116 or later
**And** the manifest SHOULD document this requirement if `minimum_chrome_version` is specified

#### Scenario: API availability check

**Given** the background worker is initializing
**When** `chrome.sidePanel.setPanelBehavior` is accessed
**Then** the code SHOULD check if the API exists before calling it (optional defensive check)
**Or** rely on try-catch to handle API unavailability

## REMOVED Requirements

### Requirement: Manual Side Panel Opening on Toolbar Click

~~The previous requirement for using `chrome.action.onClicked` listener to manually open the side panel is removed.~~

This requirement is replaced by the native panel behavior configuration using `setPanelBehavior()`.
