// -*- mode: js-jsx -*-
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

import React, { useState, useEffect, useRef } from "react";

import { StepProps } from "@Types/firmwareUpdate";

interface StepsProgressBarProps {
  steps: StepProps[];
  stepActive: number;
}
interface WidthCalculated {
  width: string;
}

const StepsProgressBar = ({ steps, stepActive }: StepsProgressBarProps) => {
  const [refreshPositionStyle, setRefreshPositionStyle] = useState({
    width: `0`,
  });
  let constructGrid;
  if (Array.isArray(steps)) {
    constructGrid = {
      gridTemplateColumns: `repeat(${steps.length - 3}, 1fr)`,
    };
  }

  const bulletsRef = useRef([]);
  const stepsElementsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // setStepsPosition(steps.findIndex(x => x.step === stepActive));
    let widthPercentage: WidthCalculated;
    if (Array.isArray(steps)) {
      if (stepActive === steps.length - 1) {
        widthPercentage = {
          width: `calc(0%)`,
        };
        if (stepsElementsRef.current) {
          stepsElementsRef.current.classList.add("error");
        }
      } else {
        if (stepsElementsRef.current) {
          stepsElementsRef.current.classList.remove("error");
        }
        if (stepActive === 0) {
          widthPercentage = {
            width: `calc(0%)`,
          };
        } else if (stepActive === 1) {
          widthPercentage = {
            width: `calc(0% + 34px)`,
          };
        } else if (stepActive === steps.length - 2) {
          widthPercentage = {
            width: `calc(100% + 64px)`,
          };
          bulletsRef.current[stepActive].classList.add("success");
        } else {
          widthPercentage = {
            width: `calc(${(100 / (steps.length - 3)) * (stepActive - 1)}% + 34px)`,
          };
        }
      }
    }

    setRefreshPositionStyle(widthPercentage);
  }, [stepActive, steps]);

  return (
    <div className="w-full steps-progress-bar">
      <div className="stepsBarWrapper">
        <div className="stepsBarWrapperInner py-0 px-8 bg-gray-100 dark:bg-gray-600" ref={stepsElementsRef}>
          <div className="stepsElements grid grid-flow-col mr-[12px]" style={constructGrid}>
            {(steps as StepProps[]).map((item, index) =>
              index === 0 || index === steps.length - 1 ? (
                ""
              ) : (
                <div
                  className={`step relative ${index < stepActive ? "completed" : ""} ${index === stepActive ? "active" : ""}`}
                  data-order={index}
                  key={`progress-step-${item.step}`}
                  ref={ref => {
                    bulletsRef.current[index] = ref;
                  }}
                >
                  <div
                    className={`stepBullet absolute left-0 top-[-4px] w-[13px] h-[13px] origin-center rounded-full border-[3px] border-solid z-20 ${index < stepActive ? "completed" : ""}`}
                  />
                </div>
              ),
            )}
          </div>
          <div className={`progressBar w-full h-[6px] mb-[-6px] rounded-2sm relative progressBar-set${stepActive}`}>
            <div
              className="progressBarActive absolute left-[-32px] top-0 h-[6px] transition-all duration-1000 ease-in-out rounded-2sm z-10"
              style={refreshPositionStyle}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepsProgressBar;
