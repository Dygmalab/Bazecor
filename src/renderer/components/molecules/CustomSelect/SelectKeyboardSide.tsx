import { i18n } from "@Renderer/i18n";
import ToggleGroup from "@Renderer/components/molecules/CustomToggleGroup/ToggleGroup";
import React from "react";

const createLabel = (text: string, forId: string) => (
  <label htmlFor={forId} className="grow m-0 font-semibold">
    {text}
  </label>
);

type KeyboardSide = {
  chooseYourKeyboardSide: "BOTH" | "LEFT" | "RIGHT";
  chooseYourKeyboardSideUpdate: (value: string | number | boolean) => void;
};

export const SelectKeyboardSide = (props: KeyboardSide) => {
  const { chooseYourKeyboardSide, chooseYourKeyboardSideUpdate } = props;

  return (
    <div className="grid items-center w-full justify-between py-2">
      <div className="mb-4">{createLabel(i18n.editor.modal.clearLayer.chooseYourKeyboardSide, "chooseYourKeyboardSide")}</div>
      <ToggleGroup
        triggerFunction={chooseYourKeyboardSideUpdate}
        value={chooseYourKeyboardSide}
        listElements={[
          { value: "BOTH", name: "Full", icon: "", index: 0 },
          { value: "LEFT", name: "Left", icon: "", index: 1 },
          { value: "RIGHT", name: "Right", icon: "", index: 2 },
        ]}
        variant="flex"
        size="sm"
      />
    </div>
  );
};
