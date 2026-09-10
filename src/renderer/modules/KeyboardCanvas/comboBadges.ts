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

import { ComboType } from "@Renderer/types/combos";
import { comboMembers } from "../../../api/parsers/combos";

/**
 * A "C1" chip in the top-right corner of every key that belongs to a combo.
 *
 * Done entirely in CSS rather than by adding a prop to the key component. The
 * device SVGs each spell out every key as an explicit `<Key />` call across
 * eight generated files, and `Key.tsx` itself branches over 25 different key
 * shapes -- threading a badge through all of that would mean touching every
 * one of them.
 *
 * Instead this hangs off two things the boards already give us for free:
 * `data-key-index` on each key group, and the `.keyContentLabel` div inside
 * its `<foreignObject>`. That div is real HTML, so unlike the surrounding SVG
 * it accepts a `::after` pseudo-element, and it is already `position:
 * relative`. One generated stylesheet therefore badges any key on any board.
 */

/** Static half of the badge: everything that does not depend on which combo. */
export const comboBadgeBaseStyles = `
.keyContentLabel::after {
  position: absolute;
  top: -3px;
  right: -3px;
  padding: 0 3px;
  border-radius: 3px;
  font-size: 8px;
  font-weight: 700;
  line-height: 12px;
  letter-spacing: 0.02em;
  color: #fff;
  background: #6b46f5;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.35);
  pointer-events: none;
}
`;

/**
 * The generated half: one rule per key that is in a combo.
 *
 * `scope` narrows the rules to one view's container so a badge cannot leak
 * into another keyboard rendered on the same page. Positions come straight
 * from the firmware blob, so a key that is in a combo the user has not saved
 * yet is not badged -- which is the honest thing to show.
 */
export const comboBadgeStyles = (combos: ComboType[], scope = ".layoutEditor"): string => {
  const rules: string[] = [];

  combos.forEach((combo, index) => {
    comboMembers(combo).forEach(position => {
      rules.push(`${scope} [data-key-index="${position}"] .keyContentLabel::after { content: "C${index + 1}"; }`);
    });
  });

  return rules.join("\n");
};
