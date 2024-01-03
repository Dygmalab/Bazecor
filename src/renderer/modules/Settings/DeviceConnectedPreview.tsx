import React, { useState } from "react";
import { NameModal } from "@Renderer/component/Modal";
import { IconPen } from "@Renderer/component/Icon";
import { motion } from "framer-motion";
import i18n from "../../i18n";
import { DevicePreview } from "../DevicePreview";

interface DeviceConnectedPreviewProps {
  deviceName?: string;
  deviceDisplayName?: string;
  nameChange: (data: string) => void;
}

const DeviceConnectedPreview = ({ deviceName, deviceDisplayName, nameChange }: DeviceConnectedPreviewProps) => {
  const [showModal, setShowModal] = useState(false);
  const handleSave = (data: string) => {
    setShowModal(false);
    nameChange(data);
  };
  return (
    <div className="flex flex-col gap-1 mb-2">
      <div className="relative">
        <div className="max-w-[204px] ml-[-24px] relative">
          <DevicePreview deviceName={deviceDisplayName} isConnected />
        </div>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: [1, 0.75, 1] }} // Pulsating animation effect
          transition={{ duration: 1, repeat: Infinity }}
          className="rounded-full absolute bg-purple-200 dark:bg-green-200 h-[8px] w-[8px] top-[-4px] right-[-4px]"
        >
          &nbsp;
        </motion.div>
      </div>

      {deviceName ? (
        <>
          <button onClick={() => setShowModal(true)} type="button" className="p-0 text-left">
            <h4 className="tracking-tight font-semibold text-2xl text-gray-700 dark:text-gray-25 ">
              {deviceName}{" "}
              <span className="inline-block mr-2 align-[2px]">
                <IconPen />
              </span>
            </h4>
          </button>
          <h5 className="tracking-tight font-semibold text-base text-gray-500 dark:text-gray-50">{deviceDisplayName}</h5>
        </>
      ) : (
        <button onClick={() => setShowModal(true)} type="button" className="p-0 text-left">
          <h4 className="tracking-tight font-semibold text-2xl text-gray-700 dark:text-gray-25">
            {deviceDisplayName}{" "}
            <span className="inline-block mr-2 align-[2px]">
              <IconPen />
            </span>
          </h4>
        </button>
      )}

      <NameModal
        show={showModal}
        name={deviceName || ""}
        toggleShow={() => setShowModal(false)}
        handleSave={(data: string) => handleSave(data)}
        modalTitle={i18n.keyboardSettings.neuronManager.changeLayerTitle}
        labelInput={i18n.keyboardSettings.neuronManager.inputLabel}
      />
    </div>
  );
};

export default DeviceConnectedPreview;
