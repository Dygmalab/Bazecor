import React from "react";
import Styled from "styled-components";

const BadgeWrapper = Styled.div`
  position: absolute;
  z-index: 2;
  color: ${({ theme }) => theme.colors.gray700};
  background-color: rgb(0,205,200);
  padding: 2px 4px;
  bottom: -12px;
  left: 50%;
  margin-left: -63px;
  white-space: nowrap;
  width: 126px;
  border-radius: 18px;
  text-align: center;
  font-size: 0.825rem;
  transition: 300ms color ease-in-out, 300ms background-color ease-in-out, 300ms opacity ease-in-out;
  transform-origin: center center;
  opacity: 0;
  &.key-badge__add {
    opacity: 1;
  }
  &.key-badge__release {
    color: ${({ theme }) => theme.colors.gray25};
    background-color: ${({ theme }) => theme.colors.brandDangerLighter};
    animation: pulse-orange 1s infinite;
  }
  &.key-badge__add.key-badge__remove {
    opacity: 0;
  }
  @keyframes pulse-orange {
    0% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255,107,107, 0.7);
    }

    70% {
      transform: scale(1);
      box-shadow: 0 0 0 24px rgba(255,107,107, 0);
    }

    100% {
      transform: scale(0.95);
      box-shadow: 0 0 0 0 rgba(255,107,107, 0);
    }
  }
`;

interface BadgeFirmwareProps {
  countdown: number;
}

const BadgeFirmware = ({ countdown }: BadgeFirmwareProps) => {
  if (countdown === 0 || countdown > 3) return null;
  return (
    <BadgeWrapper
      className={`key-badge key-badge__add ${countdown === 2 || countdown === 3 ? "key-badge__release" : null} ${
        countdown > 4 ? "key-badge__remove" : null
      }`}
    >
      {countdown === 1 ? "Keep holding" : null} {countdown === 2 || countdown === 3 ? "Release the key" : null}
    </BadgeWrapper>
  );
};

export default BadgeFirmware;
