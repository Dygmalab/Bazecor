// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2025  DygmaLab SE.
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";

interface RestorePromptDialogProps {
  open: boolean;
  onRestore: () => void;
  onClose: () => void;
  disabled?: boolean;
}

const RestorePromptDialog = ({ open, onRestore, onClose, disabled }: RestorePromptDialogProps): JSX.Element => {
  return (
    <Dialog open={open}>
      <DialogContent
        className="[&>button]:hidden"
        onPointerDownOutside={e => e.preventDefault()}
        onEscapeKeyDown={e => e.preventDefault()}
        onOpenAutoFocus={e => e.preventDefault()}
      >
        <DialogHeader className="text-center items-center pt-12 space-y-3">
          <DialogTitle className="text-center">Load your amazing layers!</DialogTitle>
          <DialogDescription className="text-center">
            Restore your last backup to bring back your keymaps, lighting and settings.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-10 mt-2 flex flex-col items-center gap-5">
          <Button variant="primary" className="whitespace-nowrap" onClick={onRestore} disabled={disabled}>
            Restore last backup
          </Button>
          <p className="text-xs max-w-sm text-center text-slate-500 dark:text-slate-400">
            If you can't restore your backup, press{" "}
            <button type="button" className="underline" onClick={onClose}>
              HERE
            </button>{" "}
            to reconnect to Bazecor and load the backup manually from Preferences &gt; Backups
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RestorePromptDialog;
