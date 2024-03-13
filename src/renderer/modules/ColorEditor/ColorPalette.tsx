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

export const ColorPalette = (props: ColorPaletteProps) => {
  const { colors, onColorSelect, selected, className } = props;

  const layerButtons = (colors ?? []).map((data, idx) => {
    const menuKey = `color-${idx.toString()}-${data.rgb.toString()}`;
    const buttonStyle = {
      backgroundColor: data.rgb,
    };
    return (
      <ColorPicker
        onClick={(ev: Event) => onColorSelect(ev, idx)}
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
