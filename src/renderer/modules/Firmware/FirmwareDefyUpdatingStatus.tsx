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

import React from "react";
import Styled from "styled-components";

import { DefyLeftSide, DefyRightSide, DefyNeuronStatus } from "@Renderer/component/SidesStatus";

const Style = Styled.div`
.defySidesUpdatingStatus {
  display: flex;
  grid-gap: 8px;
}
.defySides {
  position: relative;
  transition: 300ms color ease-in-out;
  color: ${({ theme }) => theme.styles.neuronStatusDefy.statusWaiting};
  &.updating {
    color: ${({ theme }) => theme.colors.purple300};
    .sideIndicator--updating {
      opacity: 1;
      transform-origin: center;
      animation: rotateUpdatingProcess 2s linear infinite;
      background-color: ${({ theme }) => theme.colors.purple300};
    }
  }
  &.warning {
    color: ${({ theme }) => theme.colors.brandWarning};
    .sideIndicator--updating {
      opacity: 1;
      background-color: ${({ theme }) => theme.colors.brandWarning};
    }
  }
  &.success {
    color: ${({ theme }) => theme.colors.brandSuccess};
    .sideIndicator--success {
      opacity: 1;
      background-color: ${({ theme }) => theme.colors.brandSuccess};
    }
  }
}
.sideIndicator {
  position: absolute;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  top: -4px;
  right: -2px;
  color: ${({ theme }) => theme.colors.gray25};
  opacity: 0;
  transition: 300ms ease-in-out opacity;
}
.defySidesUpdatingStatus--WiredNeuron {
  .sideIndicator {
    top: 2px;
    right: 4px;
  }
}
.defySidesUpdatingStatus--WirelessNeuron {
  .sideIndicator {
    top: -16px;
    right: 6px;
  }
}
@keyframes rotateUpdatingProcess {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
`;
interface FirmwareDefyUpdatingStatusProps {
  countdown: number;
  keyboardType: string;
  retriesLeft: number;
  retriesRight: number;
  retriesDefyWired: number;
}

const FirmwareDefyUpdatingStatus = ({
  countdown,
  keyboardType,
  retriesLeft,
  retriesRight,
  retriesDefyWired,
}: FirmwareDefyUpdatingStatusProps) => (
  <Style>
    <div className={`defySidesUpdatingStatus defySidesUpdatingStatus-${countdown}`}>
      {countdown <= 2 ? (
        <>
          <DefyLeftSide
            updating={!!(countdown === 2 && retriesLeft === 1)}
            warning={!!(retriesLeft > 1 && countdown < 3)}
            success={countdown > 2 ? "success" : ""}
            error={retriesLeft >= 3}
          />
          <DefyRightSide
            updating={!!(countdown === 1 && retriesRight === 1)}
            warning={!!(retriesRight > 1 && countdown < 2)}
            success={countdown > 1 ? "success" : ""}
            error={retriesRight >= 3}
          />
        </>
      ) : (
        <DefyNeuronStatus
          updating={!!(countdown >= 3 && countdown < 5)}
          warning={!!(retriesDefyWired > 1 && countdown < 4)}
          success={countdown >= 5 ? "success" : ""}
          error={retriesDefyWired >= 3}
          keyboardType={keyboardType}
        />
      )}
    </div>
  </Style>
);

export default FirmwareDefyUpdatingStatus;
