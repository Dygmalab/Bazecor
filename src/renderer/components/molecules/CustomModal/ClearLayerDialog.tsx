import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { ColorPalette } from "@Renderer/modules/ColorEditor/ColorPalette";
import { PaletteType } from "@Types/layout";
import { i18n } from "@Renderer/i18n";
import { SelectKeyboardSide } from "@Renderer/components/molecules/CustomSelect/SelectKeyboardSide";
import { SelectResetKeyType } from "@Renderer/components/molecules/CustomSelect/SelectResetKeyType";
import Heading from "@Renderer/components/atoms/Heading";
import BlankTable from "../../../../api/keymap/db/blanks";

export interface OnConfirmProps {
  keyCode: number;
  colorIndex: number;
  chooseYourKeyboardSide: KeyboardSide;
}

type KeyboardSide = "BOTH" | "LEFT" | "RIGHT";

interface ClearLayerDialogProps {
  open: boolean;
  onCancel: () => void;
  onConfirm: (props: OnConfirmProps) => void;
  colors?: PaletteType[];
  selectedColorIndex?: number;
  fillWithNoKey?: boolean;
  keyboardSide?: KeyboardSide;
}

export const ClearLayerDialog = (props: ClearLayerDialogProps): JSX.Element => {
  const { open, onCancel, onConfirm, colors, selectedColorIndex, fillWithNoKey, keyboardSide } = props;
  const [useNoKey, setUseNoKey] = useState(fillWithNoKey ?? false);
  const [chooseYourKeyboardSide, setChooseYourKeyboardSide] = useState(keyboardSide ?? "BOTH");
  const [indexOfSelectedColor, setIndexOfSelectedColor] = useState(selectedColorIndex ?? -1);
  const createLabel = (text: string, forId: string) => (
    <label htmlFor={forId} className="grow m-0 font-semibold">
      {text}
    </label>
  );

  const useNoKeyUpdate = (value: boolean) => {
    setUseNoKey(value);
  };

  const chooseYourKeyboardSideUpdate = (value: KeyboardSide) => {
    setChooseYourKeyboardSide(value);
  };

  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{i18n.editor.modal.clearLayer.title}</DialogTitle>
        </DialogHeader>
        <div className="px-6 pb-2 mt-2">
          <div className="cursor-pointer flex items-center w-full justify-between py-2">
            <Heading renderAs="h4" headingLevel={4}>
              <small className="text-gray-200 dark:text-gray-500">01.</small>{" "}
              {createLabel(i18n.editor.modal.clearLayer.resetColors, "clearColors")}
            </Heading>
          </div>
          <ColorPalette
            colors={colors.concat({ r: 0, g: 0, b: 0, rgb: "transparent" })}
            selected={indexOfSelectedColor}
            onColorSelect={idx => setIndexOfSelectedColor(idx)}
            className="ml-3 mt-2 mb-3"
          />
          <SelectKeyboardSide
            chooseYourKeyboardSide={chooseYourKeyboardSide}
            chooseYourKeyboardSideUpdate={chooseYourKeyboardSideUpdate}
          />
          <SelectResetKeyType useNoKey={useNoKey} useNoKeyUpdate={useNoKeyUpdate} />
        </div>
        <DialogFooter>
          <Button variant="outline" size="md" onClick={onCancel}>
            {i18n.dialog.cancel}
          </Button>
          <Button
            variant="secondary"
            size="md"
            onClick={() =>
              onConfirm({
                keyCode: useNoKey ? BlankTable.keys[0].code : BlankTable.keys[1].code,
                colorIndex: indexOfSelectedColor < colors.length ? indexOfSelectedColor : -1,
                chooseYourKeyboardSide,
              })
            }
          >
            Clear layer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
