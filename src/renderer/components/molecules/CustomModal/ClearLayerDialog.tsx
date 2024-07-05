import React, { useState } from "react";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@Renderer/components/atoms/Dialog";
import { Button } from "@Renderer/components/atoms/Button";
import { ColorPalette } from "@Renderer/modules/ColorEditor/ColorPalette";
import { PaletteType } from "@Types/layout";
import { i18n } from "@Renderer/i18n";
import ToggleGroup from "@Renderer/components/molecules/CustomToggleGroup/ToggleGroup";
import Heading from "@Renderer/components/atoms/Heading";
import { NOKEY_KEY_CODE, TRANS_KEY_CODE } from "../../../../api/keymap/types";

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
  const [indexOfSelectedColor, setIndexOfSelectedColor] = useState(selectedColorIndex ?? -1);
  const createLabel = (text: string, forId: string) => (
    <label htmlFor={forId} className="grow m-0 font-semibold">
      {text}
    </label>
  );

  const useNoKeyUpdate = (value: boolean) => {
    setUseNoKey(value);
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
          <div className="toggleButtonsInner w-full flex items-center justify-start gap-1 p-[4px] rounded-regular border-[1px] border-solid border-gray-100/60 bg-white/30 dark:border-transparent dark:bg-gray-900/25 w-fit [&_.button-config]:basis-full [&_.button-config]:text-center">
            <ColorPalette
              colors={colors.concat({ r: 0, g: 0, b: 0, rgb: "transparent" })}
              selected={indexOfSelectedColor}
              onColorSelect={idx => setIndexOfSelectedColor(idx)}
              className="w-full"
            />
          </div>
          <div className="grid items-center w-full justify-between py-2 mt-2">
            <Heading renderAs="h4" headingLevel={4} className="mb-2">
              <small className="text-gray-200 dark:text-gray-500">02.</small>{" "}
              {createLabel(i18n.editor.modal.clearLayer.useNoKey, "useNoKeyInstead")}
            </Heading>
            <ToggleGroup
              triggerFunction={useNoKeyUpdate}
              value={useNoKey}
              listElements={[
                { value: false, name: "Transparent", icon: "", index: 0 },
                { value: true, name: "No Key", icon: "", index: 1 },
              ]}
              variant="flex"
              size="sm"
            />
          </div>
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
                keyCode: useNoKey ? NOKEY_KEY_CODE : TRANS_KEY_CODE,
                colorIndex: indexOfSelectedColor < colors.length ? indexOfSelectedColor : -1,
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
