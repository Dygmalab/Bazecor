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

import { Loader2 } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";

interface WaitForRestoreDialogProps {
  open: boolean;
  title: string;
}

const WaitForRestoreDialog = (props: WaitForRestoreDialogProps): JSX.Element => {
  const { open, title } = props;
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2 mt-2">
          <Loader2 size={60} strokeWidth={3} color="#ca07ad" className="animate-spin" />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WaitForRestoreDialog;
