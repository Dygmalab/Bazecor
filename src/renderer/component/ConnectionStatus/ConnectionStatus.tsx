import React from "react";
import Styled from "styled-components";

import { IconBluetooth, IconPlug, IconSignal } from "@Renderer/component/Icon";
import Title from "@Renderer/component/Title";

const Styles = Styled.div`
.cardConnection {
  display: flex;
  grid-gap: 16px;
  align-items: center;
  background-color: ${({ theme }) => theme.styles.energyManagement.connectionBGColor};
  padding: 0.75rem 1rem;
  border-radius: 14px;
  margin-bottom: -0.5rem;
  h4 {
    margin-bottom: 0;
    font-size: 0.915rem;
    color: ${({ theme }) => theme.styles.energyManagement.connectionColor};
  }
}
.cardConnectionIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
  width: 42px;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.purple300};
}
`;

type ConnectionProps = {
  connection?: number | null | undefined;
};

function ConnectionStatus({ connection }: ConnectionProps) {
  const connectionTypes = [
    { id: 0, text: "Wired connected", icon: <IconPlug /> },
    { id: 1, text: "Bluetooh connected", icon: <IconBluetooth /> },
    { id: 2, text: "RF connected", icon: <IconSignal /> },
  ];
  return (
    <Styles>
      <div className="cardConnection">
        <div className="cardConnectionIcon">{connectionTypes[connection].icon}</div>
        <Title text={connectionTypes[connection].text} headingLevel={4} />
      </div>
    </Styles>
  );
}

export default ConnectionStatus;
