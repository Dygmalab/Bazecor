// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { i18n } from "@Renderer/i18n";
import { LayerType } from "@Renderer/types/neurons";

import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

interface CopyFromDialogProps {
  open: boolean;
  onCancel: () => void;
  onCopy: (layer: number) => void;
  layers: LayerType[];
  currentLayer: number;
}

export function CopyFromDialog(props: CopyFromDialogProps) {
  const { open, onCancel, onCopy, layers, currentLayer } = props;
  const [selectedLayer, setSelectedLayer] = useState(-1);

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.editor.layers.copyFrom}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2 mt-2">
          <Heading renderAs="h4" headingLevel={4}>
            {i18n.editor.pleaseSelectLayer}
          </Heading>
          <div
            className={`toggleButtonsInner flex flex-col items-center justify-start gap-1 p-[4px] rounded-regular border-[1px] border-solid border-gray-100/60 bg-white/30 dark:border-transparent dark:bg-gray-900/25 w-full [&_.button-config]:w-full [&_.button-config]:basis-full [&_.button-config]:text-left [&_.button-config.disabled]:opacity-25 [&_.button-config.disabled]:pointer-events-none"}`}
          >
            {layers.map(layer => (
              <Button
                onClick={() => {
                  setSelectedLayer(layer.id);
                }}
                variant="config"
                selected={layer.id === selectedLayer}
                size="sm"
                disabled={layer.id === currentLayer}
                key={layer.id}
                className="w-full text-left justify-start"
              >
                {layer.name} {layer.id === selectedLayer ? i18n.editor.layers.layerToCopy : ""}
              </Button>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedLayer(-1);
              onCancel();
            }}
          >
            {i18n.dialog.cancel}
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              const layer = selectedLayer;
              setSelectedLayer(-1);
              onCopy(layer);
            }}
          >
            Copy layer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
