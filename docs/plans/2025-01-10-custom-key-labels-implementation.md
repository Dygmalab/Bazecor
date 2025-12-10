# Custom Key Labels Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a system for users to assign custom labels/notes to any keyboard key, displayed as tooltips on hover with visual badge indicators.

**Architecture:** React Context for state management, IPC for file persistence in Electron's userData directory, Radix UI components for context menu/dialog/tooltip. Labels stored per-device in JSON files.

**Tech Stack:** React 18, TypeScript, Radix UI (Tooltip, Dialog, DropdownMenu), Electron IPC, Vitest for testing.

---

## Task 1: Install Context Menu Dependency

**Files:**
- Modify: `package.json`

**Step 1: Add @radix-ui/react-context-menu dependency**

```bash
yarn add @radix-ui/react-context-menu
```

**Step 2: Verify installation**

Run: `yarn list @radix-ui/react-context-menu`
Expected: Shows installed version

**Step 3: Commit**

```bash
git add package.json yarn.lock
git commit -m "chore: add @radix-ui/react-context-menu dependency"
```

---

## Task 2: Create Type Definitions

**Files:**
- Create: `src/renderer/types/keyLabels.ts`

**Step 1: Create the types file**

```typescript
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export interface KeyLabel {
  keyPosition: number;
  layer: number; // -1 means "all layers"
  label: string;
}

export interface KeyLabelsStore {
  version: 1;
  deviceId: string;
  labels: KeyLabel[];
}

export const MAX_LABEL_LENGTH = 50;

export const GLOBAL_LAYER = -1;
```

**Step 2: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors related to keyLabels.ts

**Step 3: Commit**

```bash
git add src/renderer/types/keyLabels.ts
git commit -m "feat(key-labels): add type definitions"
```

---

## Task 3: Create IPC Handlers for File Operations

**Files:**
- Create: `src/main/setup/configureKeyLabelsIpc.ts`
- Modify: `src/main/setup/configureIPCs.ts`

**Step 1: Create the IPC handler file**

```typescript
import { ipcMain, app } from "electron";
import fs from "fs";
import path from "path";
import log from "electron-log/main";

const getLabelsFilePath = (deviceId: string): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, `key-labels-${deviceId}.json`);
};

const removeKeyLabelsIPCs = () => {
  ipcMain.removeHandler("key-labels:read");
  ipcMain.removeHandler("key-labels:write");
};

const configureKeyLabelsIPCs = () => {
  ipcMain.handle("key-labels:read", async (_event, deviceId: string) => {
    const filePath = getLabelsFilePath(deviceId);
    log.verbose(`Reading key labels from: ${filePath}`);

    try {
      if (!fs.existsSync(filePath)) {
        return { version: 1, deviceId, labels: [] };
      }
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      log.error("Failed to read key labels:", error);
      return { version: 1, deviceId, labels: [] };
    }
  });

  ipcMain.handle("key-labels:write", async (_event, deviceId: string, data: unknown) => {
    const filePath = getLabelsFilePath(deviceId);
    log.verbose(`Writing key labels to: ${filePath}`);

    try {
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, content, "utf-8");
      return { success: true };
    } catch (error) {
      log.error("Failed to write key labels:", error);
      return { success: false, error: String(error) };
    }
  });
};

export { configureKeyLabelsIPCs, removeKeyLabelsIPCs };
```

**Step 2: Import and call in configureIPCs.ts**

Add to imports at top of `src/main/setup/configureIPCs.ts`:
```typescript
import { configureKeyLabelsIPCs, removeKeyLabelsIPCs } from "./configureKeyLabelsIpc";
```

Add to `removeIPCs` function body:
```typescript
  removeKeyLabelsIPCs();
```

Add to `configureIPCs` function body (at end before closing brace):
```typescript
  configureKeyLabelsIPCs();
```

**Step 3: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors

**Step 4: Commit**

```bash
git add src/main/setup/configureKeyLabelsIpc.ts src/main/setup/configureIPCs.ts
git commit -m "feat(key-labels): add IPC handlers for file persistence"
```

---

## Task 4: Create KeyLabelsContext

**Files:**
- Create: `src/renderer/contexts/KeyLabelsContext.tsx`

**Step 1: Create the context file**

```typescript
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo, useRef } from "react";
import { ipcRenderer } from "electron";
import { KeyLabel, KeyLabelsStore, GLOBAL_LAYER, MAX_LABEL_LENGTH } from "@Types/keyLabels";

interface KeyLabelsContextValue {
  labels: KeyLabel[];
  getLabel: (keyPosition: number, layer: number) => string | undefined;
  setLabel: (keyPosition: number, layer: number, text: string, applyToAll: boolean) => void;
  removeLabel: (keyPosition: number, layer: number) => void;
  importLabels: (data: KeyLabelsStore, mode: "merge" | "replace") => void;
  exportLabels: () => KeyLabelsStore;
  isLoading: boolean;
}

interface KeyLabelsProviderProps {
  children: React.ReactNode;
  deviceId: string;
}

const KeyLabelsContext = createContext<KeyLabelsContextValue | undefined>(undefined);

function KeyLabelsProvider({ children, deviceId }: KeyLabelsProviderProps) {
  const [labels, setLabels] = useState<KeyLabel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load labels on mount or device change
  useEffect(() => {
    const loadLabels = async () => {
      setIsLoading(true);
      try {
        const data = await ipcRenderer.invoke("key-labels:read", deviceId);
        setLabels(data.labels || []);
      } catch (error) {
        console.error("Failed to load key labels:", error);
        setLabels([]);
      }
      setIsLoading(false);
    };
    loadLabels();
  }, [deviceId]);

  // Debounced save function
  const saveLabels = useCallback(
    (newLabels: KeyLabel[]) => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      saveTimeoutRef.current = setTimeout(() => {
        const data: KeyLabelsStore = {
          version: 1,
          deviceId,
          labels: newLabels,
        };
        ipcRenderer.invoke("key-labels:write", deviceId, data);
      }, 300);
    },
    [deviceId],
  );

  const getLabel = useCallback(
    (keyPosition: number, layer: number): string | undefined => {
      // First try layer-specific label
      const layerLabel = labels.find(l => l.keyPosition === keyPosition && l.layer === layer);
      if (layerLabel) return layerLabel.label;

      // Fall back to global label
      const globalLabel = labels.find(l => l.keyPosition === keyPosition && l.layer === GLOBAL_LAYER);
      return globalLabel?.label;
    },
    [labels],
  );

  const setLabel = useCallback(
    (keyPosition: number, layer: number, text: string, applyToAll: boolean) => {
      const trimmedText = text.slice(0, MAX_LABEL_LENGTH);
      const targetLayer = applyToAll ? GLOBAL_LAYER : layer;

      setLabels(prevLabels => {
        let newLabels = [...prevLabels];

        if (applyToAll) {
          // Remove all labels for this key position
          newLabels = newLabels.filter(l => l.keyPosition !== keyPosition);
        } else {
          // Remove only the specific layer label
          newLabels = newLabels.filter(l => !(l.keyPosition === keyPosition && l.layer === targetLayer));
        }

        // Add new label
        newLabels.push({
          keyPosition,
          layer: targetLayer,
          label: trimmedText,
        });

        saveLabels(newLabels);
        return newLabels;
      });
    },
    [saveLabels],
  );

  const removeLabel = useCallback(
    (keyPosition: number, layer: number) => {
      setLabels(prevLabels => {
        const newLabels = prevLabels.filter(l => !(l.keyPosition === keyPosition && l.layer === layer));
        saveLabels(newLabels);
        return newLabels;
      });
    },
    [saveLabels],
  );

  const importLabels = useCallback(
    (data: KeyLabelsStore, mode: "merge" | "replace") => {
      if (mode === "replace") {
        setLabels(data.labels);
        saveLabels(data.labels);
      } else {
        // Merge: imported labels override existing for same key/layer
        setLabels(prevLabels => {
          const labelMap = new Map<string, KeyLabel>();

          // Add existing labels
          prevLabels.forEach(l => {
            labelMap.set(`${l.keyPosition}-${l.layer}`, l);
          });

          // Override with imported labels
          data.labels.forEach(l => {
            labelMap.set(`${l.keyPosition}-${l.layer}`, l);
          });

          const newLabels = Array.from(labelMap.values());
          saveLabels(newLabels);
          return newLabels;
        });
      }
    },
    [saveLabels],
  );

  const exportLabels = useCallback((): KeyLabelsStore => {
    return {
      version: 1,
      deviceId,
      labels,
    };
  }, [deviceId, labels]);

  const value = useMemo(
    () => ({
      labels,
      getLabel,
      setLabel,
      removeLabel,
      importLabels,
      exportLabels,
      isLoading,
    }),
    [labels, getLabel, setLabel, removeLabel, importLabels, exportLabels, isLoading],
  );

  return <KeyLabelsContext.Provider value={value}>{children}</KeyLabelsContext.Provider>;
}

function useKeyLabels() {
  const context = useContext(KeyLabelsContext);
  if (context === undefined) {
    throw new Error("useKeyLabels must be used within a KeyLabelsProvider");
  }
  return context;
}

export { KeyLabelsProvider, useKeyLabels };
```

**Step 2: Create contexts directory if needed**

Run: `mkdir -p src/renderer/contexts`

**Step 3: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors

**Step 4: Commit**

```bash
git add src/renderer/contexts/KeyLabelsContext.tsx
git commit -m "feat(key-labels): add KeyLabelsContext for state management"
```

---

## Task 5: Create KeyLabelDialog Component

**Files:**
- Create: `src/renderer/components/molecules/KeyLabelDialog.tsx`

**Step 1: Create the dialog component**

```typescript
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { MAX_LABEL_LENGTH } from "@Types/keyLabels";

interface KeyLabelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialLabel: string;
  onSave: (label: string, applyToAll: boolean) => void;
  keyPosition: number;
  layer: number;
}

function KeyLabelDialog({ open, onOpenChange, initialLabel, onSave, keyPosition, layer }: KeyLabelDialogProps) {
  const [label, setLabel] = useState(initialLabel);
  const [applyToAll, setApplyToAll] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setLabel(initialLabel);
      setApplyToAll(false);
      // Focus input after dialog opens
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open, initialLabel]);

  const handleSave = () => {
    if (label.trim()) {
      onSave(label.trim(), applyToAll);
      onOpenChange(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const remainingChars = MAX_LABEL_LENGTH - label.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{initialLabel ? "Edit Key Label" : "Add Key Label"}</DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <label htmlFor="key-label-input" className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Label for Key {keyPosition} (Layer {layer + 1})
            </label>
            <input
              ref={inputRef}
              id="key-label-input"
              type="text"
              value={label}
              onChange={e => setLabel(e.target.value.slice(0, MAX_LABEL_LENGTH))}
              onKeyDown={handleKeyDown}
              placeholder="Enter a custom label..."
              className="w-full px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              maxLength={MAX_LABEL_LENGTH}
            />
            <p className={`text-xs ${remainingChars < 10 ? "text-orange-500" : "text-gray-500"}`}>
              {remainingChars} characters remaining
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <input
              id="apply-to-all"
              type="checkbox"
              checked={applyToAll}
              onChange={e => setApplyToAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <label htmlFor="apply-to-all" className="text-sm text-gray-700 dark:text-gray-300">
              Apply to all layers
            </label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!label.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default KeyLabelDialog;
```

**Step 2: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/molecules/KeyLabelDialog.tsx
git commit -m "feat(key-labels): add KeyLabelDialog component"
```

---

## Task 6: Create ContextMenu Wrapper Component

**Files:**
- Create: `src/renderer/components/molecules/KeyContextMenu.tsx`

**Step 1: Create the context menu component**

```typescript
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import KeyLabelDialog from "./KeyLabelDialog";
import { useKeyLabels } from "@Renderer/contexts/KeyLabelsContext";

interface KeyContextMenuProps {
  children: React.ReactNode;
  keyPosition: number;
  layer: number;
}

function KeyContextMenu({ children, keyPosition, layer }: KeyContextMenuProps) {
  const { getLabel, setLabel, removeLabel } = useKeyLabels();
  const [dialogOpen, setDialogOpen] = useState(false);

  const currentLabel = getLabel(keyPosition, layer);
  const hasLabel = Boolean(currentLabel);

  const handleSave = (label: string, applyToAll: boolean) => {
    setLabel(keyPosition, layer, label, applyToAll);
  };

  const handleRemove = () => {
    removeLabel(keyPosition, layer);
  };

  return (
    <>
      <ContextMenu.Root>
        <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Content className="min-w-[160px] rounded-md bg-gray-25 dark:bg-gray-800 p-1 shadow-lg border border-gray-200 dark:border-gray-700 z-[1500]">
            <ContextMenu.Item
              className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
              onSelect={() => setDialogOpen(true)}
            >
              {hasLabel ? "Edit Label" : "Add Label"}
            </ContextMenu.Item>
            {hasLabel && (
              <ContextMenu.Item
                className="flex items-center px-3 py-2 text-sm text-red-600 dark:text-red-400 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
                onSelect={handleRemove}
              >
                Remove Label
              </ContextMenu.Item>
            )}
          </ContextMenu.Content>
        </ContextMenu.Portal>
      </ContextMenu.Root>

      <KeyLabelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialLabel={currentLabel || ""}
        onSave={handleSave}
        keyPosition={keyPosition}
        layer={layer}
      />
    </>
  );
}

export default KeyContextMenu;
```

**Step 2: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/renderer/components/molecules/KeyContextMenu.tsx
git commit -m "feat(key-labels): add KeyContextMenu component"
```

---

## Task 7: Create KeyLabelsPanel Component

**Files:**
- Create: `src/renderer/components/organisms/KeyLabelsPanel/KeyLabelsPanel.tsx`
- Create: `src/renderer/components/organisms/KeyLabelsPanel/index.ts`

**Step 1: Create the panel component**

```typescript
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState, useMemo } from "react";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";
import { X, Download, Upload, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { useKeyLabels } from "@Renderer/contexts/KeyLabelsContext";
import { KeyLabelsStore, GLOBAL_LAYER, MAX_LABEL_LENGTH } from "@Types/keyLabels";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";

interface KeyLabelsPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deviceId: string;
  totalLayers: number;
}

function KeyLabelsPanel({ open, onOpenChange, deviceId, totalLayers }: KeyLabelsPanelProps) {
  const { labels, removeLabel, importLabels, exportLabels, setLabel } = useKeyLabels();
  const [filterLayer, setFilterLayer] = useState<number | "all">("all");
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const filteredLabels = useMemo(() => {
    if (filterLayer === "all") return labels;
    return labels.filter(l => l.layer === filterLayer || l.layer === GLOBAL_LAYER);
  }, [labels, filterLayer]);

  const handleExport = async () => {
    try {
      const data = exportLabels();
      const date = new Date().toISOString().split("T")[0];
      const defaultPath = `key-labels-${deviceId}-${date}.json`;

      const filePath = await ipcRenderer.invoke("save-dialog", {
        title: "Export Key Labels",
        defaultPath,
        filters: [{ name: "JSON", extensions: ["json"] }],
      });

      if (filePath) {
        const content = JSON.stringify(data, null, 2);
        await ipcRenderer.invoke("key-labels:write-export", filePath, content);
        toast.success(<ToastMessage title="Labels exported successfully" />);
      }
    } catch (error) {
      toast.error(<ToastMessage title="Failed to export labels" />);
    }
  };

  const handleImport = async () => {
    try {
      const result = await ipcRenderer.invoke("open-dialog", {
        title: "Import Key Labels",
        filters: [{ name: "JSON", extensions: ["json"] }],
        properties: ["openFile"],
      });

      if (result.canceled || !result.filePaths[0]) return;

      const content = await ipcRenderer.invoke("key-labels:read-import", result.filePaths[0]);
      const data: KeyLabelsStore = JSON.parse(content);

      // Validate structure
      if (!data.version || !Array.isArray(data.labels)) {
        toast.error(<ToastMessage title="Invalid labels file format" />);
        return;
      }

      // Warn if different device
      if (data.deviceId !== deviceId) {
        // Still allow import but warn
        toast.warning(<ToastMessage title={`Labels were for ${data.deviceId}, importing anyway`} />);
      }

      // Ask user for merge mode
      const mergeMode = window.confirm("Click OK to merge with existing labels, or Cancel to replace all labels");

      importLabels(data, mergeMode ? "merge" : "replace");
      toast.success(<ToastMessage title={`Imported ${data.labels.length} labels`} />);
    } catch (error) {
      toast.error(<ToastMessage title="Failed to import labels" />);
    }
  };

  const handleEditStart = (keyPosition: number, layer: number, currentLabel: string) => {
    setEditingKey(`${keyPosition}-${layer}`);
    setEditValue(currentLabel);
  };

  const handleEditSave = (keyPosition: number, layer: number) => {
    if (editValue.trim()) {
      setLabel(keyPosition, layer, editValue.trim(), false);
    }
    setEditingKey(null);
  };

  const handleEditCancel = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const getLayerDisplay = (layer: number): string => {
    return layer === GLOBAL_LAYER ? "All" : `${layer + 1}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>Key Labels</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleImport}>
                <Upload className="w-4 h-4 mr-1" />
                Import
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} disabled={labels.length === 0}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 flex-1 overflow-hidden flex flex-col">
          <div className="flex items-center gap-4 mb-4">
            <label className="text-sm text-gray-600 dark:text-gray-400">Filter by layer:</label>
            <select
              value={filterLayer}
              onChange={e => setFilterLayer(e.target.value === "all" ? "all" : Number(e.target.value))}
              className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm"
            >
              <option value="all">All Layers</option>
              {Array.from({ length: totalLayers }, (_, i) => (
                <option key={i} value={i}>
                  Layer {i + 1}
                </option>
              ))}
            </select>
          </div>

          {filteredLabels.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No labels yet. Right-click any key in the layout to add a label.</p>
            </div>
          ) : (
            <div className="flex-1 overflow-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-gray-50 dark:bg-gray-800">
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Key</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Layer</th>
                    <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Label</th>
                    <th className="text-right py-2 px-3 font-medium text-gray-600 dark:text-gray-400">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLabels.map(l => {
                    const editKey = `${l.keyPosition}-${l.layer}`;
                    const isEditing = editingKey === editKey;

                    return (
                      <tr key={editKey} className="border-b border-gray-100 dark:border-gray-700/50">
                        <td className="py-2 px-3 text-gray-900 dark:text-gray-100">Key {l.keyPosition}</td>
                        <td className="py-2 px-3 text-gray-900 dark:text-gray-100">{getLayerDisplay(l.layer)}</td>
                        <td className="py-2 px-3">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value.slice(0, MAX_LABEL_LENGTH))}
                              onKeyDown={e => {
                                if (e.key === "Enter") handleEditSave(l.keyPosition, l.layer);
                                if (e.key === "Escape") handleEditCancel();
                              }}
                              onBlur={() => handleEditSave(l.keyPosition, l.layer)}
                              className="w-full px-2 py-1 rounded border border-purple-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none"
                              autoFocus
                            />
                          ) : (
                            <button
                              onClick={() => handleEditStart(l.keyPosition, l.layer, l.label)}
                              className="text-left text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400 cursor-pointer"
                            >
                              {l.label}
                            </button>
                          )}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <button
                            onClick={() => removeLabel(l.keyPosition, l.layer)}
                            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                            title="Remove label"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyLabelsPanel;
```

**Step 2: Create index file**

```typescript
export { default } from "./KeyLabelsPanel";
```

**Step 3: Create directory**

Run: `mkdir -p src/renderer/components/organisms/KeyLabelsPanel`

**Step 4: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors

**Step 5: Commit**

```bash
git add src/renderer/components/organisms/KeyLabelsPanel/
git commit -m "feat(key-labels): add KeyLabelsPanel component"
```

---

## Task 8: Add Export/Import IPC Handlers

**Files:**
- Modify: `src/main/setup/configureKeyLabelsIpc.ts`

**Step 1: Add the additional IPC handlers**

Add these handlers inside `configureKeyLabelsIPCs` function, after the existing handlers:

```typescript
  ipcMain.handle("key-labels:write-export", async (_event, filePath: string, content: string) => {
    log.verbose(`Exporting key labels to: ${filePath}`);
    try {
      fs.writeFileSync(filePath, content, "utf-8");
      return { success: true };
    } catch (error) {
      log.error("Failed to export key labels:", error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle("key-labels:read-import", async (_event, filePath: string) => {
    log.verbose(`Importing key labels from: ${filePath}`);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return content;
    } catch (error) {
      log.error("Failed to import key labels:", error);
      throw error;
    }
  });
```

Add to `removeKeyLabelsIPCs`:
```typescript
  ipcMain.removeHandler("key-labels:write-export");
  ipcMain.removeHandler("key-labels:read-import");
```

**Step 2: Verify TypeScript compiles**

Run: `yarn typeCheck`
Expected: No errors

**Step 3: Commit**

```bash
git add src/main/setup/configureKeyLabelsIpc.ts
git commit -m "feat(key-labels): add export/import IPC handlers"
```

---

## Task 9: Modify Key.tsx to Add Badge and Tooltip

**Files:**
- Modify: `src/api/hardware/Key.tsx`

**Step 1: Add imports at top of file**

Add after existing imports:
```typescript
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@Renderer/components/atoms/Tooltip";
```

**Step 2: Add customLabel prop to interface**

Add to `KeyShapeProps` interface:
```typescript
  customLabel?: string;
```

**Step 3: Add customLabel to destructured props**

Add `customLabel` to the destructured props in the function:
```typescript
  const {
    keyType,
    id,
    onClick,
    fill,
    stroke,
    width,
    height,
    x,
    y,
    dataLedIndex,
    dataKeyIndex,
    dataLayer,
    centerPrimary,
    centerExtra,
    selectedKey,
    keyCode,
    hidden,
    customLabel,
  } = props;
```

**Step 4: Add badge indicator inside SVG group**

For each key type (`regularKey`, `t5`, `t6`, etc.), add the badge circle inside the `<g>` element, after the `contentForeignObject` group. For `regularKey`, add before the closing `</g>`:

```typescript
          {customLabel && (
            <circle
              cx={x + width - 8}
              cy={y + 8}
              r={4}
              className="fill-purple-500"
            />
          )}
```

**Step 5: Wrap the entire key group with Tooltip**

The Key component return needs to be wrapped. Replace the fragment (`<>...</>`) structure with TooltipProvider wrapping. This is complex due to the multiple key types, so wrap the entire return in a conditional tooltip:

At the start of the return, before the fragment:
```typescript
  const keyContent = (
    <>
      {/* existing key rendering code */}
    </>
  );

  if (customLabel) {
    return (
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <g style={{ cursor: "context-menu" }}>{keyContent}</g>
          </TooltipTrigger>
          <TooltipContent side="top" size="sm">
            {customLabel}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return keyContent;
```

Note: This is a large file. The exact implementation will require careful integration with the existing JSX structure. Test incrementally.

**Step 6: Verify the app renders**

Run: `yarn start`
Expected: App starts without errors

**Step 7: Commit**

```bash
git add src/api/hardware/Key.tsx
git commit -m "feat(key-labels): add badge indicator and tooltip to Key component"
```

---

## Task 10: Integrate Context and Components into LayoutEditor

**Files:**
- Modify: `src/renderer/views/LayoutEditor.tsx`

**Step 1: Add imports**

Add near other imports:
```typescript
import { KeyLabelsProvider, useKeyLabels } from "@Renderer/contexts/KeyLabelsContext";
import KeyLabelsPanel from "@Renderer/components/organisms/KeyLabelsPanel";
import KeyContextMenu from "@Renderer/components/molecules/KeyContextMenu";
import { IconTag } from "@Renderer/components/atoms/icons";
```

Note: You may need to create IconTag or use an existing icon like `Tag` from lucide-react.

**Step 2: Add state for labels panel**

Add in the component's state section:
```typescript
const [labelsPanelOpen, setLabelsPanelOpen] = useState(false);
```

**Step 3: Get device ID from context**

The device ID can be obtained from the existing device context. Look for where `useDevice` is used and extract the device type/ID.

**Step 4: Wrap component with KeyLabelsProvider**

The main return needs to wrap content with `KeyLabelsProvider`. This requires extracting the deviceId from the connected device.

**Step 5: Add Labels button to toolbar**

Find the toolbar section (near LayerSelector) and add:
```typescript
<Button variant="outline" size="sm" onClick={() => setLabelsPanelOpen(true)}>
  <Tag className="w-4 h-4 mr-1" />
  Labels
</Button>
```

**Step 6: Add KeyLabelsPanel**

Add before the closing of the main component:
```typescript
<KeyLabelsPanel
  open={labelsPanelOpen}
  onOpenChange={setLabelsPanelOpen}
  deviceId={deviceId}
  totalLayers={10}
/>
```

**Step 7: Pass customLabel to Key components**

This requires finding where Key components are rendered (likely through the keyboard Keymap components) and passing the customLabel prop. This may require modifying intermediate components.

**Step 8: Verify the app works**

Run: `yarn start`
Expected: App starts, Labels button visible, panel opens

**Step 9: Commit**

```bash
git add src/renderer/views/LayoutEditor.tsx
git commit -m "feat(key-labels): integrate KeyLabelsContext and panel into LayoutEditor"
```

---

## Task 11: Integrate KeyContextMenu with Keyboard Components

**Files:**
- Modify: `src/api/hardware-dygma-raise-ansi/components/Keymap-ANSI.jsx` (and similar files for other keyboard variants)

**Step 1: Identify key rendering locations**

The Key components are rendered in device-specific Keymap files. Each keyboard variant has its own file. You'll need to:
1. Import KeyContextMenu
2. Wrap each Key component with KeyContextMenu
3. Pass keyPosition and layer props

**Step 2: Add import**

```typescript
import KeyContextMenu from "@Renderer/components/molecules/KeyContextMenu";
```

**Step 3: Wrap Key components**

Find where Key components are rendered and wrap them:
```typescript
<KeyContextMenu keyPosition={keyIndex} layer={currentLayer}>
  <Key ... />
</KeyContextMenu>
```

**Step 4: Repeat for other keyboard variants**

- `src/api/hardware-dygma-raise-iso/components/Keymap-ISO.jsx`
- `src/api/hardware-dygma-defy-*/components/Keymap-*.jsx`

**Step 5: Verify context menu works**

Run: `yarn start`
Expected: Right-click on key shows context menu

**Step 6: Commit**

```bash
git add src/api/hardware-dygma-*/components/Keymap-*.jsx
git commit -m "feat(key-labels): integrate context menu with keyboard components"
```

---

## Task 12: Add Tests for KeyLabelsContext

**Files:**
- Create: `src/renderer/contexts/KeyLabelsContext.test.tsx`

**Step 1: Write the failing test**

```typescript
import React from "react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { KeyLabelsProvider, useKeyLabels } from "./KeyLabelsContext";

// Mock electron ipcRenderer
vi.mock("electron", () => ({
  ipcRenderer: {
    invoke: vi.fn(),
  },
}));

describe("KeyLabelsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KeyLabelsProvider deviceId="test-device">{children}</KeyLabelsProvider>
  );

  test("getLabel returns undefined for unlabeled key", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    // Wait for loading to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(0, 0)).toBeUndefined();
  });

  test("setLabel adds a new label", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setLabel(5, 0, "Test Label", false);
    });

    expect(result.current.getLabel(5, 0)).toBe("Test Label");
  });

  test("getLabel returns global label as fallback", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [{ keyPosition: 5, layer: -1, label: "Global Label" }],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should return global label for any layer
    expect(result.current.getLabel(5, 0)).toBe("Global Label");
    expect(result.current.getLabel(5, 3)).toBe("Global Label");
  });

  test("layer-specific label takes precedence over global", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [
        { keyPosition: 5, layer: -1, label: "Global Label" },
        { keyPosition: 5, layer: 0, label: "Layer 0 Label" },
      ],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(5, 0)).toBe("Layer 0 Label");
    expect(result.current.getLabel(5, 1)).toBe("Global Label");
  });

  test("removeLabel removes the label", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [{ keyPosition: 5, layer: 0, label: "Test Label" }],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(5, 0)).toBe("Test Label");

    act(() => {
      result.current.removeLabel(5, 0);
    });

    expect(result.current.getLabel(5, 0)).toBeUndefined();
  });
});
```

**Step 2: Run test to verify it fails initially**

Run: `yarn test src/renderer/contexts/KeyLabelsContext.test.tsx`
Expected: Tests may fail if context file has issues

**Step 3: Fix any issues and verify tests pass**

Run: `yarn test src/renderer/contexts/KeyLabelsContext.test.tsx`
Expected: All tests pass

**Step 4: Commit**

```bash
git add src/renderer/contexts/KeyLabelsContext.test.tsx
git commit -m "test(key-labels): add tests for KeyLabelsContext"
```

---

## Task 13: Final Integration and Testing

**Step 1: Run all tests**

Run: `yarn test`
Expected: All tests pass

**Step 2: Run type check**

Run: `yarn typeCheck`
Expected: No errors

**Step 3: Manual testing checklist**

- [ ] Start app with `yarn start`
- [ ] Connect keyboard (or use virtual keyboard)
- [ ] Right-click a key → context menu appears
- [ ] Add a label → badge appears on key
- [ ] Hover over labeled key → tooltip shows label
- [ ] Edit existing label via context menu
- [ ] Remove label via context menu
- [ ] Open Labels panel from toolbar
- [ ] Filter labels by layer
- [ ] Edit label inline in panel
- [ ] Delete label from panel
- [ ] Export labels to JSON file
- [ ] Import labels from JSON file
- [ ] Switch layers → correct labels displayed
- [ ] Add label with "Apply to all layers" → appears on all layers

**Step 4: Final commit**

```bash
git add -A
git commit -m "feat(key-labels): complete custom key labels feature implementation"
```

---

## Summary

This plan creates 7 new files and modifies 4-5 existing files to implement the custom key labels feature:

**New Files:**
1. `src/renderer/types/keyLabels.ts` - Type definitions
2. `src/main/setup/configureKeyLabelsIpc.ts` - IPC handlers
3. `src/renderer/contexts/KeyLabelsContext.tsx` - State management
4. `src/renderer/components/molecules/KeyLabelDialog.tsx` - Edit dialog
5. `src/renderer/components/molecules/KeyContextMenu.tsx` - Right-click menu
6. `src/renderer/components/organisms/KeyLabelsPanel/` - Overview panel
7. `src/renderer/contexts/KeyLabelsContext.test.tsx` - Tests

**Modified Files:**
1. `package.json` - Add context menu dependency
2. `src/main/setup/configureIPCs.ts` - Register IPC handlers
3. `src/api/hardware/Key.tsx` - Badge and tooltip
4. `src/renderer/views/LayoutEditor.tsx` - Integration
5. `src/api/hardware-dygma-*/components/Keymap-*.jsx` - Context menu wrappers
