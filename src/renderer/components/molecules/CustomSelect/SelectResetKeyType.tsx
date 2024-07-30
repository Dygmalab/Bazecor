import { i18n } from "@Renderer/i18n";
import ToggleGroup from "@Renderer/components/molecules/CustomToggleGroup/ToggleGroup";
import React from "react";

const createLabel = (text: string, forId: string) => (
  <label htmlFor={forId} className="grow m-0 font-semibold">
    {text}
  </label>
);

type ResetKeyType = {
  useNoKey: boolean;
  useNoKeyUpdate: (value: boolean) => void;
};

export const SelectResetKeyType = (props: ResetKeyType) => {
  const { useNoKey, useNoKeyUpdate } = props;

  return (
    <div className="grid items-center w-full justify-between py-2">
      <div className="mb-4">{createLabel(i18n.editor.modal.clearLayer.useNoKey, "useNoKeyInstead")}</div>
      <ToggleGroup
        triggerFunction={useNoKeyUpdate}
        value={useNoKey}
        listElements={[
          { value: false, name: "TRANS", icon: "", index: 0 },
          { value: true, name: "NO KEY", icon: "", index: 1 },
        ]}
        variant="flex"
        size="sm"
      />
    </div>
  );
};
