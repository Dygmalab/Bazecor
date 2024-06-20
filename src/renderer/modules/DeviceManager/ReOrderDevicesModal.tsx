import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@Renderer/components/atoms/Dialog";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { IconDragAndDrop } from "@Renderer/components/atoms/icons";
import { RegularButton } from "@Renderer/component/Button";
import Heading from "@Renderer/components/atoms/Heading";

import { i18n } from "@Renderer/i18n";

interface ReOrderDevicesModalProps {
  show: boolean;
  toggleShow: () => void;
  handleSave: (device: any) => void;
  devices: any;
}

const ReOrderDevicesModal = ({ show, toggleShow, handleSave, devices }: ReOrderDevicesModalProps) => {
  const [devicesList, setDevicesList] = useState(devices);
  const handleOnDragEnd = (result: any) => {
    if (!result.destination) return;
    const items = Array.from(devicesList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setDevicesList(items);
  };
  return (
    <Dialog open={show} onOpenChange={toggleShow} modal defaultOpen={show}>
      <DialogContent className="px-0">
        <DialogHeader>
          <DialogTitle>{i18n.deviceManager.ReOrderList}</DialogTitle>
        </DialogHeader>
        <div className="relative w-100 p-6 overflow-auto bg-gray-50 dark:bg-gray-700">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="devices" direction="horizontal">
              {provided => (
                <div className="droppable-area w-100 flex relative" {...provided.droppableProps} ref={provided.innerRef}>
                  {devicesList.map((device: any, index: number) => (
                    <Draggable key={device.serialNumber} draggableId={device.serialNumber} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          className={`draggable-item w-[224px] flex-shrink-0 flex-grow-0 basis-[224px] my-0 mx-1 p-4 rounded-[6px] border-[1px] border-dashed border-gray-300 dark:border-purple-100 bg-gray-25 dark:bg-gray-600 ${
                            dragSnapshot.isDragging ? "dragging" : ""
                          }`}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          ref={dragProvided.innerRef}
                        >
                          <div className="drag-icon w-6 h-6 rounded-[2px] cursor-grab flex justify-center items-center mb-4 text-gray-300 dark:text-gray-25 bg-gray-50 dark:bg-gray-500">
                            <IconDragAndDrop />
                          </div>
                          <div className="drag-content w-full">
                            {device.name ? (
                              <Heading headingLevel={3} renderAs="h3" className="text-gray-600 dark:text-gray-25">
                                {device.name}
                              </Heading>
                            ) : null}
                            <Heading
                              headingLevel={device.name ? 4 : 3}
                              renderAs="h3"
                              className={`text-base ${
                                device.name ? "text-gray-400 dark:text-gray-50" : "text-gray-600 dark:text-gray-25"
                              }`}
                            >
                              {device.device.info.displayName}
                            </Heading>
                            <p className="text-xs mt-1 text-gray-300 dark:text-gray-100">{device.path}</p>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        <DialogFooter>
          <RegularButton buttonText="Discard changes" styles="outline transp-bg" size="sm" onClick={toggleShow} />
          <RegularButton buttonText="Apply changes" styles="outline gradient" size="sm" onClick={() => handleSave(devicesList)} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReOrderDevicesModal;
