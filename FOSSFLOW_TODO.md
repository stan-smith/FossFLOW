# FossFLOW TODO List

Based on GitHub issues and community feedback. Each item includes relevant codebase locations for implementation.

Last updated: October 2025

---

## ✅ Recently Completed Features

### 1. Undo/Redo System
**Status**: ⚠️ COMPLETED but has known issues (under investigation)
**Implementation**: `packages/fossflow-lib/src/hooks/useHistory.ts`
- Transaction system groups related operations for atomic undo/redo
- Keyboard shortcuts (Ctrl+Z/Ctrl+Y) working
- UI buttons added to interface
- **Current Issues**: System has some edge cases and bugs being investigated by Stan
- See [FOSSFLOW_ENCYCLOPEDIA.md](./FOSSFLOW_ENCYCLOPEDIA.md) for architecture details

### 2. Improved Connection Drawing UX
**Status**: ✅ COMPLETED (Click + Drag modes)
**Implementation**: `packages/fossflow-lib/src/interaction/modes/Connector.ts`
- Click mode (default): Click first node, then second node
- Drag mode (optional): Drag from first to second node
- Mode selection in Settings → Connectors tab (`ConnectorSettings.tsx`)
- Better reliability with click mode

### 3. Multiple Connector Labels
**Status**: ✅ COMPLETED
**Issue**: Fixes #107
- Up to 256 labels per connector
- Per-line label support in double connector mode

### 4. Custom Icon Import
**Status**: ✅ COMPLETED
**Features**:
- Upload PNG/JPG/SVG icons
- Automatic scaling to consistent sizes
- Isometric/Flat toggle for imported icons
- Smart persistence with diagrams

### 5. Server Storage Support
**Status**: ✅ COMPLETED
**Implementation**: `packages/fossflow-backend/server.js`
- Persistent storage via Docker filesystem
- Multi-device access
- Overwrite protection with confirmation dialogs
- Docker integration enabled by default

---

## 🔴 High Priority - Critical Issues

### 1. "Add Node" Popup Offset Bug
**Issue**: [#136](https://github.com/stan-smith/FossFLOW/issues/136)
**Priority**: HIGH (Bug, Priority 2)
**Problem**: After panning/zooming, right-click "Add node" popup appears with huge offset outside viewable area
**Relevant Codebase Areas**:
- `/src/components/ContextMenu/ContextMenu.tsx` - Context menu positioning
- `/src/interaction/useInteractionManager.ts` - Click position calculation
- `/src/stores/uiStateStore.tsx` - Viewport/zoom state management
**Fix Strategy**:
- Adjust popup position calculation to account for pan/zoom transforms
- Test: Pan → Right-click → Verify popup appears at cursor

### 2. Higher Resolution Image Export
**Issue**: [#70](https://github.com/stan-smith/FossFLOW/issues/70)
**Priority**: HIGH (Priority 1, Enhancement)
**Requested Features**:
- [ ] Render images at higher resolution than screen resolution
- [ ] Variable DPI (dots-per-inch) setting for print quality
- [ ] Export settings dialog with resolution multiplier
**Relevant Codebase Areas**:
- `/src/components/ExportImageDialog/ExportImageDialog.tsx` - Export UI
- `/src/components/Renderer/Renderer.tsx` - Canvas rendering
- Look into `dom-to-image-more` library options (line 36 in root package.json)

---

## 🟠 Medium Priority - UX Improvements

### 3. Settings Menu Links & Versioning
**Issue**: [#94](https://github.com/stan-smith/FossFLOW/issues/94)
**Priority**: MEDIUM (Priority 2, Bug)
**Problems**:
- [ ] GitHub link doesn't work
- [ ] Discord link leads to Isoflow discord (should be removed or updated)
- [ ] Version number shows "isoflow" instead of "FossFLOW"
- [ ] No versioning system in place
**Relevant Codebase Areas**:
- `/src/components/MainMenu/MainMenu.tsx` - Settings menu
- `/src/components/HelpDialog/HelpDialog.tsx` - Help dialog with links
- Consider adding version to `packages/fossflow-app/package.json` and displaying it

### 4. Node Label Transparency
**Issue**: [#65](https://github.com/stan-smith/FossFLOW/issues/65)
**Priority**: MEDIUM (Priority 2, Enhancement)
**Requested Features**:
- [ ] Transparent label backgrounds to see nodes behind
- [ ] Optional: Variable opacity slider (default 100%)
- [ ] Hotkey (']') to toggle label visibility or opacity
- [ ] Setting to toggle press-and-hold vs. toggle behavior
**Relevant Codebase Areas**:
- `/src/components/Label/Label.tsx` - Label rendering
- `/src/components/Label/ExpandableLabel.tsx` - Expandable label component
- `/src/stores/uiStateStore.tsx` - Add label visibility state

### 5. Multiple Spaces and Tabs in Descriptions
**Issue**: [#67](https://github.com/stan-smith/FossFLOW/issues/67)
**Priority**: MEDIUM (Priority 2, Enhancement)
**Problem**: HTML-like rendering collapses multiple whitespaces
**Requested Features**:
- [ ] Allow multiple consecutive spaces
- [ ] Allow tabs for indentation
- [ ] Preserve whitespace formatting
**Relevant Codebase Areas**:
- `/src/components/MarkdownEditor/MarkdownEditor.tsx` - Description editor
- Check CSS `white-space` property in label/description rendering

### 6. Keyboard Delete Hotkey
**Issue**: [#60](https://github.com/stan-smith/FossFLOW/issues/60)
**Priority**: MEDIUM (Priority 2, Enhancement)
**Requested Features**:
- [ ] Ctrl+Delete to delete selected node (default)
- [ ] Setting to allow bare 'Delete' key to delete nodes
- [ ] Ensure Delete key still works in text inputs
**Relevant Codebase Areas**:
- `/src/interaction/useInteractionManager.ts` - Keyboard handling
- `/src/components/HotkeySettings/HotkeySettings.tsx` - Hotkey configuration
- `/src/interaction/modes/Cursor.ts` - Selection mode

### 7. i18n Support Enhancement
**Issue**: [#120](https://github.com/stan-smith/FossFLOW/issues/120)
**Priority**: MEDIUM (Priority 2, Enhancement, Good First Issue)
**Current Status**: English and Chinese already supported
**Requested Additions**:
- [ ] German
- [ ] Japanese
- [ ] Spanish
- [ ] French
**Relevant Codebase Areas**:
- `/packages/fossflow-lib/src/i18n/` - Translation files (en-US.ts, zh-CN.ts)
- `/packages/fossflow-app/src/i18n.ts` - i18next configuration
- Follow existing pattern in `en-US.ts` and `zh-CN.ts`

---

## 🟡 Lower Priority - Feature Requests

### 8. Copy & Paste Functionality
**Issue**: [#115](https://github.com/stan-smith/FossFLOW/issues/115)
**Priority**: LOW (Priority 3, Enhancement)
**Requested Features**:
- [ ] Ctrl+C / Ctrl+V to duplicate nodes with properties
- [ ] Context menu "Duplicate node" option
- [ ] Copy entire groups (when multi-select grouping is implemented)
**Relevant Codebase Areas**:
- `/src/interaction/useInteractionManager.ts` - Keyboard shortcuts
- `/src/components/ContextMenu/ContextMenu.tsx` - Context menu actions
- `/src/stores/modelStore.tsx` - Node creation/duplication logic

### 9. Display Page on Path
**Issue**: [#121](https://github.com/stan-smith/FossFLOW/issues/121)
**Priority**: LOW (Priority 3, Enhancement)
**Description**: View-only diagram at URL path like `http://localhost:3000/display/<diagram-name>`
**Benefits**:
- Better than static image (pan, zoom, read descriptions)
- Better than JSON file for non-technical users
**Implementation Ideas**:
- Add route parameter handling
- Load diagram from server storage by name/ID
- Set `editorMode="READONLY"` in Isoflow component
**Relevant Codebase Areas**:
- `/packages/fossflow-app/src/App.tsx` - Add routing (React Router?)
- `/packages/fossflow-lib/src/Isoflow.tsx` - Already has `editorMode` prop
- `/packages/fossflow-backend/server.js` - API endpoint for public view

### 10. Rotate Canvas View
**Issue**: [#69](https://github.com/stan-smith/FossFLOW/issues/69)
**Priority**: LOW (Priority 3, Enhancement)
**Requested Features**:
- [ ] Rotate view by 90 degrees
- [ ] Icons rotate to always face "forward"
- [ ] Hotkey (Ctrl+R)
- [ ] Option in image export to rotate
- [ ] Drag corner to rotate 90° in that direction
**Relevant Codebase Areas**:
- `/src/components/Renderer/Renderer.tsx` - Canvas transform
- `/src/stores/sceneStore.tsx` - Camera/view state
- `/src/utils/` - Isometric projection calculations

### 11. Save/Load Hotkeys
**Issue**: [#58](https://github.com/stan-smith/FossFLOW/issues/58)
**Priority**: LOW (Priority 3, Enhancement)
**Requested Features**:
- [ ] Ctrl+S for Quick Save or prompt Save dialog
- [ ] Ctrl+O to prompt file import
- [ ] Optional: Ctrl+S downloads file (useful for incognito users)
**Relevant Codebase Areas**:
- `/packages/fossflow-app/src/App.tsx` - Save/load logic
- Add keyboard event listeners for Ctrl+S / Ctrl+O

### 12. Dotted Line Click Selection Bug
**Issue**: [#61](https://github.com/stan-smith/FossFLOW/issues/61)
**Priority**: LOW (Priority 3, Bug)
**Problem**: Clicking dotted line between node and label doesn't select node
**Requested Fix**:
- [ ] Clicking anywhere in node's square should select the node
- [ ] Dotted line shouldn't block "Add Node" UI on empty space
**Relevant Codebase Areas**:
- `/src/components/SceneLayers/Nodes/Node/Node.tsx` - Node click area
- `/src/interaction/modes/Cursor.ts` - Click detection logic

---

## 🔵 Technical Debt & Performance

### 13. Optimized Icon Loading Strategy
**Issue**: [#79](https://github.com/stan-smith/FossFLOW/issues/79)
**Priority**: MEDIUM (Priority 2, Enhancement)
**Problem**: All 5 isopacks (isoflow, AWS, GCP, Azure, Kubernetes) loaded upfront
**Impact**: Slower initial load, higher memory usage
**Proposed Solution**:
- [ ] Load only core isoflow icons initially
- [ ] Lazy load additional icon packs on demand
- [ ] UI to enable/disable specific icon sets
- [ ] Cache loaded packs in browser storage
- [ ] Show loading indicators when fetching
**Relevant Codebase Areas**:
- `/packages/fossflow-app/src/App.tsx:18-24` - Icon loading with `flattenCollections()`
- Consider dynamic imports: `import('@isoflow/isopacks/dist/aws')` when needed

### 14. Exported JSON Optimization
**Issue**: [#49](https://github.com/stan-smith/FossFLOW/issues/49)
**Priority**: MEDIUM (Priority 2, Enhancement)
**Problem**: Every exported file includes ALL icons as base64 SVG strings (2MB+)
**Issues**:
- Large file sizes
- Hard to version control
- Difficult to use with AI tools for diagram generation
**Proposed Solution**:
- [ ] Store only node IDs, not full icon data
- [ ] Viewer app resolves IDs to icons (icons already downloaded with app)
- [ ] Backward compatibility for old saves with embedded icons
- [ ] Option to export with/without embedded icons
**Relevant Codebase Areas**:
- `/packages/fossflow-app/src/App.tsx:305-355` - `exportDiagram()` function
- `/packages/fossflow-app/src/diagramUtils.ts` - Diagram data utilities
- Consider icon ID reference system instead of full SVG data

### 15. Unit Test Coverage
**Issue**: [#77](https://github.com/stan-smith/FossFLOW/issues/77)
**Priority**: MEDIUM (Priority 2)
**Status**: Partial (schemas completed ✅)
**Remaining Areas**:
- [ ] `src/components/`
- [ ] `src/hooks/`
- [ ] `src/utils/`
- [ ] `src/stores/`
- [x] `src/schemas/` ✅
- [ ] `src/examples/`
- [ ] `src/fixtures/`
**Test Framework**: Jest
**Pattern**: Tests in `__tests__` directories

### 16. React 19 Support
**Issue**: [#72](https://github.com/stan-smith/FossFLOW/issues/72)
**Priority**: LOW (Priority 3, Enhancement)
**Status**: External contributor (mmastrac) has React 19 port available
**Link**: https://github.com/mmastrac/isoflow/commits/main/
**Diff**: https://github.com/mmastrac/isoflow/commit/05a588d6fa645c88edaedd2aacdc9453240b6ce5
**Notes**:
- Mostly mechanical translation
- Includes fix for editor grabbing capture over whole screen
- Evaluate for potential merge

---

## 🎨 Community Requests

### 17. New Icon Requests
**Issue**: [#150](https://github.com/stan-smith/FossFLOW/issues/150)
**Priority**: Enhancement
**Status**: Open for community requests
**Process**:
- Community requests specific icons (e.g., "Gateway/Router")
- Stan to commission icons in IsoPacks style
- Contribute to appropriate isopack (AWS, GCP, etc.)

---

## Quick Wins (Good First Issues)

1. **Fix Settings Menu Links** (#94)
   - Update GitHub/Discord links
   - Add FossFLOW version display
   - Location: `MainMenu.tsx`, `HelpDialog.tsx`

2. **Add Keyboard Delete Hotkey** (#60)
   - Implement Ctrl+Delete for node deletion
   - Add setting to customize behavior
   - Location: `useInteractionManager.ts`

3. **i18n Translations** (#120)
   - Add German, Japanese, Spanish translations
   - Follow existing pattern in `i18n/en-US.ts`
   - Good first issue label ✅

4. **Save/Load Hotkeys** (#58)
   - Add Ctrl+S and Ctrl+O shortcuts
   - Simple keyboard event handlers
   - Location: `App.tsx`

---

## Architecture Notes

### State Management
Most features will require modifications to:
1. **Model Store** (`/src/stores/modelStore.tsx`) - Business data, undo/redo
2. **Scene Store** (`/src/stores/sceneStore.tsx`) - Visual state, rendering
3. **UI State Store** (`/src/stores/uiStateStore.tsx`) - UI state, mode management
4. **Interaction Manager** (`/src/interaction/useInteractionManager.ts`) - User interactions

### Testing Requirements
Each feature should include:
- Unit tests in `__tests__` directories
- Integration tests for interaction flows
- Update documentation if behavior changes

### Design Patterns to Follow
1. Use existing interaction mode pattern in `/src/interaction/modes/`
2. Follow component structure in `/src/components/`
3. Use Zustand actions pattern for state updates
4. Maintain TypeScript strict typing
5. Use transaction system for undo/redo (`useHistory.ts`)

---

## Contributing

See [CONTRIBUTORS.md](./CONTRIBUTORS.md) for full contribution guidelines.

**Quick Links**:
- [GitHub Issues](https://github.com/stan-smith/FossFLOW/issues)
- [Code Encyclopedia](./FOSSFLOW_ENCYCLOPEDIA.md) - Comprehensive codebase guide
- [Contributors Guide](./CONTRIBUTORS.md)

---

**Maintainer**: Stan Smith (@stan-smith)
**License**: MIT
