// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
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
import colorDarkerCalculation from "../../renderer/utils/colorDarkerCalculation";

interface UnderGlowStripProps {
  id: string;
  onClick: () => void;
  fill: string;
  visibility: boolean;
  clickAble: boolean;
  x: number;
  y: number;
  selectedLED: number;
  dataLedIndex: number;
  dataKeyIndex: number;
  dataLayer: number;
  path: string;
}

function UnderGlowStrip(props: UnderGlowStripProps) {
  const [color, setColor] = React.useState("rgb(255,255,255)");
  const [strokeColor, setStrokeColor] = React.useState(colorDarkerCalculation("rgb(255,255,255)"));
  const { id, onClick, fill, visibility, clickAble, x, y, selectedLED, dataLedIndex, dataKeyIndex, dataLayer, path } = props;

  React.useEffect(() => {
    setColor(fill);
    setStrokeColor(colorDarkerCalculation(fill));
  }, [fill]);

  if (!visibility) return null;
  return (
    <>
      <g
        id={id}
        onClick={clickAble ? onClick : () => {}}
        data-led-index={dataLedIndex}
        data-key-index={dataKeyIndex}
        data-layer={dataLayer}
        className={`${selectedLED === dataLedIndex ? "keyOnFocus" : "keyOnHold"} underGlowStrip ${clickAble ? "clickAble" : ""}`}
        transform={`translate(${x},${y})`}
      >
        <path d={path} fill={color} className="underGlowStripShadow" />
        <path d={path} fill={color} />
        <path d={path} fill="transparent" strokeWidth={1.5} stroke={strokeColor} className="underGlowStripStroke" />
      </g>
    </>
  );
}
export default UnderGlowStrip;
