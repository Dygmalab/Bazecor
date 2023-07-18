import React from "react";
import Styled from "styled-components";

import { IconBluetooth, IconPlug, IconSignal } from "@Renderer/component/Icon";
import Title from "@Renderer/component/Title";

const Styles = Styled.div`
.cardConnection {
  display: flex;
  grid-gap: 16px;
  align-items: center;
}
.cardConnectionIcon {
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  color: white;
}
`;

type ConnectionProps = {
  connection?: number | null | undefined;
};

function ConnectionStatus({ connection }: ConnectionProps) {
  const connectionTypes = [
    { id: 0, text: "Wired connected", icon: <IconSignal /> },
    { id: 1, text: "Bluetooh connected", icon: <IconBluetooth /> },
    { id: 2, text: "RF connected", icon: <IconPlug /> },
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
