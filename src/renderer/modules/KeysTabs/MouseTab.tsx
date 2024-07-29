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
import log from "electron-log/renderer";
import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
// import MouseEventsReference from "@Renderer/components/atoms/MouseEventsReference";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { ButtonMouse } from "@Renderer/component/Button";

const Styles = Styled.div`
display: flex;
flex-wrap: wrap;
height: inherit;
h4 {
    font-size: 16px;
    flex: 0 0 100%;
    width: 100%;
    margin-top: 24px;
}
.callOut {
    width: 100%;
    flex: 0 0 100%;
}
.w100 {
    width: 100%;
    flex: 0 0 100%;
}
.description {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.macro.descriptionColor};
    flex: 0 0 100%;
    width: 100%;
}

.keysButtonsList {
    display: flex;
    flex-grow: 1;
    flex: 100%;
    margin-left: -4px;
    margin-right: -4px;
}

.buttonsRow {
    flex: 0 0 100%;
    display: grid;
    grid-template-columns: auto auto auto;
    grid-gap: 24px;
    .button-config {
        margin: 4px;
        padding-top: 12px;
        padding-bottom: 12px;
    }
    padding-bottom: 12px;
}
.clickButtons .keysButtonsList {
    max-width: 430px;
    flex-wrap: wrap;
    .button-config {
        width: 134px;
        text-align: center;
    }
}

.mouseButtons {
    width: 156px;
    height: 156px;
    border-radius: 50%;
    background:  ${({ theme }) => theme.styles.mouseButtons.background};
    position: relative;
    &.mouseButtonsWheel {
        &:before, &:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
        }
        &:before {
            border-radius: 50%;
            width: 52px;
            height: 52px;
            background:  ${({ theme }) => theme.styles.mouseButtons.backgroundWheelCircle};
            z-index: 2;
        }
        &:after {
            width: 28px;
            height: 70px;
            background-image:  url(${({ theme }) => theme.styles.mouseButtons.mouseWheel});
            z-index: 3;
        }
    }
}
@media screen and (max-width: 1200px) {
  .buttonsRow {
    grid-template-columns: 1fr 1fr;
    .clickButtons {
      grid-column: 1 / -1;
    }
  }
}

&.standardViewTab {
  .mouseWrapper {
    display: grid;
    //grid-template-columns: 1fr minmax(320px, 500px);
    grid-gap: 24px;
  }
  .buttonsRow {
    // grid-template-columns: 1fr 1fr;
    grid-template-columns: minmax(240px, 370px) auto auto;
    .clickButtons {
      //grid-column: 1 / -1;
    }
  }
}
`;

interface MouseTabProps {
  isStandardView: boolean;
  keyCode: any;
  actTab?: string;
  onAddSpecial: (event: any, value: number) => void;
}

function MouseTab({ isStandardView, keyCode, onAddSpecial, actTab = "standard" }: MouseTabProps) {
  // const [isHovering, setIsHovering] = React.useState(false);

  // function to handle button click event and to send data to props.onAddSpecial
  const handleClick = (event: any) => {
    onAddSpecial(event, 5);
    // setIsHovering(!isHovering);
  };

  // const handleLeaveAnimations = mouseEvent => {
  //   setIsHovering(true);
  //   log.info("MouseLeave", mouseEvent);
  // };
  console.log("actTab: ", actTab);

  return (
    <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsMouse`}>
      <div className="tabContentWrapper">
        {isStandardView ? (
          <>
            <Heading headingLevel={3} renderAs="h3">
              {i18n.editor.standardView.mouse.title}
            </Heading>
            <Callout size="sm" className="mt-4">
              {actTab === "super" ? (
                <p>Enhance your Superkey by adding mouse function click on it.</p>
              ) : (
                <p>{i18n.editor.standardView.mouse.callOut}</p>
              )}
            </Callout>
          </>
        ) : null}
        <div className="mouseWrapper">
          <div className={`buttonsRow ${actTab === "macro" ? "flex flex-col w-full gap-4" : "w-auto"}`}>
            <div className="clickButtons">
              <Heading headingLevel={4} renderAs="h4">
                {i18n.mouse.mouseClickTitle}
              </Heading>
              <p className="description">{i18n.mouse.mouseClickDescription}</p>
              <div className="grid gap-2 grid-cols-3 max-w-[460px] mt-2">
                <Button
                  onClick={() => handleClick(20545)}
                  selected={isStandardView ? keyCode === 20545 : false}
                  variant="config"
                  size="sm"
                >
                  {i18n.mouse.clickLeft}
                </Button>
                <Button
                  onClick={() => handleClick(20548)}
                  selected={isStandardView ? keyCode === 20548 : false}
                  variant="config"
                  size="sm"
                >
                  {i18n.mouse.clickMiddle}
                </Button>
                <Button
                  onClick={() => handleClick(20546)}
                  selected={isStandardView ? keyCode === 20546 : false}
                  variant="config"
                  size="sm"
                >
                  {i18n.mouse.clickRight}
                </Button>
                <Button
                  onClick={() => handleClick(20552)}
                  selected={isStandardView ? keyCode === 20552 : false}
                  variant="config"
                  size="sm"
                >
                  {i18n.mouse.clickBack}
                </Button>
                <Button
                  onClick={() => handleClick(20560)}
                  selected={isStandardView ? keyCode === 20560 : false}
                  variant="config"
                  size="sm"
                >
                  {i18n.mouse.clickForward}
                </Button>
              </div>
            </div>
            {actTab !== "super" ? (
              <div className="movementsAndWheels flex gap-4">
                <div className="movementButtons">
                  <Heading headingLevel={4} renderAs="h4">
                    {i18n.mouse.movementTitle}
                  </Heading>
                  <p className="description">{i18n.mouse.movementDescription}</p>
                  <div className="keysButtonsList mt-2">
                    <div className="mouseButtons mouseButtonsMovement">
                      <ButtonMouse
                        eventType="movement"
                        direction="up"
                        onClick={() => handleClick(20481)}
                        selected={isStandardView ? keyCode === 20481 : false}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="movement"
                        direction="right"
                        onClick={() => handleClick(20488)}
                        selected={isStandardView ? keyCode === 20488 : false}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="movement"
                        direction="down"
                        onClick={() => handleClick(20482)}
                        selected={isStandardView ? keyCode === 20482 : false}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="movement"
                        direction="left"
                        onClick={() => handleClick(20484)}
                        selected={isStandardView ? keyCode === 20484 : false}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="wheelButtons">
                  <Heading headingLevel={4} renderAs="h4">
                    {i18n.mouse.wheelTitle}
                  </Heading>
                  <p className="description">{i18n.mouse.wheelDescription}</p>
                  <div className="keysButtonsList">
                    <div className="mouseButtons mouseButtonsWheel mt-2">
                      <ButtonMouse
                        eventType="wheel"
                        direction="up"
                        onClick={() => handleClick(20497)}
                        selected={isStandardView ? keyCode === 20497 : false}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="wheel"
                        direction="right"
                        onClick={() => handleClick(20504)}
                        selected={isStandardView ? keyCode === 20504 : false}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="wheel"
                        direction="down"
                        onClick={() => handleClick(20498)}
                        selected={isStandardView ? keyCode === 20498 : false}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="wheel"
                        direction="left"
                        onClick={() => handleClick(20500)}
                        selected={isStandardView ? keyCode === 20500 : false}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Styles>
  );
}

export default MouseTab;
