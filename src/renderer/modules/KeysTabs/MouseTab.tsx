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

import React, { useMemo } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { ButtonMouse } from "@Renderer/component/Button";

const Styles = Styled.div`
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

`;

interface MouseTabProps {
  keyCode: any;
  actTab?: string;
  onAddSpecial: (event: any, value: number) => void;
  disabled?: boolean;
}

function MouseTab({ keyCode, onAddSpecial, actTab = "standard", disabled }: MouseTabProps) {
  // function to handle button click event and to send data to props.onAddSpecial
  const handleClick = (event: any) => {
    onAddSpecial(event, 5);
    // setIsHovering(!isHovering);
  };

  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);

  return (
    <Styles className={`flex flex-wrap h-[inherit] tabsMouse ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper w-full">
        <div className="mouseWrapper flex flex-wrap gap-4 py-4">
          <div className={`buttonsRow ${actTab === "macro" ? "flex flex-col w-full gap-4" : "w-auto"}`}>
            <div className="clickButtons">
              <Heading headingLevel={4} renderAs="h4" className="m-0 text-base">
                {i18n.mouse.mouseClickTitle}
              </Heading>
              <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                {i18n.mouse.mouseClickDescription}
              </p>
              <div className="flex flex-wrap gap-1 max-w-[460px] mt-2">
                <Button onClick={() => handleClick(20545)} selected={false} variant="config" size="sm" className="w-[114px]">
                  {i18n.mouse.clickLeft}
                </Button>
                <Button onClick={() => handleClick(20548)} selected={false} variant="config" size="sm" className="w-[114px]">
                  {i18n.mouse.clickMiddle}
                </Button>
                <Button variant="config" onClick={() => handleClick(20546)} selected={false} size="sm" className="w-[114px]">
                  {i18n.mouse.clickRight}
                </Button>
                <Button onClick={() => handleClick(20552)} selected={false} variant="config" size="sm" className="w-[114px]">
                  {i18n.mouse.clickBack}
                </Button>
                <Button onClick={() => handleClick(20560)} selected={false} variant="config" size="sm" className="w-[114px]">
                  {i18n.mouse.clickForward}
                </Button>
              </div>
            </div>
            {actTab !== "super" ? (
              <div className="movementsAndWheels flex gap-4">
                <div className="movementButtons">
                  <Heading headingLevel={4} renderAs="h4" className="m-0 text-base">
                    {i18n.mouse.movementTitle}
                  </Heading>
                  <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                    {i18n.mouse.movementDescription}
                  </p>
                  <div className="keysButtonsList mt-2">
                    <div className="mouseButtons mouseButtonsMovement">
                      <ButtonMouse
                        eventType="movement"
                        direction="up"
                        onClick={() => handleClick(20481)}
                        selected={KC === 20481}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="movement"
                        direction="right"
                        onClick={() => handleClick(20488)}
                        selected={KC === 20488}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="movement"
                        direction="down"
                        onClick={() => handleClick(20482)}
                        selected={KC === 20482}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="movement"
                        direction="left"
                        onClick={() => handleClick(20484)}
                        selected={KC === 20484}
                        disabled={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="wheelButtons">
                  <Heading headingLevel={4} renderAs="h4" className="m-0 text-base">
                    {i18n.mouse.wheelTitle}
                  </Heading>
                  <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                    {i18n.mouse.wheelDescription}
                  </p>
                  <div className="keysButtonsList">
                    <div className="mouseButtons mouseButtonsWheel mt-2">
                      <ButtonMouse
                        eventType="wheel"
                        direction="up"
                        onClick={() => handleClick(20497)}
                        selected={KC === 20497}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="wheel"
                        direction="right"
                        onClick={() => handleClick(20504)}
                        selected={KC === 20504}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="wheel"
                        direction="down"
                        onClick={() => handleClick(20498)}
                        selected={KC === 20498}
                        disabled={false}
                      />
                      <ButtonMouse
                        eventType="wheel"
                        direction="left"
                        onClick={() => handleClick(20500)}
                        selected={KC === 20500}
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
