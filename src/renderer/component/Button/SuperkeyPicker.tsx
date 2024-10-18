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

import React, { useState } from "react";
import Styled from "styled-components";

import { SuperkeyPickerProps } from "@Renderer/types/superkeys";
import ListModifier from "@Renderer/components/molecules/ListModifiers/ListModifiers";
import Heading from "@Renderer/components/atoms/Heading";
import { IconClose } from "@Renderer/components/atoms/icons";

const Style = Styled.div`
.superkeyAction {
    display: flex;
    flex-wrap: wrap;
    flex-shrink: 1;
    flex-flow: column;
    align-items: start;
    height: 100%;
    color: ${({ theme }) => theme.styles.superkeyAction.color};
    padding: 24px 16px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.styles.superkeyAction.background};
    &.active {
        background-color: ${({ theme }) => theme.styles.superkeyAction.backgroundActive};
    }
    h5 {
        color: ${({ theme }) => theme.styles.superkeyAction.titleColor};
        font-weight: 700;
        font-size: 13px;
        margin-top: 12px;
        letter-spacing: 0.04em;
    }
    .description {
        color: ${({ theme }) => theme.styles.superkeyAction.descriptionColor};
        margin-bottom: 8px;
        font-weight: 395;
        font-size: 14px;
        flex-shrink: 1;
        align-self: self-start;

    }
    .superkeyTitle {
        flex-shrink: 1;
        margin-bottom: 8px;
        align-self: self-start;
        &.single {
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            h5 {
                margin: 0 0 0 8px;
            }
        }
    }
    .superkeyButtonWrapper {
        position: relative;
        margin-top: auto;
        &:hover {
            .superkeyDeleteButton {
                opacity: 1;
            }
        }
    }
    .superkeyDeleteButton {
        width: 24px;
        height: 24px;
        background-color: ${({ theme }) => theme.colors.brandPrimary};
        border-radius: 4px;
        color: #fff;
        position: absolute;
        text-align: center;
        line-height: 22px;
        top: 4px;
        right: -10px;
        transition: 300ms opacity ease-in-out;
        opacity: 0;
        &:hover {
            cursor: pointer;
        }
    }
    .listModifiersTags {
      position: absolute;
      top: 48px;
      left: 10px;
      .labelModifier {
        padding: 2px 6px;
        font-weight: 600;
        font-size: 10px;
      }
    }
}
.superkeyButton {
    width: 124px;
    background: ${({ theme }) => theme.styles.superkeyButton.backgroundColor};
    border: ${({ theme }) => theme.styles.superkeyButton.border};
    box-shadow: ${({ theme }) => theme.styles.superkeyButton.boxShadow};
    border-radius: 4px;
    padding: 1px 3px 6px 3px;
    margin-top: 16px;

    transition-property: box-shadow, border;
    transition: 300ms ease-in-out;

    font-weight: 600;
    font-size: 12px;
    letter-spacing: -0.03em;
    line-height: 15px;
    .superkeyButtonInner {
        height: 50px;
        margin-top: -1px;
        padding: 8px;
        background: ${({ theme }) => theme.styles.superkeyButton.backgroundColorInner};
        box-shadow: ${({ theme }) => theme.styles.superkeyButton.boxShadowInner};
        border-radius: 4px;
        color: ${({ theme }) => theme.styles.superkeyButton.colorInner};
        transition-property: box-shadow, border;
    }

    &:hover {
        background: ${({ theme }) => theme.styles.superkeyButton.backgroundColorHover};
        border: 2px solid rgba(255, 255, 255, 0.8);
        box-shadow: ${({ theme }) => theme.styles.superkeyButton.boxShadowHover};
        cursor: pointer;
        .superkeyButtonInner {
            background: ${({ theme }) => theme.styles.superkeyButton.backgroundColorInnerActive};
            box-sizing: border-box;
            box-shadow: 0px 4px 24px rgba(108, 92, 231, 0.65), 0px 0px 0px 2px inset rgba(255, 255, 255, 0.1);
        }
    }
}
.active {
    .superkeyButton {
        background: ${({ theme }) => theme.styles.superkeyButton.backgroundColorActive};
        border: 2px solid rgba(255, 255, 255, 0.6);
        .superkeyButtonInner {
            background: ${({ theme }) => theme.styles.superkeyButton.backgroundColorInnerActive};
            box-shadow: 0px 4px 12px rgba(108, 92, 231, 0.1), 0px 0px 0px 2px inset rgba(255, 255, 255, 0.1);
        }
    }
}

`;

function SuperkeyPicker(props: SuperkeyPickerProps) {
  const {
    selected,
    onClick,
    index,
    icon,
    title,
    elementActive,
    superkeys,
    macros,
    keymapDB,
    updateAction,
    variant = "regular",
  } = props;
  const [controlDeleteButton, setControlDeleteButton] = React.useState(false);
  const [keyContent, setKeyContent] = useState<string | JSX.Element>("Loading...");
  const action = superkeys[selected] === undefined ? 0 : superkeys[selected].actions[index];

  React.useEffect(() => {
    if (superkeys[selected] === undefined) {
      setControlDeleteButton(false);
      setKeyContent(keymapDB.parse(0).label);
      return;
    }
    let aux;
    if (superkeys[selected].actions[index] === 1) {
      aux = keymapDB.parse(0);
    } else {
      aux = keymapDB.parse(superkeys[selected].actions[index]);
    }
    // setKeyContent(aux.label);
    if (superkeys[selected].actions[index]) {
      setControlDeleteButton(true);
    } else {
      setControlDeleteButton(false);
    }

    if (aux.extraLabel === "MACRO") {
      const macroID = superkeys[selected].actions[index] - 53852;
      // console.log("checking macroID", macroID);
      if (macros.length > macroID && macros[macroID]?.name?.substr(0, 5) !== "") {
        setKeyContent((aux.label = macros[macroID]?.name?.substr(0, 5).toLowerCase()));
        return;
      }
      setKeyContent(`${aux.extraLabel} ${aux.label}`);
      return;
    }
    if (React.isValidElement(aux.label) || React.isValidElement(aux.extraLabel)) {
      setKeyContent(
        aux.extraLabel !== undefined && aux.extraLabel !== "" ? (
          <>
            {aux.extraLabel}
            <br />
            {aux.label}
          </>
        ) : (
          aux.label
        ),
      );
      return;
    }
    if (aux.label) {
      setKeyContent(
        aux.extraLabel !== undefined && !(aux.extraLabel as string).includes("+") ? `${aux.extraLabel} ${aux.label}` : aux.label,
      );
    }
  }, [index, keymapDB, macros, selected, superkeys, action]);

  if (superkeys === null) return null;
  return (
    <Style>
      <div className={`superkeyAction ${elementActive ? "active" : ""} ${variant === "subtle" ? "!py-2" : ""}`}>
        <div className="superkeyTitle single">
          {variant === "regular" && icon}
          <Heading headingLevel={5} renderAs="h5" className={`${variant === "subtle" ? "my-0 !text-2xxs" : ""}`}>
            {title}
          </Heading>
        </div>
        <div className="superkeyButtonWrapper">
          {controlDeleteButton && variant === "regular" && (
            // TODO: Div with click should not exist, use Button instead!!
            <div className="superkeyDeleteButton" aria-hidden="true" onClick={() => updateAction(index, 0)}>
              <IconClose />
            </div>
          )}
          {/* TODO: Div with click should not exist, use Button instead!! */}
          <div
            className={`superkeyButton ${variant === "subtle" ? "!mt-0 pointer-events-none" : ""}`}
            aria-hidden="true"
            onClick={() => onClick(index)}
          >
            <div className="superkeyButtonInner">{keyContent}</div>
            {superkeys[selected] !== undefined ? <ListModifier keyCode={superkeys[selected].actions[index]} /> : ""}
          </div>
        </div>
      </div>
    </Style>
  );
}

export default SuperkeyPicker;
