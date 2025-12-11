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
import fs from "fs";
import { toast } from "react-toastify";
import { Download, Upload, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
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
  const { labels, setLabel, removeLabel, importLabels, exportLabels } = useKeyLabels();
  const [selectedLayer, setSelectedLayer] = useState<number | "all">("all");
  const [editingKey, setEditingKey] = useState<{ keyPosition: number; layer: number } | null>(null);
  const [editValue, setEditValue] = useState("");

  // Filter labels by selected layer
  const filteredLabels = useMemo(() => {
    if (selectedLayer === "all") {
      return labels;
    }
    return labels.filter(label => label.layer === selectedLayer || label.layer === GLOBAL_LAYER);
  }, [labels, selectedLayer]);

  const handleExport = async () => {
    const data = exportLabels();
    const jsonData = JSON.stringify(data, null, 2);

    const options = {
      title: "Export Key Labels",
      defaultPath: `key-labels-${deviceId}.json`,
      buttonLabel: "Export",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };

    try {
      const path = await ipcRenderer.invoke("save-dialog", options);
      if (typeof path !== "undefined") {
        fs.writeFileSync(path, jsonData);
        toast.success(<ToastMessage title="Key labels exported successfully" icon={<Download />} />, {
          autoClose: 2000,
          icon: "",
        });
      }
    } catch {
      toast.error(<ToastMessage title="Failed to export key labels" icon={<Download />} />, {
        autoClose: 2000,
        icon: "",
      });
    }
  };

  const handleImport = async () => {
    const options = {
      title: "Import Key Labels",
      buttonLabel: "Import",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };

    try {
      const resp = await ipcRenderer.invoke("open-dialog", options);
      if (!resp.canceled) {
        const importedData: KeyLabelsStore = JSON.parse(fs.readFileSync(resp.filePaths[0], "utf-8"));

        // Validate the imported data
        if (!importedData.labels || !Array.isArray(importedData.labels)) {
          throw new Error("Invalid key labels file format");
        }

        importLabels(importedData, "merge");
        toast.success(<ToastMessage title="Key labels imported successfully" icon={<Upload />} />, {
          autoClose: 2000,
          icon: "",
        });
      }
    } catch {
      toast.error(<ToastMessage title="Failed to import key labels" content="Invalid file format" icon={<Upload />} />, {
        autoClose: 2000,
        icon: "",
      });
    }
  };

  const handleEditStart = (keyPosition: number, layer: number, currentLabel: string) => {
    setEditingKey({ keyPosition, layer });
    setEditValue(currentLabel);
  };

  const handleEditSave = (keyPosition: number, layer: number) => {
    if (editValue.trim()) {
      setLabel(keyPosition, layer, editValue.trim(), layer === GLOBAL_LAYER);
    }
    setEditingKey(null);
    setEditValue("");
  };

  const handleEditCancel = () => {
    setEditingKey(null);
    setEditValue("");
  };

  const handleDelete = (keyPosition: number, layer: number) => {
    removeLabel(keyPosition, layer);
  };

  const getLayerDisplay = (layer: number): string => {
    if (layer === GLOBAL_LAYER) {
      return "All Layers";
    }
    return `Layer ${layer + 1}`;
  };

  const isEditing = (keyPosition: number, layer: number): boolean =>
    editingKey?.keyPosition === keyPosition && editingKey?.layer === layer;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Manage Key Labels</DialogTitle>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {/* Header with filter and action buttons */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filter by layer:</span>
              <Select
                value={selectedLayer.toString()}
                onValueChange={value => setSelectedLayer(value === "all" ? "all" : parseInt(value, 10))}
              >
                <SelectTrigger variant="default" className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Layers</SelectItem>
                  {Array.from({ length: totalLayers }, (_, i) => (
                    <SelectItem key={i} value={i.toString()}>
                      Layer {i + 1}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleImport}
                icon={<Upload className="w-4 h-4" />}
                iconDirection="left"
              >
                Import
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                icon={<Download className="w-4 h-4" />}
                iconDirection="left"
              >
                Export
              </Button>
            </div>
          </div>

          {/* Labels table */}
          <div className="border border-gray-200 dark:border-gray-600 rounded-md overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Key</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Layer</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Label</th>
                  <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {filteredLabels.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No labels found. Add labels by right-clicking on keys in the layout editor.
                    </td>
                  </tr>
                ) : (
                  filteredLabels.map(label => (
                    <tr key={`${label.keyPosition}-${label.layer}`} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{label.keyPosition}</td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{getLayerDisplay(label.layer)}</td>
                      <td className="px-4 py-3 text-sm">
                        {isEditing(label.keyPosition, label.layer) ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={e => setEditValue(e.target.value.slice(0, MAX_LABEL_LENGTH))}
                              onKeyDown={e => {
                                if (e.key === "Enter") {
                                  handleEditSave(label.keyPosition, label.layer);
                                } else if (e.key === "Escape") {
                                  handleEditCancel();
                                }
                              }}
                              className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                              // eslint-disable-next-line jsx-a11y/no-autofocus
                              autoFocus
                              maxLength={MAX_LABEL_LENGTH}
                            />
                            <Button variant="outline" size="xs" onClick={() => handleEditSave(label.keyPosition, label.layer)}>
                              Save
                            </Button>
                            <Button variant="outline" size="xs" onClick={handleEditCancel}>
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleEditStart(label.keyPosition, label.layer, label.label)}
                            className="text-left text-gray-900 dark:text-gray-100 hover:text-purple-600 dark:hover:text-purple-400"
                          >
                            {label.label}
                          </button>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="iconXS"
                          onClick={() => handleDelete(label.keyPosition, label.layer)}
                          icon={<Trash2 className="w-4 h-4" />}
                          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <span className="sr-only">Delete</span>
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer info */}
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {filteredLabels.length} label{filteredLabels.length !== 1 ? "s" : ""} shown
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default KeyLabelsPanel;
