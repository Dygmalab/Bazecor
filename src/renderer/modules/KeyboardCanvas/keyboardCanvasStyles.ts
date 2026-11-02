/* Bazecor
 * Copyright (C) 2026  DygmaLab SE.
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

import { css } from "styled-components";

import customCursor from "@Assets/base/cursorBucket.png";
import { comboBadgeBaseStyles } from "./comboBadges";

/**
 * Every rule the device SVGs need in order to render the way they do in the
 * Layout Editor: key fills, label typography, modifier chips, focus shadows,
 * underglow strips, and the per-board label rotations.
 *
 * The boards themselves emit bare class names -- `keyItem`, `keyBase`,
 * `keyContentLabel` -- and carry no styling of their own, so a view that drops
 * one in without this block gets an unstyled keyboard. It lives here rather
 * than in a single view so the Layout Editor and the Combo Editor cannot drift
 * apart: both interpolate the same fragment.
 *
 * Wrap the board in `.LayerHolder` and give it `raiseKeyboard layer` plus
 * `svg-<device name>` to match the Layout Editor exactly.
 */
// eslint-disable-next-line import/prefer-default-export
export const keyboardCanvasStyles = css`
  .LayerHolder {
    display: flex;
    flex: 0 0 100%;
    margin: 0 auto;
    min-width: 680px;
    // max-width: 1640px;
    svg {
      width: 100%;
    }
  }
  .standarViewMode .LayerHolder {
    margin-top: 24px;
  }
  .raiseKeyboard {
    overflow: visible;
    margin: 0 auto;
    max-width: 100%;
    // height: auto;
    flex: 1;
    // max-height: 65vh;
    * {
      -webkit-backface-visibility: hidden;
      // -webkit-transform: translateZ(0) scale(1.0, 1.0);
      //transform: translateZ(0);
    }
  }

  .standarViewMode .raiseKeyboard {
    margin: 0 auto;
    margin-top: 24px;
    max-height: calc(100vh - 250px);
  }
  .singleViewMode.color .raiseKeyboard {
    margin: 0 auto;
    margin-top: 24px;
    max-height: calc(100vh - 300px);
  }
  .singleViewMode.keyboard .raiseKeyboard {
    margin: 0 auto;
    // max-height: 44vh;
    height: 100%;
    svg {
      height: 100%;
    }
  }
  .singleViewMode.keyboard .raiseKeyboard.svg-defy {
    // max-height: 49vh;
  }
  .keyboard-editor.keyboard .dygma-keyboard-editor.editor {
    height: calc(100vh - 370px - 124px);
  }
  .keyboard-editor.keyboard .dygma-keyboard-editor.editor .LayerHolder {
    height: 100%;
  }

  .NeuronLine {
    stroke: ${({ theme }) => theme.styles.neuronStatus.lineStrokeColor};
  }
  #neuronWrapper {
    &.keyOnFocus .keyOpacity {
      stroke-opacity: 0.4;
    }
    &.keyOnHold .keyOpacity {
      stroke-opacity: 0.2;
    }
    .neuronLights:hover {
      cursor: pointer;
    }
  }

  .keyBase {
    fill: ${({ theme }) => theme.styles.raiseKeyboard.keyBase};
  }
  .keyColorOpacity {
    fill-opacity: ${({ theme }) => theme.styles.raiseKeyboard.keyColorOpacity};
  }
  .keyItem {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.03em;
    .keyContentLabel {
      height: inherit;
      display: flex;
      align-items: center;
      padding: 3px;
      flex-wrap: wrap;
      line-height: 1.1em;
      position: relative;
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0) scale(1, 1);
      transform: translateZ(0);
      * {
        -webkit-backface-visibility: hidden;
        -webkit-transform: translateZ(0) scale(1, 1);
        transform: translateZ(0);
      }
      ul {
        list-style: none;
        padding: 0;
        margin: 0;
        color: ${({ theme }) => theme.styles.raiseKeyboard.contentColor};
        li {
          overflow-wrap: break-word;
          word-wrap: break-word;
          hyphens: auto;
        }
      }
      .labelClass-withModifiers {
        margin-bottom: 8px;
      }
      .extraLabel {
        font-size: 9px;
        font-weight: 700;
        letter-spacing: 0.025em;
      }
      .hidden-extraLabel {
        display: none;
      }
      tspan {
        display: inline-block;
      }
    }
    tspan {
      text-anchor: start;
    }
    .shadowHover {
      //transition: all 300ms ease-in-out;
      filter: blur(16px);
      opacity: 0.2;
    }
    .shadowMiddle {
      filter: blur(18px);
      opacity: 0.4;
    }
    &.keyOnFocus {
      .baseShape {
        filter: drop-shadow(0px 4px 0px ${({ theme }) => theme.styles.raiseKeyboard.keyShadow});
      }
      .keyOpacityInternal {
        stroke-opacity: 0.7;
        stroke: ${({ theme }) => theme.styles.raiseKeyboard.keyOnFocusBorder};
      }
      .keyOpacity {
        stroke-opacity: 0.2;
        stroke: ${({ theme }) => theme.styles.raiseKeyboard.keyOnFocusBorder};
      }
      .shadowHover {
        filter: blur(16px);
        opacity: 0.6;
      }
      .keyAnimation {
        //animation: pulse-black 2s linear infinite;
      }
    }
    &:hover {
      cursor: pointer;
      .shadowHover {
        // filter: blur(16px);
        // opacity: 0.6;
      }
    }
  }
  .keyContentModifiers {
    .labelModifier {
      display: flex;
      flex-wrap: wrap;
      position: absolute;
      bottom: 6px;
      list-style: none;
      padding: 0;
      margin: 0;
      margin-left: 6px;
      margin-right: -1px;
      &.extraBottom {
        margin-left: 1px;
        li {
          margin-left: 1px;
          margin-right: 0;
        }
      }
      li {
        padding: 0px 3px;
        border-radius: 3px;

        display: inline-block;
        margin: 1px;

        font-size: 10px;
        font-weight: 600;
        letter-spacing: -0.03em;
        color: ${({ theme }) => theme.styles.raiseKeyboard.modifier.color};
        background: ${({ theme }) => theme.styles.raiseKeyboard.modifier.background};
        box-shadow: ${({ theme }) => theme.styles.raiseKeyboard.modifier.boxShadow};
      }
    }
  }
  .keyAnimation {
    stroke-opacity: 0;
    stroke-linecap: round;
  }
  // @keyframes pulse-black {
  //   from {
  //     stroke-opacity: 0;
  //   }
  //   to {
  //     stroke-opacity: 0.8;
  //   }
  // }
  .underGlowStrip {
    .underGlowStripStroke {
      stroke-opacity: 0.5;
    }
    .underGlowStripShadow {
      //transition: all 300ms ease-in-out;
      filter: blur(12px);
      opacity: 0.8;
    }
    &.keyOnFocus {
      // filter: drop-shadow(0px 1px 1px white);
      .underGlowStripShadow {
        filter: blur(4px);
        opacity: 1;
      }
      .underGlowStripStroke {
        stroke-opacity: 0.8;
        stroke: ${({ theme }) => theme.styles.raiseKeyboard.keyOnFocusBorder};
      }
    }
    &.clickAble:hover {
      cursor: pointer;
      .underGlowStripShadow {
        filter: blur(4px);
        opacity: 1;
      }
    }
  }
  .layoutEditor.color.colorSelected .keyItem:hover,
  .layoutEditor.color.colorSelected .underGlowStrip:hover {
    cursor:
      url(${customCursor}) 12 12,
      auto;
  }

  .defy-t2 .keyContentLabelRotate {
    transform: rotate(3deg) translate(1px, -1px);
  }
  .defy-t3 .keyContentLabelRotate {
    transform: rotate(10deg) translate(9px, -1px);
  }
  .defy-t4 .keyContentLabelRotate {
    transform: rotate(37deg) translate(26px, -18px);
  }
  .defy-t6 .keyContentLabelRotate {
    transform: rotate(5deg) translate(2px, -5px);
  }
  .defy-t7 .keyContentLabelRotate {
    transform: rotate(15deg) translate(12px, -5px);
  }
  .defy-t8 .keyContentLabelRotate {
    transform: rotate(54deg) translate(52px, -77px);
  }

  .defy-tR2 .keyContentLabelRotate {
    transform: rotate(-5deg) translate(5px, 1px);
  }

  .defy-tR2 .keyContentLabelRotate {
    transform: rotate(-5deg) translate(5px, 1px);
  }
  .defy-tR3 .keyContentLabelRotate {
    transform: rotate(-25deg) translate(-2px, 18px);
  }
  .defy-tR4 .keyContentLabelRotate {
    transform: rotate(-54deg) translate(-36px, 26px);
  }
  .defy-tR6 .keyContentLabelRotate {
    transform: rotate(-8deg) translate(4px, 4px);
  }
  .defy-tR7 .keyContentLabelRotate {
    transform: rotate(-46deg) translate(-24px, 24px);
  }
  .defy-tR8 .keyContentLabelRotate {
    transform: rotate(-60deg) translate(-47px, 8px);
  }
  .keyItem foreignObject {
    overflow: visible;
  }

  /* The "C1" chip. Only ever visible once a generated rule supplies its
   * content, so keys outside a combo pay nothing for it. */
  ${comboBadgeBaseStyles}
`;
