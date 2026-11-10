/* Bazecor
 * Copyright (C) 2026  Dygmalab, Inc.
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

import React, { useState } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import { Button } from "@Renderer/components/atoms/Button";

// Drawing size in px. The mouse sits in the middle with Middle Click above it, Left Click and the
// side buttons in a column on its left and Right Click on its right. A leader line joins every part
// of the mouse to its button, and no line crosses another part.
const WIDTH = 380;
const HEIGHT = 204;
const BUTTON_WIDTH = 112;
const BUTTON_HEIGHT = 28;
const LEFT_COLUMN = 0;
const RIGHT_COLUMN = WIDTH - BUTTON_WIDTH;
const CENTER_COLUMN = (WIDTH - BUTTON_WIDTH) / 2;
// Mouse body: x 148-232, y 40-200
const BODY = { x: 148, y: 40, width: 84, height: 160, rx: 42, ry: 54 };

const Styles = Styled.div`
position: relative;
width: ${WIDTH}px;
height: ${HEIGHT}px;
flex-shrink: 0;

.mouseBody {
    fill: ${({ theme }) => theme.styles.mouseButtons.background};
}
.mouseOutline {
    fill: none;
    stroke: ${({ theme }) => theme.styles.mouseButtons.clickBorder};
    stroke-width: 2;
    pointer-events: none;
}
.mousePart {
    fill: ${({ theme }) => theme.styles.mouseButtons.clickZone};
    cursor: pointer;
    transition: fill 200ms ease-in-out;
    &.mousePartAccent {
        fill: ${({ theme }) => theme.styles.mouseButtons.clickZoneAccent};
    }
    &.mouseWheel {
        stroke: ${({ theme }) => theme.styles.mouseButtons.background};
        stroke-width: 3;
    }
    &.hover {
        fill: ${({ theme }) => theme.styles.mouseButtons.clickZoneHover};
    }
    &.active {
        fill: ${({ theme }) => theme.styles.button.buttonMouse.backgroundColorActive};
    }
}
.mouseLeader {
    fill: none;
    stroke: ${({ theme }) => theme.styles.mouseButtons.clickBorder};
    stroke-width: 1.5;
    pointer-events: none;
    transition: stroke 200ms ease-in-out;
}
.mouseLeaderDot {
    fill: ${({ theme }) => theme.styles.mouseButtons.clickBorder};
    pointer-events: none;
    transition: fill 200ms ease-in-out;
}
.mouseLeader.hover, .mouseLeader.active {
    stroke: ${({ theme }) => theme.styles.button.buttonMouse.backgroundColorActive};
}
.mouseLeaderDot.hover, .mouseLeaderDot.active {
    fill: ${({ theme }) => theme.styles.button.buttonMouse.backgroundColorActive};
}
`;

interface ClickPart {
  keynum: number;
  name: string;
  // Left edge and vertical center of the button, in drawing px
  buttonX: number;
  buttonY: number;
  // Outline of the part, in drawing px
  shape: string;
  shapeClass: string;
  // Line from the edge of the button to the part, and the dot that marks the part
  leader: string;
  dot: [number, number];
}

// Rows of the left column are 44px apart. The two main buttons fill the top of the body, split by a
// 4px gap where the wheel sits and where the Middle Click line comes down. The side buttons sit on
// the left edge, Forward in front of Back.
// SVG paints in order, so the wheel goes after Left and Right or their zones would cover it.
const getParts = (): ClickPart[] => [
  {
    keynum: 20545,
    name: i18n.mouse.clickLeft,
    buttonX: LEFT_COLUMN,
    buttonY: 82,
    shape: "M148 116V94A42 54 0 0 1 188 40.06V116Z",
    shapeClass: "",
    leader: "M112 82H168",
    dot: [168, 82],
  },
  {
    keynum: 20546,
    name: i18n.mouse.clickRight,
    buttonX: RIGHT_COLUMN,
    buttonY: 82,
    shape: "M232 116V94A42 54 0 0 0 192 40.06V116Z",
    shapeClass: "",
    leader: "M212 82H268",
    dot: [212, 82],
  },
  {
    keynum: 20548,
    name: i18n.mouse.clickMiddle,
    buttonX: CENTER_COLUMN,
    buttonY: 14,
    shape: "M183 61a7 7 0 0 1 14 0v14a7 7 0 0 1-14 0Z",
    shapeClass: "mousePartAccent mouseWheel",
    leader: "M190 28V58",
    dot: [190, 58],
  },
  {
    keynum: 20560,
    name: i18n.mouse.clickForward,
    buttonX: LEFT_COLUMN,
    buttonY: 126,
    shape: "M154.5 122h5a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-5a2.5 2.5 0 0 1-2.5-2.5v-13a2.5 2.5 0 0 1 2.5-2.5Z",
    shapeClass: "mousePartAccent",
    leader: "M112 126H136L157 131",
    dot: [157, 131],
  },
  {
    keynum: 20552,
    name: i18n.mouse.clickBack,
    buttonX: LEFT_COLUMN,
    buttonY: 170,
    shape: "M154.5 144h5a2.5 2.5 0 0 1 2.5 2.5v13a2.5 2.5 0 0 1-2.5 2.5h-5a2.5 2.5 0 0 1-2.5-2.5v-13a2.5 2.5 0 0 1 2.5-2.5Z",
    shapeClass: "mousePartAccent",
    leader: "M112 170H136L157 153",
    dot: [157, 153],
  },
];

interface MouseClickDiagramProps {
  selectedKeynum: number | undefined;
  onSelect: (keynum: number) => void;
}

function MouseClickDiagram({ selectedKeynum, onSelect }: Readonly<MouseClickDiagramProps>) {
  const [hovered, setHovered] = useState<number | undefined>(undefined);
  const parts = getParts();

  const stateClass = (keynum: number) => {
    if (selectedKeynum === keynum) return "active";
    if (hovered === keynum) return "hover";
    return "";
  };

  const buttonHoverClass = (keynum: number) =>
    hovered === keynum && selectedKeynum !== keynum ? "!bg-configButtonHover dark:!bg-configButtonDarkHover" : "";

  return (
    <Styles className="mouseClickDiagram">
      <svg
        width={WIDTH}
        height={HEIGHT}
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect className="mouseBody" x={BODY.x} y={BODY.y} width={BODY.width} height={BODY.height} rx={BODY.rx} ry={BODY.ry} />
        {parts.map(part => (
          <path
            key={`shape-${part.keynum}`}
            d={part.shape}
            className={`mousePart ${part.shapeClass} ${stateClass(part.keynum)}`}
            onClick={() => onSelect(part.keynum)}
            onMouseEnter={() => setHovered(part.keynum)}
            onMouseLeave={() => setHovered(undefined)}
          />
        ))}
        <rect className="mouseOutline" x={BODY.x} y={BODY.y} width={BODY.width} height={BODY.height} rx={BODY.rx} ry={BODY.ry} />
        {parts.map(part => (
          <g key={`leader-${part.keynum}`}>
            <path
              className={`mouseLeader ${stateClass(part.keynum)}`}
              d={part.leader}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle className={`mouseLeaderDot ${stateClass(part.keynum)}`} cx={part.dot[0]} cy={part.dot[1]} r={3} />
          </g>
        ))}
      </svg>
      {parts.map(part => (
        <Button
          key={`button-${part.keynum}`}
          onClick={() => onSelect(part.keynum)}
          onMouseEnter={() => setHovered(part.keynum)}
          onMouseLeave={() => setHovered(undefined)}
          selected={selectedKeynum === part.keynum}
          variant="config"
          size="sm"
          className={`absolute !py-0 !px-2 ${buttonHoverClass(part.keynum)}`}
          style={{
            top: part.buttonY - BUTTON_HEIGHT / 2,
            left: part.buttonX,
            width: BUTTON_WIDTH,
            height: BUTTON_HEIGHT,
          }}
        >
          {part.name}
        </Button>
      ))}
    </Styles>
  );
}

export default MouseClickDiagram;
