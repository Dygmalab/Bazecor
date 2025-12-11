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

  // Track the previous open state to detect when dialog opens
  const prevOpenRef = useRef(open);

  useEffect(() => {
    // Only reset state when dialog transitions from closed to open
    // Don't reset if initialLabel changes while dialog is already open
    if (open && !prevOpenRef.current) {
      setLabel(initialLabel);
      setApplyToAll(false);
      // Focus input after dialog opens
      setTimeout(() => inputRef.current?.focus(), 50);
    }
    prevOpenRef.current = open;
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
      <DialogContent className="max-w-md !z-[1600]">
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
          <label htmlFor="apply-to-all" className="flex items-center space-x-2 cursor-pointer">
            <input
              id="apply-to-all"
              type="checkbox"
              checked={applyToAll}
              onChange={e => setApplyToAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Apply to all layers</span>
          </label>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!label.trim()}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default KeyLabelDialog;
