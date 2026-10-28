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

import SemVer from "semver";
import versionRules from "../../versionRules.json";
import { version as bazecorVersion } from "../../../package.json";

type ProductVersions = Record<string, string>;
export type VersionFeature = keyof typeof versionRules.features;

// Prerelease tags are dropped so a 1.12.0 beta build already gets the 1.12.0 rules
const coerced = (text: string) => SemVer.coerce(text)?.version;

const activeDropdownRanges = (): ProductVersions => {
  const current = coerced(bazecorVersion) ?? "0.0.0";
  const rule = versionRules.firmwareDropdown.rules
    .filter(r => SemVer.lte(r.fromBazecor, current))
    .sort((a, b) => SemVer.rcompare(a.fromBazecor, b.fromBazecor))[0];
  return (rule?.ranges ?? {}) as ProductVersions;
};

/** True when a firmware release should be listed in the FW update dropdown for `product`. */
export const isFirmwareInDropdown = (product: string, fwVersion: string): boolean => {
  const range = activeDropdownRanges()[product];
  if (range === undefined) return true;
  return SemVer.satisfies(fwVersion ?? "", range, { includePrerelease: true });
};

/** True when the firmware reported by the device (e.g. "v2.2.0-beta1 ...") supports `feature` on `product`. */
export const hasFirmwareFeature = (feature: VersionFeature, product: string, fwVersion: string): boolean => {
  const min = (versionRules.features[feature].minFirmware as ProductVersions)[product];
  const current = coerced(fwVersion);
  if (min === undefined || current === undefined) return false;
  return SemVer.gte(current, min);
};
