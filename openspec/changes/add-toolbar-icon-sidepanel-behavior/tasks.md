# Implementation Tasks: Add Toolbar Icon Side Panel Behavior

## Background Service Worker Updates

- [ ] Update `chrome.runtime.onInstalled` listener in `browser-extension/src/background.ts`
  - Add `await chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true });` call
  - Place it after the `chrome.sidePanel.setOptions()` call
  - Keep both calls in the same try-catch block for error handling
  - Ensure proper async/await usage

- [ ] Remove `chrome.action.onClicked` listener in `browser-extension/src/background.ts`
  - Delete the entire `chrome.action.onClicked.addListener()` block (lines 18-22)
  - Remove the manual side panel opening logic
  - Chrome will now handle this natively

- [ ] Remove or update `ensureSidePanel()` function in `browser-extension/src/background.ts`
  - If the function is ONLY used by the removed `action.onClicked` listener, delete it entirely
  - If it's used elsewhere in the code, keep it but add a comment explaining it's not for toolbar clicks
  - Search codebase to verify no other references to `ensureSidePanel()`

- [ ] Update error handling in `onInstalled` listener
  - Ensure try-catch catches both `setOptions()` and `setPanelBehavior()` errors
  - Log descriptive error messages for each potential failure
  - Consider separate error messages for debugging (optional)

## Manifest Updates (Optional)

- [ ] Review `browser-extension/public/manifest.json` for Chrome version requirement
  - Check if `minimum_chrome_version` field exists
  - If it exists and is < 116, update to "116" or document the requirement
  - If it doesn't exist, consider adding `"minimum_chrome_version": "116"` for clarity
  - This is optional but recommended for documentation

## Code Quality and Cleanup

- [ ] Remove unused imports in `background.ts`
  - If `ensureSidePanel` is deleted, ensure no orphaned helper code remains
  - Clean up any unused variables or functions
  - Verify TypeScript compiler has no warnings

- [ ] Add code comments explaining the new behavior
  - Comment on `setPanelBehavior()` call: "Enable automatic side panel opening on toolbar click"
  - Document that Chrome 116+ is required for this API
  - Note that manual opening is no longer needed

- [ ] Verify TypeScript types for Chrome APIs
  - Ensure `@types/chrome` includes `sidePanel.setPanelBehavior()` typing
  - If types are missing, add inline type assertion or update types package
  - Check package.json for `@types/chrome` version

## Testing

- [ ] Test fresh extension installation
  - Load unpacked extension in Chrome
  - Click toolbar icon
  - Verify side panel opens immediately
  - Check browser console for errors

- [ ] Test extension update scenario
  - Install old version of extension (with manual opening)
  - Update to new version (with `setPanelBehavior`)
  - Click toolbar icon
  - Verify side panel opens automatically
  - Ensure no errors during migration

- [ ] Test across multiple tabs
  - Open 3-5 different tabs
  - Click toolbar icon in each tab
  - Verify side panel opens correctly in all contexts
  - Check that panel behavior is consistent

- [ ] Test browser restart
  - Configure extension with new behavior
  - Restart Chrome
  - Click toolbar icon
  - Verify side panel still opens automatically
  - Confirm behavior persists across sessions

- [ ] Test error scenarios
  - Check browser console after installation
  - Verify no errors from `setPanelBehavior()` call
  - If testing on Chrome < 116, verify graceful error handling
  - Ensure extension doesn't crash if API fails

- [ ] Test side panel functionality after change
  - Verify text capture still works (selection and full page)
  - Test API communication with backend
  - Ensure results display correctly
  - Confirm all existing features still function

## Documentation

- [ ] Update `browser-extension/README.md` with behavior change
  - Document that toolbar click opens side panel automatically
  - Mention Chrome 116+ requirement
  - Remove any outdated information about manual opening
  - Update usage instructions if needed

- [ ] Add changelog entry or commit message
  - Describe the change: "Use sidePanel.setPanelBehavior() for automatic panel opening"
  - Note benefits: "Simplifies code and improves reliability"
  - Mention Chrome version requirement: "Requires Chrome 116+"

## Build and Deployment

- [ ] Build extension with changes
  - Run `npm run build` in browser-extension directory
  - Verify build succeeds without errors
  - Check dist/ output for background.js

- [ ] Verify bundle size
  - Compare bundle size before/after changes
  - Should be slightly smaller due to code removal
  - Document any significant changes

- [ ] Test production build
  - Load built extension (from dist/) in Chrome
  - Test all scenarios with production bundle
  - Verify no runtime errors in optimized build

## Validation

- [ ] Run linter and formatter
  - Execute `npm run lint` (if configured)
  - Run Prettier or configured formatter
  - Fix any style violations

- [ ] Type check with TypeScript
  - Run `tsc --noEmit` or `npm run type-check`
  - Ensure no type errors
  - Verify Chrome API types are correct

- [ ] Code review checklist
  - Verify `setPanelBehavior()` is called in `onInstalled`
  - Confirm `action.onClicked` listener is removed
  - Check error handling is adequate
  - Ensure no dead code remains
  - Validate that all tests pass
