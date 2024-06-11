import React from "react";

import { IconBluetooth, IconPlug, IconSignal } from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";
import { ConnectionProps } from "@Renderer/types/wireless";

function ConnectionStatus(props: ConnectionProps) {
  const { connection } = props;
  const connectionTypes = [
    { id: 0, text: "Wired connected", icon: <IconPlug /> },
    { id: 1, text: "Bluetooh connected", icon: <IconBluetooth /> },
    { id: 2, text: "RF connected", icon: <IconSignal /> },
  ];
  return (
    <div>
      <div className="cardConnection flex gap-4 items-center rounded-xl -mb-2 py-3 px-[14px] bg-white/400 dark:bg-gray-600/25">
        <div className="cardConnectionIcon flex items-center justify-center text-white aspect-square w-[42px] bg-purple-300 rounded-full">
          {connectionTypes[connection].icon}
        </div>
        <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 text-[0.915rem]">
          {connectionTypes[connection].text}
        </Heading>
      </div>
    </div>
  );
}

export default ConnectionStatus;
