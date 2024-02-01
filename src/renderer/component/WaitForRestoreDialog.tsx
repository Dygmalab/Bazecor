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
import Modal from "react-bootstrap/Modal";

interface WaitForRestoreDialogProps {
  open: boolean;
  title: string;
}

const WaitForRestoreDialog = (props: WaitForRestoreDialogProps): JSX.Element => {
  const { open, title } = props;
  return (
    <Modal backdrop="static" show={open} size="sm" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title className="title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body self-center">
        <Loader2 size={60} strokeWidth={3} color="#ca07ad" className="animate-spin" />
      </Modal.Body>
    </Modal>
  );
};

export default WaitForRestoreDialog;
