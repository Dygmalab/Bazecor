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
import LightWarning from "@Assets/base/light-warning.png";
import LightDanger from "@Assets/base/light-danger.png";
import LightSuccess from "@Assets/base/light-success.png";
import { IconInformationBubble, IconInformationBubbleSm } from "../Icon";

const Style = Styled.div`
.lg {
	font-size:81px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.md {
	font-size:54px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
h1 {
	font-size:36px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
h2 {
	font-size:24px;
	font-family:"Libre Franklin";
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
h3 {
	font-size:21px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
h4 {
	font-size:18px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
h5 {
	font-size:12px;
	font-weight:600;
	line-height:125%;
	letter-spacing:0.04em;
	text-decoration:none;
  text-transform: uppercase;
}
h6 {
	font-size:14px;
	font-weight:600;
	letter-spacing:-0.03em;
	text-decoration:none;
}
.hasIcon svg {
	margin-right: 12px;
	vertical-align: -0.2em;
}
.tooltipIcon {
  color: ${({ theme }) => theme.colors.purple100};
  margin-left: 8px;
  vertical-align: 2px;
  display: inline-block;
}
.titleAlert {
	position: relative;
	&:before {
		content: "";
		position: absolute;
		left: -32px;	
		top: 50%;
		background-repeat: no-repeat;
		width: 32px;
		height: 96px;
		transform: translate3d(0, -50%, 0);
	} 
	&:after {
		content: "";
		position: absolute;
		left: -35px;	
		top: 50%;
		width: 3px;
		height: 24px;	
		border-radius: 3px 0px 0px 3px;	
		transform: translate3d(0, -50%, 0);
	}
}
.warning {
	color: ${({ theme }) => theme.colors.textWarning};
	&:before {
		background-image: url(${LightWarning});
	}
	&:after {
		background: ${({ theme }) => theme.colors.gradientWarning};
	}
}
.error,
.danger {
	color: ${({ theme }) => theme.colors.textDanger};
	&:before {
		background-image: url(${LightSuccess});
	}
	&:after {
		background: ${({ theme }) => theme.colors.gradientDanger};
	}
}

.success {
	color: ${({ theme }) => theme.colors.textSuccess};
	&:before {
		background-image: url(${LightSuccess});
	}
	&:after {
		background: ${({ theme }) => theme.colors.gradientSuccess};
	}
}

.counterIndicator {
	position: relative;
}
.counterIndicator:before {
	position: absolute;
	left: -42px;
	content: "";
	font-weight: 700;
	color: ${({ theme }) => theme.styles.title.counterColor};
}
.counter1:before {
	content: "01";
}
.counter2:before {
	content: "02";
}

`;
function Title({
  text,
  headingLevel,
  size,
  className,
  color,
  type,
  tooltip,
  tooltipSize,
  tooltipIconSize,
  tooltipPlacement,
  svgICO,
}) {
  const Tag = `h${headingLevel}`;

  return (
    <Style>
      <Tag
        className={`${size || ""} ${type && "titleAlert"} ${type || ""} ${color || ""} ${svgICO ? "hasIcon" : ""} ${
          className || ""
        }`}
      >
        {svgICO && svgICO}
        <span dangerouslySetInnerHTML={{ __html: text }} />
        {tooltip && (
          <OverlayTrigger
            placement={`${tooltipPlacement || "top"}`}
            overlay={
              <Tooltip id="tooltip-top" className={`${tooltipSize == "wide" ? "tooltipWide" : "tooltipRegular"}`}>
                <div dangerouslySetInnerHTML={{ __html: tooltip }} />
              </Tooltip>
            }
          >
            <span className="tooltipIcon">
              {tooltipIconSize == "sm" ? <IconInformationBubbleSm /> : <IconInformationBubble />}
            </span>
          </OverlayTrigger>
        )}
      </Tag>
    </Style>
  );
}

export default Title;
