import React, { useState, forwardRef } from "react";

import Heading from "@Renderer/components/atoms/Heading";
import { IconDelete, IconDragAndDrop } from "@Renderer/components/atoms/icons";

import { DevicePreview } from "@Renderer/modules/DevicePreview";

import { SortableKnob } from "react-easy-sort";

import { Button } from "@Renderer/components/atoms/Button";

import { i18n } from "@Renderer/i18n";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@Renderer/components/ui/dropdown-menu";
interface CardDeviceProps {
  device: any;
  filterBy: boolean | "all";
  openDialog: (device: any) => void;
}

const CardDevice = forwardRef<HTMLDivElement, CardDeviceProps>(({ device, filterBy, openDialog }, ref) => {
  const [isConnected, setIsConnected] = useState(false);

  const filterAttribute = (filter: any) => {
    switch (filter) {
      case true:
        return "show-online";
        break;
      case false:
        return "show-offline";
        break;
      default:
        return "all";
    }
  };

  return (
    <div
      ref={ref}
      className={`card-device select-none flex flex-col relative p-0 rounded-[24px] border-2 border-solid bg-cardDeviceTextureLight dark:bg-cardDeviceTextureDark  bg-no-repeat bg-right-top bg-cover overflow-hidden ${
        isConnected
          ? "card-connected border-purple-300 dark:border-green-200"
          : "card-disconnected border-gray-100 dark:border-gray-600"
      } ${
        device.available
          ? "card-online"
          : "card-offline relative isolate before:absolute before:content-[''] before:w-full before:h-full before:bg-bgCardOfflineLight before:dark:bg-bgCardOfflineDark"
      } ${filterBy !== "all" ? `card-filter-on ${filterAttribute(filterBy)}` : "card-all"}`}
    >
      <div className="card-header relative bg-transparent border-none pt-6 min-h-[140px]">
        {device.name ? (
          <>
            <Heading headingLevel={3} renderAs="h3" className="text-gray-600 dark:text-gray-50">
              {device.name}
            </Heading>
            <Heading headingLevel={4} renderAs="h4" className="text-base text-gray-400 dark:text-gray-50">
              {device.device.info.displayName}
            </Heading>
          </>
        ) : (
          <Heading headingLevel={3} renderAs="h3" className="text-gray-600 dark:text-gray-50">
            {device.device.info.displayName}
          </Heading>
        )}
        {device.file ? (
          <Heading
            headingLevel={5}
            renderAs="h5"
            className="text-xs normal-case tracking-normal mt-2 text-gray-300 dark:text-gray-100"
          >
            Virtual
          </Heading>
        ) : null}

        <SortableKnob>
          <div className="card-device-knob z-50 absolute right-6 top-6 w-8 h-8 rounded-sm flex justify-center items-center bg-gray-50/35 hover:bg-gray-50/60 dark:bg-gray-600/40 hover:dark:bg-gray-600/60 hover:cursor-grab transition-colors">
            <IconDragAndDrop />
          </div>
        </SortableKnob>
      </div>
      <div
        className={`mb-[-20%] mt-[-14%] flex justify-end [&_canvas]:transition-all [&_canvas]:translate-x-[24%] ${
          device.available ? "relative " : "relative -z-[1] [&_canvas]:opacity-25 [&_canvas]:dark:opacity-100"
        }`}
      >
        <DevicePreview deviceName={device.device.info.displayName} isConnected={isConnected} />
      </div>
      <div className="card-footer bg-transparent border-none p-0.5 mt-auto">
        <div className="card-footer--inner flex justify-between items-center rounded-[18px] p-4 bg-gray-25/80 dark:bg-gray-700/70 backdrop-blur-sm">
          {device.available ? (
            <Button
              variant={`${isConnected ? "outline" : "primary"}`}
              className="h-[52px]"
              onClick={() => setIsConnected(!isConnected)}
            >
              {isConnected ? i18n.keyboardSelect.disconnect : "Configure"}
            </Button>
          ) : (
            // <button
            //   type="button"
            //   onClick={() => setIsConnected(!isConnected)}
            //   className={`button m-0 h-[52px] focus:shadow-none focus-within:shadow-none ${
            //     isConnected ? "outline transp-bg" : "primary"
            //   }`}
            // >
            //   {isConnected ? i18n.keyboardSelect.disconnect : "Configure"}
            // </button>
            <span className="device-status text-sm text-red-100">{i18n.general.offline}</span>
          )}
          <div className="flex gap-2">
            {!isConnected ? (
              <button
                className="buttonTogglerInner flex items-center p-0 w-[52px] h-[52px] rounded transition-all justify-center hover:bg-gray-100/50 hover:dark:bg-gray-25/5"
                onClick={() => openDialog(device)}
                type="button"
              >
                <IconDelete />
              </button>
            ) : null}
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger className="data-[state=open]:bg-gray-100/50 data-[state=open]:dark:bg-gray-25/5 rounded">
              <div className="buttonTogglerInner flex items-center p-0 w-[52px] h-[52px] rounded transition-all justify-center hover:bg-gray-100/50 hover:dark:bg-gray-25/5">
                <IconSettings />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled={!isConnected} onClick={handlePreferences}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isConnected} onClick={() => openDialog(device)}>
                Forget this device
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </div>
  );
});

export default CardDevice;
