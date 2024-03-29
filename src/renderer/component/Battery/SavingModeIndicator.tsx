import React from "react";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import Styled from "styled-components";

import { IconLeaf } from "@Renderer/component/Icon";

const Style = Styled.div`
&.status--default {
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.strokeShapeColor};
}
&.status--saving{
    --color-status: ${({ theme }) => theme.colors.brandWarning};
}
&.status--charging.status--saving{
  --color-status: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
}
&.batterySavingMode {
    position: absolute;
    top: 98px;
    color: var(--color-status);
    left: 50%;
    transform: translate3d(-50%, -4px, 0);
    transition: 300ms color ease-in-out;
}
`;

interface SavingModeIndicatorProps {
  isSavingMode: boolean;
}

function SavingModeIndicator({ isSavingMode }: SavingModeIndicatorProps) {
  return (
    <Style
      className={`batterySavingMode ${isSavingMode ? "savingModeEnabled status--saving" : "savingModeDisabled status--default"}`}
    >
      <OverlayTrigger
        key="keySavingModeOverlay"
        placement="top"
        overlay={
          <Tooltip id="tooltip-top-savingMode">
            Saving mode <strong>{isSavingMode ? "enabled" : "disabled"}</strong>
          </Tooltip>
        }
      >
        <IconLeaf />
      </OverlayTrigger>
    </Style>
  );
}

export default SavingModeIndicator;
