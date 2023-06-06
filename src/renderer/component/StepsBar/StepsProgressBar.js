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
  &.active {  
    .stepIcon {
      color: ${({ theme }) => theme.colors.purple300};
      animation: splashBullet 400ms normal forwards ease-in-out;
      animation-iteration-count: 1;
    }
    .stepBullet {
      box-shadow: 0px 4px 12px #303949;
      border: 3px solid ${({ theme }) => theme.colors.purple200};
      background-color: ${({ theme }) => theme.colors.purple300};
      animation: splashBullet 400ms normal forwards ease-in-out;
      animation-iteration-count: 1;
    }
  }
}
.stepIcon {
  position: absolute;
  left: -3px; 
  top: -42px;
  transition: color 300ms ease-in-out;
  transform: scale(1) translate3d(0,0, 0);
  color: ${({ theme }) => theme.styles.stepsBar.bulletIconColor};
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
  &.active {
    box-shadow: ${({ theme }) => theme.styles.stepsBar.bulletBoxShadowActive};
    border: 3px solid ${({ theme }) => theme.styles.stepsBar.bulletBorderActive};
    background-color: ${({ theme }) => theme.styles.stepsBar.bulletBackgroundActive};
  }
}
.progressBar {
  width: 100%;
  height: 6px;
  margin-bottom: -6px;
  border-radius: 3px;
  background-color: ${({ theme }) => theme.styles.stepsBar.stepBarBackground};
  position: relative;
//   overflow: hidden;
  .progressBarActive {
    left: -32px;
    top: 0;
    width: 0%;
    height: 6px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.styles.stepsBar.stepBarBackgroundActive};
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
  console.log("Steps", steps);
  let [stepsPosition, setStepsPosition] = useState(parseInt(stepActive));
  let [refreshPositionStyle, setRefreshPositionStyle] = useState({
    width: `calc(${(100 / (steps.length - 1)) * stepsPosition}% + 32px)`
  });
  const constructGrid = {
    gridTemplateColumns: `repeat(${steps.length - 1}, 1fr)`
  };

  useEffect(() => {
    if (steps.length > stepActive) {
      let widthPercentage;
      if (stepActive == steps.length - 1) {
        widthPercentage = {
          width: `calc(${(100 / (steps.length - 1)) * stepActive}% + 64px)`
        };
      } else {
        widthPercentage = {
          width: `calc(${(100 / (steps.length - 1)) * stepActive}% + 32px)`
        };
      }
      setRefreshPositionStyle(widthPercentage);
    }
  }, [stepActive, steps.length]);
  return (
    <Style>
      <div className="stepsBarWrapper">
        <div className="stepsBarWrapperInner">
          <div className="stepsElements" style={constructGrid}>
            {steps.map((item, index) => (
              <div className={`step ${index <= stepActive ? "active" : ""}`} data-order={index} key={`${index}`}>
                <div className="stepBullet"></div>
              </div>
            ))}
          </div>
          <div className={`progressBar ${stepActive == steps.length - 1 ? "progressBarEnd" : ""}`}>
            <div className="progressBarActive" style={refreshPositionStyle}></div>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default StepsProgressBar;
