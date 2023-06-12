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

import React, { useState, useEffect } from "react";
import Styled from "styled-components";

const Style = Styled.div`   
width: 100%;
.stepsBarWrapperInner {
    padding: 0 32px;
}
.stepsElements {
  display: grid;
  grid-auto-flow: column;
  margin-right: 12px;
}
.step {
  position: relative;
}
.stepBullet {
    position: absolute;
    left: 0;
    transform: scale(1) translate3d(0,0, 0);
    transform-origin: center center;
    width: 13px;
    height: 13px;
    border-radius: 50%;
    box-shadow: ${({ theme }) => theme.styles.stepsBar.bulletBoxShadow};
    border: 3px solid ${({ theme }) => theme.styles.stepsBar.bulletBackground};
    background-color: ${({ theme }) => theme.styles.stepsBar.bulletBackground};
    z-index: 2;
    top: -4px;    
    animation: splashBullet 400ms normal forwards ease-in-out;
    animation-iteration-count: 1;
}
.active .stepBullet,
.active.completed .stepBullet {
    box-shadow: ${({ theme }) => theme.styles.stepsBar.bulletBoxShadowActive};
    border: 3px solid ${({ theme }) => theme.styles.stepsProgressBar.bulletBorderActive};
    background-color: ${({ theme }) => theme.styles.stepsProgressBar.bulletBackground};
}
.completed .stepBullet {
    box-shadow: ${({ theme }) => theme.styles.stepsBar.bulletBoxShadowActive};
    border: 3px solid ${({ theme }) => theme.styles.stepsProgressBar.bulletBorderActive};
    background-color: ${({ theme }) => theme.styles.stepsProgressBar.bulletBackgroundActive};
}
.progressBar {
  width: 100%;
  height: 6px;
  margin-bottom: -6px;
  border-radius: 3px;
  position: relative;
  .progressBarActive {
    left: -32px;
    top: 0;
    width: calc(100% + 64px);
    height: 6px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.styles.stepsProgressBar.stepBarBackgroundActive};
    position: absolute;
    transition: width 1s ease-in-out;
  }
}

@keyframes splashBullet {
  0% {
      transform: scale(1) translate3d(0,0, 0);
  }
  25% {
      transform: scale(0.75) translate3d(0,0, 0);
  }
  80% {
    transform: scale(1.2) translate3d(0,0, 0);
  }
  100% {
    transform: scale(1) translate3d(0,0, 0);
  }
}
`;

const StepsProgressBar = ({ steps, stepActive }) => {
  let [stepsPosition, setStepsPosition] = useState(0);

  let [refreshPositionStyle, setRefreshPositionStyle] = useState({
    width: `0`
  });
  const constructGrid = {
    gridTemplateColumns: `repeat(${steps.length - 3}, 1fr)`
  };

  useEffect(() => {
    let widthPercentage;
    setStepsPosition(steps.findIndex(x => x.step === stepActive));

    if (stepsPosition == 1) {
      widthPercentage = {
        width: `calc(0%)`
      };
    } else {
      if (stepsPosition == 2) {
        widthPercentage = {
          width: `calc(0% + 34px)`
        };
      } else {
        if (stepsPosition == steps.length - 1) {
          widthPercentage = {
            width: `calc(100% + 64px)`
          };
        } else {
          widthPercentage = {
            width: `calc(${(100 / (steps.length - 3)) * stepsPosition - 1}% + 34px)`
          };
        }
      }
    }
    setRefreshPositionStyle(widthPercentage);
  }, [stepActive]);

  return (
    <Style>
      <div className="stepsBarWrapper">
        <div className="stepsBarWrapperInner">
          <div className="stepsElements" style={constructGrid}>
            {steps.map((item, index) =>
              index == 0 || index == steps.length - 1 ? (
                ""
              ) : (
                <div
                  className={`step ${index < stepsPosition ? "completed" : ""} ${index == stepsPosition ? "active" : ""}`}
                  data-order={index}
                  key={`${index}`}
                >
                  <div className="stepBullet"></div>
                </div>
              )
            )}
          </div>
          <div className={`progressBar progressBar-set${stepsPosition}`}>
            <div className="progressBarActive" style={refreshPositionStyle}></div>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default StepsProgressBar;
