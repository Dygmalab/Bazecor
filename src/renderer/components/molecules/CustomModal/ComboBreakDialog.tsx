/* Bazecor
 * Copyright (C) 2026  DygmaLab SE.
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

import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { i18n } from "@Renderer/i18n";
import { ComboType } from "@Renderer/types/combos";
import { ComboBreakReason } from "../../../../api/parsers/combos";

interface ComboBreakDialogProps {
  open: boolean;
  reason: ComboBreakReason | null;
  /** Index into `combos` of the combo the new key breaks. A key belongs to
   * one combo at most, so there is never more than one. */
  comboIndex: number | null;
  combos: ComboType[];
  onUndo: () => void;
  onKeep: () => void;
}

/** Warns that the key just assigned sits in a combo that can no longer fire. */
export const ComboBreakDialog = (props: ComboBreakDialogProps): JSX.Element => {
  const { open, reason, comboIndex, combos, onUndo, onKeep } = props;
  const strings = i18n.editor.combos.breakModal;
  const isLens = reason === "lens";
  const name = comboIndex !== null ? combos[comboIndex]?.name : "";

  return (
    <Dialog open={open} onOpenChange={onKeep}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{strings.title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2 mt-2 flex flex-col gap-3">
          <p>{isLens ? strings.lens : strings.superkey}</p>
          {comboIndex !== null && (
            <div>
              <p>{strings.affected}</p>
              <p className="mt-1 font-semibold">
                C{comboIndex + 1}
                {name ? ` · ${name}` : ""}
              </p>
            </div>
          )}
          <p className="text-gray-400 dark:text-gray-200">{isLens ? strings.lensHint : strings.superkeyHint}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={onKeep}>
            {strings.keep}
          </Button>
          <Button variant="secondary" size="md" onClick={onUndo}>
            {strings.undo}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ComboBreakDialog;
