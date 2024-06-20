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

import React, { useState, useEffect } from "react";

import DefyBatteryIndicatorLeft from "@Renderer/components/atoms/battery/DefyBatteryIndicatorLeft";
import DefyBatteryIndicatorRight from "@Renderer/components/atoms/battery/DefyBatteryIndicatorRight";

import { i18n } from "@Renderer/i18n";

interface DefyBatteryIndicatorProps {
  side: "left" | "right";
  batteryLevel: number;
  batteryStatus: number;
}
const DefyBatteryIndicator = ({ side, batteryLevel, batteryStatus }: DefyBatteryIndicatorProps) => {
  const [batteryHeight, setBatteryHeight] = useState(0);

  useEffect(() => {
    switch (batteryStatus) {
      case 0:
        if (batteryLevel > 0 && batteryLevel < 5) {
          setBatteryHeight(2);
        } else {
          setBatteryHeight((115 * batteryLevel) / 100);
        }
        break;
      case 1:
        setBatteryHeight(0);
        break;
      case 2:
        setBatteryHeight(115);
        break;
      case 3:
        setBatteryHeight(0);
        break;
      case 4:
        setBatteryHeight(0);
        break;
      default:
        setBatteryHeight(0);
    }
  }, [batteryLevel, batteryStatus]);

  return (
    <div>
      <div className="batterySideWrapper">
        <div className="batterySide relative">
          {side === "left" ? <DefyBatteryIndicatorLeft batteryStatus={batteryStatus} batteryHeight={batteryHeight} /> : ""}
          {side === "right" ? <DefyBatteryIndicatorRight batteryStatus={batteryStatus} batteryHeight={batteryHeight} /> : ""}
          {batteryStatus === 0 ? (
            <div className="batterySide--percentage absolute top-1/2 left-1/2 w-full font-bold tracking-tight text-center text-xl transform-style-3d translate-x-[-50%] translate-y-[-50%] text-[#ffffff] dark:text-gray-25">
              {batteryLevel}%
            </div>
          ) : (
            ""
          )}
        </div>
        {batteryStatus === 3 ? (
          <div className="alertMessage alert-warning text-gray-600 bg-orange-200/25 dark:text-orange-200 dark:bg-orange-200/20 tracking-tight leading-4 mt-[4px] rounded-sm font-semibold text-center text-2xxs py-[0.3rem] px-[0.25rem]">
            {i18n.wireless.batteryPreferences.batteryErrorReading}
          </div>
        ) : (
          ""
        )}
        {batteryStatus === 4 ? (
          <div className="alertMessage alert-disconnected text-gray-300 bg-gray-50 dark:text-gray-100 dark:bg-gray-600 tracking-tight leading-4 mt-[4px] rounded-sm font-semibold text-center text-2xxs py-[0.3rem] px-[0.25rem]">
            {i18n.wireless.batteryPreferences.batteryDisconnected}
          </div>
        ) : (
          ""
        )}
        {batteryStatus === 255 ? (
          <div className="alertMessage alert-fatal-error text-gray-600 bg-primary/25 dark:text-primary dark:bg-primary/25 tracking-tight leading-4 mt-[4px] rounded-sm font-semibold text-center text-2xxs py-[0.3rem] px-[0.25rem]">
            {i18n.wireless.batteryPreferences.batteryFatalError}
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default DefyBatteryIndicator;
