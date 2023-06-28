import React from "react";
import Tooltip from "react-bootstrap/Overlay";
import { IconLeaf } from "../Icon";

import Styled from "styled-components";
const Style = Styled.div`
&.status--default {
    --color-status: ${({ theme }) => theme.colors.gray200};
}
&.status--saving{
    --color-status: ${({ theme }) => theme.colors.brandWarning};
}
&.batterySavingMode {
    position: absolute;
    bottom: 0;
    color: var(--color-status);
    left: 50%;
    transform: translate3d(-50%, -4px, 0);
    transition: 300ms color ease-in-out;
}
`;

function SavingModeIndicator({ isSavingMode }) {
  return (
    <Style
      className={`batterySavingMode ${isSavingMode ? "savingModeEnabled status--saving" : "savingModeDisabled status--default"}`}
    >
      <IconLeaf />
    </Style>
  );
}

export default SavingModeIndicator;
