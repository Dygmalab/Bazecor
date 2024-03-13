import React from "react";
import Modal from "react-bootstrap/Modal";
import { RegularButton } from "@Renderer/component/Button";

import { i18n } from "@Renderer/i18n";
import { NOKEY_KEY, TRANS_KEY } from "../../../api/keymap/db/blanks";
import { KeymapCodeTableType } from "../../../api/keymap/types";

export interface OnConfirmProps {
  keyCode: number;
}

interface ClearLayerDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (props: OnConfirmProps) => void;
}

export const ClearLayerDialog = (props: ClearLayerDialogProps): JSX.Element => {
  const { open, onCancel, onConfirm } = props;

  const getButtonLabel = (key: KeymapCodeTableType) => {
    if (key === NOKEY_KEY) return "NO KEY";
    if (key === TRANS_KEY) return "TRANS.";
    return key.labels.primary.toString();
  };

  const createKeyButton = (key: KeymapCodeTableType) => (
    <RegularButton
      buttonText={getButtonLabel(key)}
      styles="outline gradient"
      size="sm"
      onClick={() => onConfirm({ keyCode: key.code })}
    />
  );

  return (
    <Modal backdrop="static" show={open} onHide={onCancel} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title className="title">{i18n.editor.clearLayerQuestion}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body">{i18n.editor.clearLayerPrompt}</Modal.Body>
      <Modal.Footer>
        <RegularButton buttonText={i18n.dialog.cancel} styles="outline transp-bg" size="sm" onClick={onCancel} />
        {[NOKEY_KEY, TRANS_KEY].map(createKeyButton)}
      </Modal.Footer>
    </Modal>
  );
};
