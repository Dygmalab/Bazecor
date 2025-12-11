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
      } catch {
        // Labels failed to load - fallback to empty
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

  const exportLabels = useCallback(
    (): KeyLabelsStore => ({
      version: 1,
      deviceId,
      labels,
    }),
    [deviceId, labels],
  );

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
