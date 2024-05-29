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

import React from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { i18n } from "@Renderer/i18n";
import { Button } from "@Renderer/components/atoms/Button";

interface ConfirmationDialogProps {
  open: boolean;
  onCancel: () => void;
  title: string;
  text: string;
  onConfirm: () => void;
}

const ConfirmationDialog = (props: ConfirmationDialogProps): JSX.Element => {
  const { open, onCancel, title, text, onConfirm } = props;
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2 mt-2">{text}</div>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={onCancel}>
            {i18n.dialog.cancel}
          </Button>
          <Button variant="secondary" size="md" onClick={onConfirm}>
            {i18n.dialog.applyChanges}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
