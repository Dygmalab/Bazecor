# Custom Key Labels Feature Design

## Overview

Add a system that lets users assign custom labels (notes) to any key in their keyboard layout. Labels appear as tooltips on hover, with a visual badge indicating which keys have labels. Labels are stored locally with JSON export/import for portability.

## Requirements

- Labels can be added to **any key** (standard keys, macros, superkeys, etc.)
- **Right-click context menu** to add/edit/remove labels
- **Visual indicator** (badge) on keys that have labels
- **Tooltip on hover** showing the label text
- **Per-layer by default**, with option to apply label to all layers
- **50 character max** per label
- **Labels Overview Panel** for viewing and editing all labels
- **JSON export/import** for sharing labels between computers
- Storage: local app data (not on keyboard EEPROM)

## Data Model

### Label Structure

```typescript
interface KeyLabel {
  keyPosition: number;    // Physical key index (0-based)
  layer: number;          // Layer index, or -1 for "all layers"
  label: string;          // User's custom note (max 50 chars)
}

interface KeyLabelsStore {
  version: 1;
  deviceId: string;       // e.g., "raise-ansi", "defy-wireless"
  labels: KeyLabel[];
}
```

### Storage

- Location: Electron's `app.getPath('userData')` directory
- Filename: `key-labels-{deviceId}.json`
- One file per device type
- Loaded on device connect, saved on label change (debounced 300ms)

## UI Components

### 1. Visual Indicator (Badge)

- Small circular badge (5-6px) in top-right corner of labeled keys
- Uses theme accent color for visibility in light/dark modes
- Appears when key has label for current layer OR global label (layer -1)

### 2. Tooltip

- Shows on hover after ~300ms delay
- Displays user's custom label text
- Uses existing Radix `Tooltip` component
- Positioned above key, repositions near viewport edges

### 3. Right-Click Context Menu

**Menu options:**
- "Add Label" - when key has no label for current layer
- "Edit Label" - when key has a label
- "Remove Label" - when key has a label

**Label Editor Dialog:**
- Text input (50 char max with counter)
- Checkbox: "Apply to all layers" (default unchecked)
- Save and Cancel buttons
- Auto-focuses input on open

### 4. Labels Overview Panel

**Access:** "Key Labels" button in Layout Editor toolbar

**Layout:**
- Header with title, Export/Import buttons, close button
- Filter dropdown: "All Layers" / specific layers
- Table with columns: Key, Layer, Label, Actions
- Inline editing: click label text to edit
- Delete button per row

**Empty state:** "No labels yet. Right-click any key in the layout to add a label."

### 5. Export/Import

**Export:**
- Button in Labels Panel header
- Native save dialog
- Default filename: `key-labels-{deviceName}-{date}.json`

**Import:**
- Button in Labels Panel header
- Native file picker (.json filter)
- Validation before import
- Options: "Merge" (add new, imported wins conflicts) or "Replace All"
- Success/error toast notifications

**Validation:**
- Correct `version` field
- Valid `labels` array structure
- Device ID mismatch shows warning but allows import
- Labels truncated to 50 chars if needed

## State Management

### KeyLabelsContext

```typescript
interface KeyLabelsContextValue {
  labels: KeyLabel[];
  getLabel: (keyPosition: number, layer: number) => string | undefined;
  setLabel: (keyPosition: number, layer: number, text: string, applyToAll: boolean) => void;
  removeLabel: (keyPosition: number, layer: number) => void;
  importLabels: (data: KeyLabelsStore, mode: 'merge' | 'replace') => void;
  exportLabels: () => KeyLabelsStore;
}
```

### Layer Lookup Logic

1. Check for layer-specific label (exact layer match)
2. Fall back to global label (layer === -1)
3. Return `undefined` if neither exists

## File Changes

### New Files

| File | Purpose |
|------|---------|
| `src/renderer/contexts/KeyLabelsContext.tsx` | State management & persistence |
| `src/renderer/components/molecules/KeyLabelDialog.tsx` | Add/edit label dialog |
| `src/renderer/components/organisms/KeyLabelsPanel.tsx` | Overview panel |
| `src/main/setup/keyLabelsIpc.ts` | IPC handlers for file operations |

### Modified Files

| File | Changes |
|------|---------|
| `src/api/hardware/Key.tsx` | Add badge, tooltip, context menu |
| `src/renderer/views/LayoutEditor/LayoutEditor.tsx` | Wrap with context, add panel button |
| `src/main/setup/ipc.ts` | Register key labels IPC handlers |

## Dependencies

Uses existing packages (no new dependencies):
- Radix UI: `Tooltip`, `ContextMenu`, `Dialog`
- Electron: `dialog.showSaveDialog`, `dialog.showOpenDialog`

## Implementation Notes

- Badge indicator rendered as SVG circle within `Key.tsx`
- Context menu uses Radix `ContextMenu.Root` wrapping key element
- IPC channels: `key-labels:read`, `key-labels:write`, `key-labels:export`, `key-labels:import`
- Debounce saves to prevent excessive disk writes during rapid edits
