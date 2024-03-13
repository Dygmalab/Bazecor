import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RegularButton } from "@Renderer/component/Button";
import { ColorPalette } from "@Renderer/modules/ColorEditor/ColorPalette";
import { PaletteType } from "@Types/layout";
import { Switch } from "@Renderer/components/ui/switch";
import { i18n } from "@Renderer/i18n";
import { NOKEY_KEY_CODE, TRANS_KEY_CODE } from "../../../api/keymap/types";

export interface OnConfirmProps {
  keyCode: number;
  colorIndex: number;
}

interface ClearLayerDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (props: OnConfirmProps) => void;
  colors?: PaletteType[];
  selectedColorIndex?: number;
  fillWithNoKey?: boolean;
}

export const ClearLayerDialog = (props: ClearLayerDialogProps): JSX.Element => {
  const { open, onCancel, onConfirm, colors, selectedColorIndex, fillWithNoKey } = props;
  const [useNoKey, setUseNoKey] = useState(fillWithNoKey ?? false);
  const [clearColors, setClearColors] = useState(selectedColorIndex >= 0);
  const [indexOfSelectedColor, setIndexOfSelectedColor] = useState(selectedColorIndex ?? -1);
  const createLabel = (text: string, forId: string) => (
    <label htmlFor={forId} className="grow m-0 font-semibold">
      {text}
    </label>
  );

  return (
    <Modal
      className="dlgClearLayer"
      backdrop="static"
      show={open}
      onHide={onCancel}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title className="title">{i18n.editor.modal.clearLayer.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="body">
        <div className="border-b-[1px] mb-2 py-2">
          <div className="cursor-pointer flex items-center w-full justify-between py-2">
            {createLabel(i18n.editor.modal.clearLayer.resetColors, "clearColors")}
            <Switch
              id="clearColors"
              defaultChecked
              checked={clearColors}
              onCheckedChange={setClearColors}
              variant="default"
              size="sm"
            />
          </div>
          {clearColors && (
            <ColorPalette
              colors={colors}
              selected={indexOfSelectedColor}
              onColorSelect={(ev, idx) => setIndexOfSelectedColor(idx)}
              className="ml-3 mt-2 mb-3"
            />
          )}
        </div>
        <div className="flex items-center w-full justify-between py-2">
          {createLabel(i18n.editor.modal.clearLayer.useNoKey, "useNoKeyInstead")}
          <Switch
            id="useNoKeyInstead"
            defaultChecked={false}
            checked={useNoKey}
            onCheckedChange={setUseNoKey}
            variant="default"
            size="sm"
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <RegularButton buttonText={i18n.dialog.cancel} styles="outline transp-bg" size="sm" onClick={onCancel} />
        <RegularButton
          buttonText={i18n.dialog.ok}
          styles="outline gradient"
          size="sm"
          onClick={() =>
            onConfirm({
              keyCode: useNoKey ? NOKEY_KEY_CODE : TRANS_KEY_CODE,
              colorIndex: clearColors ? indexOfSelectedColor : -1,
            })
          }
        />
      </Modal.Footer>
    </Modal>
  );
};
