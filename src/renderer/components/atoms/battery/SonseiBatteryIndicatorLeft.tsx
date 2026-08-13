/* Bazecor
 * Copyright (C) 2024  Dygmalab, Inc.
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

import { IconThunder } from "@Renderer/components/atoms/icons";

interface SonseiBatteryIndicatorLeftProps {
  batteryStatus: number;
  batteryHeight: number;
}

function SonseiBatteryIndicatorLeft({ batteryStatus, batteryHeight }: SonseiBatteryIndicatorLeftProps) {
  const maskHash = `mask-${Math.random().toString(36).substring(2, 15)}`;
  return (
    <svg
      width="400"
      height="127"
      viewBox="0 0 411 194"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="batterySide--svg"
    >
      <defs>
        <mask id={maskHash}>
          <rect x="0" y="0" width="411" height="194" fill="white" />
        </mask>
        <clipPath id={`clip-${maskHash}`}>
          <path d="M225.998 192H181.998C176.998 191.5 173.498 187.5 171.998 186C168.498 182.5 163.998 177 156.498 172.5C148.998 167 137.498 162.5 132 161.5L11 134.5C7.41038 133.847 3.99879 131 2.49879 128C1.74801 126.5 1.49932 124.716 1.5 123.5V12C1.49801 7.5 6.99639 1.5 11.9983 1.5H397.998C404.498 1.5 408.498 7.5 408.498 12.5V123C408.498 124.167 408.998 129 403.998 132.5C403.665 132.667 401.498 134 394.498 135.5L274.998 162.5L271.998 163.5C270.331 164.167 264.998 166 257.998 170C257.027 170.555 255.998 171 247.998 177C246.998 177.833 243.898 180.6 239.498 185C237.998 186.5 235.998 188.5 231.998 191C229.998 191.5 229.498 192 225.998 192Z" />
        </clipPath>
      </defs>
      <g className="batterySide--stroke">
        <path
          opacity="0.8"
          d="M225.998 192H181.998C176.998 191.5 173.498 187.5 171.998 186C168.498 182.5 163.998 177 156.498 172.5C148.998 167 137.498 162.5 132 161.5L11 134.5C7.41038 133.847 3.99879 131 2.49879 128C1.74801 126.5 1.49932 124.716 1.5 123.5V12C1.49801 7.5 6.99639 1.5 11.9983 1.5H397.998C404.498 1.5 408.498 7.5 408.498 12.5V123C408.498 124.167 408.998 129 403.998 132.5C403.665 132.667 401.498 134 394.498 135.5L274.998 162.5L271.998 163.5C270.331 164.167 264.998 166 257.998 170C257.027 170.555 255.998 171 247.998 177C246.998 177.833 243.898 180.6 239.498 185C237.998 186.5 235.998 188.5 231.998 191C229.998 191.5 229.498 192 225.998 192Z"
          stroke="currentColor"
          strokeWidth="3"
        />
      </g>
      {batteryStatus === 4 ? (
        <g mask={`url(#${maskHash})`}>
          <rect x="0" y="0" width="411" height="194" fill="currentColor" opacity="0.3" />
        </g>
      ) : (
        ""
      )}
      {batteryStatus === 0 || batteryStatus === 1 || batteryStatus === 2 ? (
        <g className="batterySide--fill" clipPath={`url(#clip-${maskHash})`}>
          <rect
            x="0"
            y={192 - batteryHeight}
            width="411"
            height={batteryHeight}
            fill="currentColor"
          />
        </g>
      ) : (
        ""
      )}
      {batteryStatus === 1 || batteryStatus === 2 ? (
        <g className="batterySide--charging">
          <foreignObject x="170" y="60" width="70" height="70">
            <div className="flex items-center justify-center w-full h-full">
              <IconThunder />
            </div>
          </foreignObject>
        </g>
      ) : (
        ""
      )}
      {batteryStatus === 3 ? (
        <g className="batterySide--error absolute">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="72" fill="currentColor">
            ?
          </text>
        </g>
      ) : (
        ""
      )}
      {batteryStatus === 255 ? (
        <g className="batterySide--fatalError absolute">
          <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize="72" fill="currentColor">
            !
          </text>
        </g>
      ) : (
        ""
      )}
    </svg>
  );
}

export default SonseiBatteryIndicatorLeft;
