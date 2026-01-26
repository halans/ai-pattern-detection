# Add Toolbar Icon Side Panel Behavior

**Change ID:** add-toolbar-icon-sidepanel-behavior
**Status:** Draft
**Author:** AI Assistant
**Date:** 2025-10-19

## Summary

Update the browser extension to automatically open the side panel when the user clicks the toolbar icon, using the Chrome `sidePanel.setPanelBehavior()` API. This simplifies the user experience by removing the need for manual side panel interaction and provides a more native extension feel.

## Problem Statement

Currently, the browser extension uses a custom `action.onClicked` listener to manually open the side panel:

```typescript
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id !== undefined) {
    await ensureSidePanel(tab.id);
  }
});
```

**Issues with current approach:**
- **Manual side panel management:** The extension must explicitly call `sidePanel.open()` on each toolbar click
- **Additional code complexity:** Requires maintaining custom logic for opening the side panel
- **Non-standard behavior:** Chrome provides a built-in mechanism (`setPanelBehavior()`) that's more efficient and declarative
- **Potential race conditions:** Manual opening can sometimes fail or delay in certain browser states

**Better approach:**
Chrome's `sidePanel.setPanelBehavior({ openPanelOnActionClick: true })` tells the browser to automatically open the side panel when the toolbar icon is clicked, without requiring manual event handling.

## Goals

- Use `sidePanel.setPanelBehavior()` to enable automatic side panel opening on toolbar click
- Remove custom `action.onClicked` listener for side panel opening
- Simplify the background service worker code
- Maintain all existing functionality (text capture, analysis, etc.)
- Improve reliability by using Chrome's native behavior

## Non-Goals

- Changing side panel UI or content
- Modifying text capture logic
- Altering API communication
- Adding new extension features
- Supporting manual side panel opening methods (user can still open via right-click → Side Panel)

## User Stories

1. **As a user**, I want to click the Slop Detector toolbar icon and have the side panel open immediately without any delay.

2. **As a developer**, I want to use Chrome's native side panel behavior API instead of manually managing panel state, reducing code complexity.

3. **As a user**, I want a consistent experience where clicking the toolbar icon always opens the side panel, matching standard Chrome extension behavior.

## Current Behavior

```typescript
// In background.ts
chrome.action.onClicked.addListener(async (tab) => {
  if (tab.id !== undefined) {
    await ensureSidePanel(tab.id); // Manual side panel opening
  }
});

const ensureSidePanel = async (tabId: number) => {
  try {
    await chrome.sidePanel.setOptions({ tabId, path: 'sidepanel.html' });
    await chrome.sidePanel.open({ tabId }); // Explicit open call
  } catch (error) {
    console.error('Failed to open side panel', error);
  }
};
```

## Proposed Behavior

```typescript
// In background.ts - onInstalled listener
chrome.runtime.onInstalled.addListener(async () => {
  try {
    await chrome.sidePanel.setOptions({ path: 'sidepanel.html', enabled: true });
    // NEW: Set panel behavior to open on toolbar click
    await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });
  } catch (error) {
    console.error('Failed to configure side panel on install', error);
  }
});

// No need for action.onClicked listener anymore
// Chrome handles opening the panel automatically
```

## Technical Approach

1. **Add `setPanelBehavior()` call** in the `chrome.runtime.onInstalled` listener:
   - Set `openPanelOnActionClick: true` to enable automatic opening
   - This configures the extension-level behavior once at install/update

2. **Remove the `action.onClicked` listener**:
   - Delete the listener that manually calls `ensureSidePanel()`
   - Chrome will now handle toolbar clicks natively

3. **Keep or remove `ensureSidePanel()`**:
   - If this function is only used by `action.onClicked`, remove it entirely
   - If it's used elsewhere, keep it but document it's not for toolbar clicks

4. **Maintain `sidePanel.setOptions()` in onInstalled**:
   - Still needed to set the default panel path and enabled state
   - `setPanelBehavior()` is an additional configuration

## API Reference

From Chrome Extension API documentation:

```typescript
chrome.sidePanel.setPanelBehavior(
  behavior: PanelBehavior,
  callback?: () => void
): Promise<void>

interface PanelBehavior {
  openPanelOnActionClick?: boolean;
}
```

**`openPanelOnActionClick`:** When `true`, clicking the extension's toolbar icon opens the side panel. Default is `false`.

**Chrome version:** Available in Chrome 116+ (Manifest V3)

## Success Metrics

- Toolbar icon click opens side panel in ≤100ms (faster than manual method)
- Zero errors in side panel opening after deployment
- Code reduction: ~15-20 lines of code removed from background.ts
- User experience unchanged (same end result, faster execution)

## Risks and Mitigations

| Risk | Mitigation |
|------|------------|
| Browser compatibility | `setPanelBehavior()` requires Chrome 116+; check manifest target version |
| Breaking existing behavior | Test thoroughly on multiple Chrome versions before deployment |
| Loss of custom logic | The `ensureSidePanel()` function handled per-tab config; verify not needed |
| Migration issues | Test with existing installations, not just fresh installs |

## Dependencies

**Chrome version requirement:** Chrome 116 or later

**Check manifest.json:**
- If `minimum_chrome_version` is set, ensure it's ≥116
- If not set, consider adding it for clarity

## Backward Compatibility

**Breaking change:** NO (functionally identical to users)

**Technical change:** YES (implementation changes but behavior is the same)

**Impact:**
- Existing users won't notice any difference in functionality
- Extension may open side panel slightly faster
- Removes potential edge cases with manual opening

## Testing Plan

1. **Fresh installation:**
   - Install extension
   - Click toolbar icon
   - Verify side panel opens

2. **Update scenario:**
   - Install old version with manual opening
   - Update to new version with `setPanelBehavior()`
   - Click toolbar icon
   - Verify side panel opens

3. **Multiple tabs:**
   - Open multiple tabs
   - Click toolbar icon in different tabs
   - Verify side panel opens correctly in each context

4. **Error handling:**
   - Check console for errors after `setPanelBehavior()` call
   - Verify graceful fallback if API call fails

## Future Considerations

- Monitor Chrome API changes for additional side panel configuration options
- Consider adding `openPanelOnActionClick: false` in specific scenarios if needed
- Explore other panel behavior options as they become available
