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

import React, { useCallback, createContext, useContext, useState, useMemo } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { useKeyLabels } from "@Renderer/contexts/KeyLabelsContext";
import KeyLabelDialog from "./KeyLabelDialog";

// Context for the shared dialog state - prevents each KeyContextMenu from having its own dialog
interface KeyLabelDialogContextValue {
  openDialog: (keyPosition: number, layer: number) => void;
}

const KeyLabelDialogContext = createContext<KeyLabelDialogContextValue | null>(null);

// Provider component that holds the single shared dialog
interface KeyLabelDialogProviderProps {
  children: React.ReactNode;
}

function KeyLabelDialogProvider({ children }: KeyLabelDialogProviderProps) {
  const { getLabel, setLabel } = useKeyLabels();
  const [dialogState, setDialogState] = useState<{ open: boolean; keyPosition: number; layer: number }>({
    open: false,
    keyPosition: 0,
    layer: 0,
  });

  const openDialog = useCallback((keyPosition: number, layer: number) => {
    setDialogState({ open: true, keyPosition, layer });
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    setDialogState(prev => ({ ...prev, open }));
  }, []);

  const handleSave = useCallback(
    (label: string, applyToAll: boolean) => {
      setLabel(dialogState.keyPosition, dialogState.layer, label, applyToAll);
    },
    [dialogState.keyPosition, dialogState.layer, setLabel],
  );

  const currentLabel = dialogState.open ? getLabel(dialogState.keyPosition, dialogState.layer) : "";

  const contextValue = useMemo(() => ({ openDialog }), [openDialog]);

  return (
    <KeyLabelDialogContext.Provider value={contextValue}>
      {children}
      <KeyLabelDialog
        open={dialogState.open}
        onOpenChange={handleOpenChange}
        initialLabel={currentLabel || ""}
        onSave={handleSave}
        keyPosition={dialogState.keyPosition}
        layer={dialogState.layer}
      />
    </KeyLabelDialogContext.Provider>
  );
}

// Hook to access the dialog opener
function useKeyLabelDialog() {
  const context = useContext(KeyLabelDialogContext);
  if (!context) {
    throw new Error("useKeyLabelDialog must be used within a KeyLabelDialogProvider");
  }
  return context;
}

interface KeyContextMenuProps {
  children: React.ReactNode;
  keyPosition: number;
  layer: number;
}

function KeyContextMenu({ children, keyPosition, layer }: KeyContextMenuProps) {
  const { getLabel, removeLabel } = useKeyLabels();
  const { openDialog } = useKeyLabelDialog();

  const currentLabel = getLabel(keyPosition, layer);
  const hasLabel = Boolean(currentLabel);

  const handleAddEdit = useCallback(() => {
    // Delay opening the dialog to let the context menu fully close first
    // This prevents a race condition between Radix ContextMenu and Dialog portals
    requestAnimationFrame(() => {
      openDialog(keyPosition, layer);
    });
  }, [openDialog, keyPosition, layer]);

  const handleRemove = useCallback(() => {
    removeLabel(keyPosition, layer);
  }, [keyPosition, layer, removeLabel]);

  return (
    <ContextMenu.Root>
      {/* Use a <g> wrapper for SVG context - ContextMenu.Trigger needs a single element that can receive refs */}
      <ContextMenu.Trigger asChild>
        <g style={{ cursor: "context-menu" }}>{children}</g>
      </ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Content className="min-w-[160px] rounded-md bg-gray-25 dark:bg-gray-800 p-1 shadow-lg border border-gray-200 dark:border-gray-700 z-[1500]">
          <ContextMenu.Item
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-200 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700"
            onSelect={handleAddEdit}
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
  );
}

export default KeyContextMenu;
export { KeyLabelDialogProvider };
