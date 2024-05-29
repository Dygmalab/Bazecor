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
import Styled from "styled-components";

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Placement } from "react-bootstrap/esm/Overlay";

const Style = Styled.div`

}
`;

interface ButtonConfigProps {
  selected?: boolean;
  onClick: (e: unknown) => void;
  buttonText?: string;
  disabled?: boolean;
  className?: string;
  size?: string;
  tooltip?: string;
  tooltipPlacement?: Placement;
  tooltipClassName?: string;
  variation?: string;
  icoSVG?: any;
  icoPosition?: string;
  tooltipDelay?: number;
  dataAnimate?: any;
}

function ButtonConfig(props: ButtonConfigProps) {
  const {
    selected = false,
    onClick,
    size,
    buttonText,
    tooltip,
    tooltipPlacement,
    tooltipClassName,
    variation,
    icoSVG,
    icoPosition,
    tooltipDelay,
    disabled = false,
    dataAnimate,
    className,
  } = props;

  return (
    <>
      {tooltip ? (
        <OverlayTrigger
          placement={tooltipPlacement || "top"}
          delay={{ show: tooltipDelay || 0, hide: 0 }}
          overlay={
            <Tooltip id="tooltip-top" className={`${tooltipClassName || "tooltipRegular"}`}>
              <div dangerouslySetInnerHTML={{ __html: tooltip }} />
            </Tooltip>
          }
        >
          <Style
            onClick={e => {
              if (!disabled) onClick(e);
            }}
            data-value={selected}
            className={`${className} ${size || ""} ${selected ? "active" : ""} ${disabled ? "disabled" : ""}  button-config ${
              variation || ""
            } ${variation || ""} ${variation || ""} icon-${icoPosition || "none"}`}
          >
            {icoSVG && icoPosition !== "right" ? icoSVG : ""}
            {buttonText && <span className="buttonLabel" dangerouslySetInnerHTML={{ __html: buttonText }} />}
            {icoSVG && icoPosition === "right" ? icoSVG : ""}
          </Style>
        </OverlayTrigger>
      ) : (
        <Style
          onClick={e => {
            if (!disabled) onClick(e);
          }}
          data-value={selected}
          className={`${className} ${size || ""} ${selected ? "active" : ""} ${disabled ? "disabled" : ""}  button-config ${
            variation || ""
          } ${variation || ""} icon-${icoPosition || "none"}`}
          data-animate={dataAnimate}
        >
          {icoSVG && icoPosition !== "right" ? icoSVG : ""}
          {buttonText && <span className="buttonLabel" dangerouslySetInnerHTML={{ __html: buttonText }} />}
          {icoSVG && icoPosition === "right" ? icoSVG : ""}
        </Style>
      )}
    </>
  );
}

export default ButtonConfig;
