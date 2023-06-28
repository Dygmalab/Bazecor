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
import i18n from "../../i18n";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import LightAccent from "../../../../static/dark/light-accent--lg.png";

const Style = Styled.div`
width: 100%;
.disabled{
    opacity: 0.5;
    
}
.disabled.menuLink svg {
  color: ${({ theme }) => theme.styles.navbar.menuLink.color};
}
.menuLink {
    width: 100%;
    aspect-ratio: 1;

    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    position: relative;
    text-align: center;
    transition: 250ms color ease-in-out;
    text-decoration: none;
    color: ${({ theme }) => theme.styles.navbar.menuLink.color};
    svg {
        color: ${({ theme }) => theme.styles.navbar.menuLink.svgColor};
    }
    .menuLinkText {
        font-size: 12px;
        font-weight: 600;
        flex: 0 0 100%;
    }
    .badge {
        position: absolute;
        right: 2px;
        top: 2px;
        font-size: 9px;
        font-weight: 700;
        padding: 4px 6px;
        z-index: 3;
        &.badge-primary {
            background: ${({ theme }) => theme.colors.brandPrimary};
            border-radius: 16px;
        }
    }
    &:hover {
        color: ${({ theme }) => theme.styles.navbar.menuLink.colorHover};
    }
    &.active {
        color: ${({ theme }) => theme.styles.navbar.menuLink.colorActive};
    }
    &:hover svg {
        color: ${({ theme }) => theme.styles.navbar.menuLink.svgColorHover}; 
    }
    &.active svg {
        color: ${({ theme }) => theme.styles.navbar.menuLink.svgColorActive}; 
    }
}
.menuLink:before {
    content: '';
    position: absolute;
    right: -15px;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    width: 3px;
    height: 42px;
    background: linear-gradient(180deg, #FE007C 0%, #6B14F9 100%);
    border-radius: 0px 3px 3px 0px;     
    opacity: 0;
    transition: 250ms opacity ease-in-out;
    z-index: 2;
}
.menuLink:after {
    content: '';
    position: absolute;
    right: -12px;
    top: 50%;
    transform: translate3d(0, -50%, 0);
    width: 32px;
    height: 96px;
    background-image: url(${LightAccent});
    opacity: 0;
    transition: 250ms opacity ease-in-out;
    z-index: 1;
}
.menuLink:hover {   
    text-decoration: none;
    .menuLinkInner:before {
        opacity: 1;
    }
}   
.menuLink:hover,
.menuLink.active {
    .menuLinkInner:before {
        opacity: 0.8;
    }
}
.menuLink.active:before {
    opacity: 1; 
}
.menuLink.active:after {
    opacity: ${({ theme }) => theme.styles.navbar.menuLink.lightingOpacity};; 
}
.menuLinkInner {
    position: relative;
    padding: 8px 6px;
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    svg,
    .menuLinkText {
        position: relative;
        z-index: 2;
    }
    svg {
      flex: 0 0 42px;
    }
    .menuLinkText {
      margin-bottom: auto;
    }
}
.menuLinkInner:before {
    position: absolute;
    opacity: 0;
    transition: 250ms opacity ease-in-out;
    border-radius: 6px;
    width: 100%;
    aspect-ratio: 1;
    left: 0;
    top 0;
    content: '';
    z-index: 1;
    background: ${({ theme }) => theme.styles.navbar.menuLink.gradient};
}
@media screen and (max-width: 999px) {
  .menuLinkText {
      display: none;
  }
  .menuLink:after {
      right: -14px;
  }
  .menuLink:before {
      right: -17px;
      height: 36px;
  }
  .menuLinkInner {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 0;
  }
  .menuLinkInner svg {
      transform: scale(1);
      flex: 0 0 26px;
  }
  .menuLink .badge {
      right: -18px;
  }
}
@media screen and (max-width: 860px) {
  .menuLinkText {
      display: none;
  }
  .menuLink:before {
      right: -15px;
      height: 26px;
  }
  .menuLinkInner {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 0;
  }
  .menuLinkInner svg {
    transform: scale(1);
    flex: 0 0 30px;
  }
  .menuLink .badge {
      right: -18px;
  }
}
@media screen and (max-height: 870px) {
  .menuLinkText {
      display: none;
  }
  .menuLink:before {
      right: -15px;
      height: 36px;
  }
  .menuLinkInner {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 0;
  }
  .menuLinkInner svg {
    transform: scale(1);
    flex: 0 0 30px;
  }
  .menuLink .badge {
      right: -18px;
  }
}
@media screen and (max-height: 670px) {
  .menuLink:before {
    height: 26px;
  }
  .menuLink:after {
    right: -12px;
  }
  .menuLinkInner svg {
    transform: scale(1);
    flex: 0 0 24px;
  }
}
`;
//className={`icon-image ${selected ? "select" : ""}`}
const NavigationButton = ({ selected, onClick, showNotif, notifText, buttonText, icoSVG, disabled }) => {
  return (
    <Style>
      <OverlayTrigger
        placement={`right`}
        overlay={
          <Tooltip className={`tooltipMenu`}>
            <div dangerouslySetInnerHTML={{ __html: buttonText }} />
          </Tooltip>
        }
      >
        <div className={`menuLink ${selected ? "active" : ""} ${disabled ? "disabled" : ""}`}>
          <div className={"menuLinkInner"}>
            {icoSVG}
            {showNotif ? (
              notifText ? (
                <div className="badge badge-primary">{notifText}</div>
              ) : (
                <div className="badge badge-primary">{i18n.app.menu.badgeNew}</div>
              )
            ) : (
              ""
            )}
            <div className={"menuLinkText"} dangerouslySetInnerHTML={{ __html: buttonText }} />
          </div>
        </div>
      </OverlayTrigger>
    </Style>
  );
};

export default NavigationButton;
