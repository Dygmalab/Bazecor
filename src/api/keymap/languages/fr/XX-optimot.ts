/* Bazecor keymap library
 * Copyright (C) 2019  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Is an Array of objects of values that have to be modified.
 */
import { withModifiers, ModifierCodes } from "../../db/utils";
import { BaseKeycodeTableType, KeymapCodeTableType } from "../../types";

const symbols: KeymapCodeTableType[] = [
  {
    code: 53,
    labels: {
      primary: "$",
    },
  },
  {
    code: 30,
    labels: {
      primary: "«",
    },
  },
  {
    code: 31,
    labels: {
      primary: "»",
    },
  },
  {
    code: 32,
    labels: {
      primary: '"',
    },
  },
  {
    code: 33,
    labels: {
      primary: "-",
    },
  },
  {
    code: 34,
    labels: {
      primary: "+",
    },
  },
  {
    code: 35,
    labels: {
      primary: "*",
    },
  },
  {
    code: 36,
    labels: {
      primary: "/",
    },
  },
  {
    code: 37,
    labels: {
      primary: "=",
    },
  },
  {
    code: 38,
    labels: {
      primary: "(",
    },
  },
  {
    code: 39,
    labels: {
      primary: ")",
    },
  },
  {
    code: 45,
    labels: {
      primary: "@",
    },
  },
  {
    code: 46,
    labels: {
      primary: "#",
    },
  },
];

const frXXoptimotLetters: KeymapCodeTableType[] = [
  // First row
  {
    code: 20,
    labels: {
      primary: "à",
    },
  },
  {
    code: 26,
    labels: {
      primary: "j",
    },
  },
  {
    code: 8,
    labels: {
      primary: "o",
    },
  },
  {
    code: 21,
    labels: {
      primary: "é",
    },
  },
  {
    code: 23,
    labels: {
      primary: "b",
    },
  },
  {
    code: 28,
    labels: {
      primary: "f",
    },
  },
  {
    code: 24,
    labels: {
      primary: "d",
    },
  },
  {
    code: 12,
    labels: {
      primary: "l",
    },
  },
  {
    code: 18,
    labels: {
      primary: "'",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 19,
    labels: {
      primary: "q",
    },
  },
  {
    code: 47,
    labels: {
      primary: "x",
    },
    newGroupName: "Letters",
  },
  {
    code: 48,
    labels: {
      primary: "z",
    },
    newGroupName: "Letters",
  },
  // Second row
  {
    code: 4,
    labels: {
      primary: "a",
    },
  },
  {
    code: 22,
    labels: {
      primary: "i",
    },
  },
  {
    code: 7,
    labels: {
      primary: "e",
    },
  },
  {
    code: 9,
    labels: {
      primary: "u",
    },
  },
  {
    code: 10,
    labels: {
      primary: ",",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 11,
    labels: {
      primary: "p",
    },
  },
  {
    code: 13,
    labels: {
      primary: "t",
    },
  },
  {
    code: 14,
    labels: {
      primary: "s",
    },
  },
  {
    code: 15,
    labels: {
      primary: "r",
    },
  },
  {
    code: 51,
    labels: {
      primary: "n",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "^",
    },
    newGroupName: "Letters",
  },
  {
    code: 49,
    labels: {
      primary: "ç",
    },
    newGroupName: "Letters",
  },
  // Third row
  {
    code: 100,
    labels: {
      primary: "¨",
    },
  },
  {
    code: 29,
    labels: {
      primary: "k",
    },
  },
  {
    code: 27,
    labels: {
      primary: "y",
    },
  },
  {
    code: 6,
    labels: {
      primary: "è",
    },
    newGroupName: "Letters",
  },
  {
    code: 25,
    labels: {
      primary: ".",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 5,
    labels: {
      primary: "w",
    },
  },
  {
    code: 17,
    labels: {
      primary: "g",
    },
    newGroupName: "Letters",
  },
  {
    code: 16,
    labels: {
      primary: "c",
    },
  },
  {
    code: 54,
    labels: {
      primary: "m",
    },
    newGroupName: "Letters",
  },
  {
    code: 55,
    labels: {
      primary: "h",
    },
    newGroupName: "Letters",
  },
  {
    code: 56,
    labels: {
      primary: "v",
    },
    newGroupName: "Letters",
  },
];

const altGRfrXXoptimot: BaseKeycodeTableType = {
  groupName: "AltCtrl French",
  keys: [
    // Numbers row + AltGr
    {
      code: ModifierCodes.ALTGR + 53,
      labels: {
        primary: "¤",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 30,
      labels: {
        primary: "“",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 31,
      labels: {
        primary: "”",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 32,
      labels: {
        primary: "„",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 33,
      labels: {
        primary: "‑",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 34,
      labels: {
        primary: "±",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 35,
      labels: {
        primary: "×",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 36,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 37,
      labels: {
        primary: "≠",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 38,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 39,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 45,
      labels: {
        primary: "−",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 46,
      labels: {
        primary: "°",
      },
      alt: true,
    },
    // First row
    {
      code: ModifierCodes.ALTGR + 20,
      labels: {
        primary: "<",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 26,
      labels: {
        primary: ">",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 8,
      labels: {
        primary: "œ",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 21,
      labels: {
        primary: "″",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 23,
      labels: {
        primary: "—",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 28,
      labels: {
        primary: "‘",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 24,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 12,
      labels: {
        primary: "}",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 18,
      labels: {
        primary: "’",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 19,
      labels: {
        primary: "°",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 47,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 48,
      labels: {
        primary: "➼",
      },
      alt: true,
    },
    // Second row
    {
      code: ModifierCodes.ALTGR + 4,
      labels: {
        primary: "æ",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 22,
      labels: {
        primary: "₂",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 7,
      labels: {
        primary: "²",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 9,
      labels: {
        primary: "ù",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 10,
      labels: {
        primary: "–",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR + 11,
      labels: {
        primary: "`",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR + 13,
      labels: {
        primary: "&",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 14,
      labels: {
        primary: "∞",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 15,
      labels: {
        primary: "ɾ",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 51,
      labels: {
        primary: "∼",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR + 52,
      labels: {
        primary: "¨",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR + 49,
      labels: {
        primary: " ̛",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    // Third row
    {
      code: ModifierCodes.ALTGR + 100,
      labels: {
        primary: "‽",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 27,
      labels: {
        primary: "˙",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 6,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 25,
      labels: {
        primary: "…",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 5,
      labels: {
        primary: "•",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 17,
      labels: {
        primary: "µ",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.ALTGR + 16,
      labels: {
        primary: "̦",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR + 54,
      labels: {
        primary: "¯",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.ALTGR + 55,
      labels: {
        primary: "˘̆",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.ALTGR + 56,
      labels: {
        primary: "˰",
      },
      alt: true,
      newGroupName: "Letters",
    },
  ],
};

const shiftedSymbols: BaseKeycodeTableType = {
  groupName: "Shifted French",
  keys: [
    {
      code: ModifierCodes.SHIFT + 53,
      labels: {
        primary: "€",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 30,
      labels: {
        primary: "1",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 31,
      labels: {
        primary: "2",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 32,
      labels: {
        primary: "3",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 33,
      labels: {
        primary: "4",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 34,
      labels: {
        primary: "5",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 35,
      labels: {
        primary: "6",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 36,
      labels: {
        primary: "7",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 37,
      labels: {
        primary: "8",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 38,
      labels: {
        primary: "9",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 39,
      labels: {
        primary: "0",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 45,
      labels: {
        primary: "_",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 46,
      labels: {
        primary: "%",
      },
      alt: true,
    },
    // First row
    {
      code: ModifierCodes.SHIFT + 20,
      labels: {
        primary: "À",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 26,
      labels: {
        primary: "J",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 8,
      labels: {
        primary: "O",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 21,
      labels: {
        primary: "É",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 23,
      labels: {
        primary: "B",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 28,
      labels: {
        primary: "F",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 24,
      labels: {
        primary: "D",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 12,
      labels: {
        primary: "L",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 18,
      labels: {
        primary: "?",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.SHIFT + 19,
      labels: {
        primary: "Q",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 47,
      labels: {
        primary: "X",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 48,
      labels: {
        primary: "Z",
      },
      alt: true,
      newGroupName: "Letters",
    },
    // Second row
    {
      code: ModifierCodes.SHIFT + 4,
      labels: {
        primary: "A",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 22,
      labels: {
        primary: "I",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 7,
      labels: {
        primary: "E",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 9,
      labels: {
        primary: "U",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 10,
      labels: {
        primary: ";",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.SHIFT + 11,
      labels: {
        primary: "P",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 13,
      labels: {
        primary: "T",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 14,
      labels: {
        primary: "S",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 15,
      labels: {
        primary: "R",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 51,
      labels: {
        primary: "N",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 52,
      labels: {
        primary: "!",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 49,
      labels: {
        primary: "Ç",
      },
      alt: true,
      newGroupName: "Letters",
    },
    // Third row
    {
      code: ModifierCodes.SHIFT + 100,
      labels: {
        primary: "ø",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 29,
      labels: {
        primary: "K",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 27,
      labels: {
        primary: "Y",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 6,
      labels: {
        primary: "È",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 25,
      labels: {
        primary: ":",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.SHIFT + 5,
      labels: {
        primary: "W",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 17,
      labels: {
        primary: "G",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 16,
      labels: {
        primary: "C",
      },
      alt: true,
    },
    {
      code: ModifierCodes.SHIFT + 54,
      labels: {
        primary: "M",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 55,
      labels: {
        primary: "H",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.SHIFT + 56,
      labels: {
        primary: "V",
      },
      alt: true,
      newGroupName: "Letters",
    },
  ],
};

const tableAGrS: BaseKeycodeTableType = {
  groupName: "AltGrShift French",
  keys: [
    {
      code: ModifierCodes.ALTGR_SHIFT + 53,
      labels: {
        primary: "©",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 30,
      labels: {
        primary: "¼",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 31,
      labels: {
        primary: "½",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 32,
      labels: {
        primary: "¾",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 33,
      labels: {
        primary: "⅓",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 34,
      labels: {
        primary: "⅔",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 35,
      labels: {
        primary: "✻",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 36,
      labels: {
        primary: "÷",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 37,
      labels: {
        primary: "≈",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 38,
      labels: {
        primary: "′",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 39,
      labels: {
        primary: "″",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 45,
      labels: {
        primary: "_",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 46,
      labels: {
        primary: "º",
      },
      alt: true,
    },
    // First row
    {
      code: ModifierCodes.ALTGR_SHIFT + 20,
      labels: {
        primary: "⩽",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 26,
      labels: {
        primary: "⩾",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 8,
      labels: {
        primary: "Œ",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 21,
      labels: {
        primary: "ж",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 23,
      labels: {
        primary: "❏",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 28,
      labels: {
        primary: "✦",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 24,
      labels: {
        primary: "†",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 12,
      labels: {
        primary: "‡",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 18,
      labels: {
        primary: "¿",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 19,
      labels: {
        primary: "⸮",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 47,
      labels: {
        primary: "®",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 48,
      labels: {
        primary: "™",
      },
      alt: true,
    },
    // Second row
    {
      code: ModifierCodes.ALTGR_SHIFT + 4,
      labels: {
        primary: "Æ",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 22,
      labels: {
        primary: "§",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 7,
      labels: {
        primary: "¶",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 9,
      labels: {
        primary: "Ù",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 10,
      labels: {
        primary: "✓",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 11,
      labels: {
        primary: "★",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 13,
      labels: {
        primary: "⬅",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 14,
      labels: {
        primary: "⬇",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 15,
      labels: {
        primary: "⬆",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 51,
      labels: {
        primary: "⮕",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 52,
      labels: {
        primary: "¡",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 49,
      labels: {
        primary: "🄯",
      },
      alt: true,
    },
    // Third row
    {
      code: ModifierCodes.ALTGR_SHIFT + 100,
      labels: {
        primary: "Ø",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 29,
      labels: {
        primary: "⎈",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 27,
      labels: {
        primary: "⌥",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 6,
      labels: {
        primary: "⌘",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 25,
      labels: {
        primary: "·",
      },
      alt: true,
      newGroupName: "Punctuation",
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 5,
      labels: {
        primary: "✗",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 17,
      labels: {
        primary: "✣",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 16,
      labels: {
        primary: "♠",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 54,
      labels: {
        primary: "♥",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 55,
      labels: {
        primary: "♦",
      },
      alt: true,
    },
    {
      code: ModifierCodes.ALTGR_SHIFT + 56,
      labels: {
        primary: "♣",
      },
      alt: true,
    },
  ],
};

const frXXoptimot = frXXoptimotLetters.concat(symbols);

const table: BaseKeycodeTableType = { keys: frXXoptimot, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: frXXoptimotLetters, groupName: "" };

const frXXoptimotCtrlTable = withModifiers(table, "Control +", "C+", 256);
const frXXoptimotLAltTable = withModifiers(table, "Alt +", "A+", 512);
const frXXoptimotRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const frXXoptimotShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const frXXoptimotGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double
const frXXoptimotCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const frXXoptimotCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const frXXoptimotCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const frXXoptimotCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const frXXoptimotAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const frXXoptimotASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const frXXoptimotAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const frXXoptimotAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const frXXoptimotAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const frXXoptimotSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple
const frXXoptimotCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const frXXoptimotCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const frXXoptimotCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const frXXoptimotCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const frXXoptimotCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const frXXoptimotCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const frXXoptimotAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const frXXoptimotAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const frXXoptimotASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const frXXoptimotAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad
const frXXoptimotCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const frXXoptimotCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const frXXoptimotCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const frXXoptimotAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const frXXoptimotAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

const DualUseCtrlTable = withModifiers(table, "Control /", "CTRL/", 49169);
const DualUseShiftTable = withModifiers(table, "Shift /", "SHIFT/", 49425);
const DualUseAltTable = withModifiers(table, "Alt /", "ALT/", 49681);
const DualUseGuiTable = withModifiers(table, "Os /", "OS/", 49937);
const DualUseAltGrTable = withModifiers(table, "AltGr /", "ALTGR/", 50705);
const DualUseLayer1Tables = withModifiers(table, "Layer #1 /", "L#1/", 51218);
const DualUseLayer2Tables = withModifiers(table, "Layer #2 /", "L#2/", 51474);
const DualUseLayer3Tables = withModifiers(table, "Layer #3 /", "L#3/", 51730);
const DualUseLayer4Tables = withModifiers(table, "Layer #4 /", "L#4/", 51986);
const DualUseLayer5Tables = withModifiers(table, "Layer #5 /", "L#5/", 52242);
const DualUseLayer6Tables = withModifiers(table, "Layer #6 /", "L#6/", 52498);
const DualUseLayer7Tables = withModifiers(table, "Layer #7 /", "L#7/", 52754);
const DualUseLayer8Tables = withModifiers(table, "Layer #8 /", "L#8/", 53010);

const frXXoptimotModifiedTables = [
  shiftedSymbols,
  frXXoptimotCtrlTable,
  frXXoptimotLAltTable,
  frXXoptimotRAltTable,
  frXXoptimotShiftTable,
  frXXoptimotGuiTable,
  frXXoptimotCATable,
  altGRfrXXoptimot,
  frXXoptimotCAGrTable,
  frXXoptimotCSTable,
  frXXoptimotCGTable,
  frXXoptimotASTable,
  frXXoptimotAGTable,
  frXXoptimotAAGrTable,
  frXXoptimotSGTable,
  frXXoptimotAGrSTable,
  frXXoptimotAGrGTable,
  frXXoptimotCAAGTable,
  frXXoptimotCASTable,
  frXXoptimotCAGTable,
  frXXoptimotCAGSTable,
  frXXoptimotCAGGTable,
  frXXoptimotCSGTable,
  frXXoptimotAAGSTable,
  frXXoptimotAAGGTable,
  frXXoptimotASGTable,
  frXXoptimotAGSGTable,
  frXXoptimotCAAGrSTable,
  frXXoptimotCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  frXXoptimotCAGrSGTable,
  frXXoptimotAAGrSGTable,
  frXXoptimotAllModTable,
  DualUseCtrlTable,
  DualUseShiftTable,
  DualUseAltTable,
  DualUseGuiTable,
  DualUseAltGrTable,
  DualUseLayer1Tables,
  DualUseLayer2Tables,
  DualUseLayer3Tables,
  DualUseLayer4Tables,
  DualUseLayer5Tables,
  DualUseLayer6Tables,
  DualUseLayer7Tables,
  DualUseLayer8Tables,
];

export { frXXoptimot, frXXoptimotModifiedTables };
