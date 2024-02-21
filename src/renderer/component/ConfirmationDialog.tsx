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
import Modal from "react-bootstrap/Modal";
import { i18n } from "@Renderer/i18n";
import { RegularButton } from "./Button";

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
    <Modal backdrop="static" show={open} onHide={onCancel} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title className="title">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body">{text}</Modal.Body>
      <Modal.Footer>
        <RegularButton buttonText={i18n.dialog.cancel} styles="outline transp-bg" size="sm" onClick={onCancel} />
        <RegularButton buttonText={i18n.dialog.applyChanges} styles="outline gradient" size="sm" onClick={onConfirm} />
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationDialog;
