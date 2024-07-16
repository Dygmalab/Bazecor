import { ColorPicker } from "@Renderer/component/Button";
import React from "react";

import { ColorPaletteProps } from "@Types/colorPalette";
import Styled from "styled-components";

const Container = Styled.div`
      display: grid;
      grid-auto-columns: auto;
      grid-auto-flow: column;
      align-items: center;
      grid-gap: 4px;
    `;

const Style = Styled.div``;

export const ColorPalette = (props: ColorPaletteProps) => {
  const { colors, onColorSelect, selected, className } = props;

  const layerButtons = (colors ?? []).map((data, idx) => {
    const menuKey = `color-${idx.toString()}-${data.rgb.toString()}`;
    if (data.rgb === "transparent") {
      return (
        <Style
          tabIndex={-1}
          key={`${menuKey}-key-${data}`}
          onClick={() => {
            onColorSelect(idx);
          }}
          className="text-sm cursor-pointer w-[81px] border border-solid !border-[#7b869e] h-8 m-0 p-1 text-gray-300 hover:text-white focus:outline-none focus:!border-[#6c5ce7] focus:shadow-[0_4px_24px_0px_rgba(108,92,231,0.6)] focus:text-white"
        >
          No change
        </Style>
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
  return <Container className={`colorPalette ${className ?? ""}`.trim()}>{layerButtons}</Container>;
};
