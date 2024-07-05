import { ColorPicker } from "@Renderer/component/Button";
import React from "react";

import { ColorPaletteProps } from "@Types/colorPalette";
import { Button } from "@Renderer/components/atoms/Button";

export const ColorPalette = (props: ColorPaletteProps) => {
  const { colors, onColorSelect, selected, className } = props;

  const layerButtons = (colors ?? []).map((data, idx) => {
    const menuKey = `color-${idx.toString()}-${data.rgb.toString()}`;
    if (data.rgb === "transparent") {
      return (
        <Button
          variant="config"
          key={`${menuKey}-key-${data}`}
          onClick={() => onColorSelect(idx)}
          selected={selected === 16}
          size="xs"
        >
          No change
        </Button>
      );
    }
    const buttonStyle = {
      backgroundColor: data.rgb,
    };
    return (
      <ColorPicker
        onClick={() => onColorSelect(idx)}
        menuKey={menuKey}
        key={`${menuKey}-key-${data}`}
        id={idx}
        selected={selected}
        buttonStyle={buttonStyle}
        dataID={data.rgb}
        className="colorPicker"
      />
    );
  });
  return (
    <div className={`colorPalette items-center grid gap-1 auto-cols-auto grid-flow-col ${className ?? ""}`.trim()}>
      {layerButtons}
    </div>
  );
};
