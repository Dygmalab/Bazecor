import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@Renderer/components/ui/dialog";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import { IconDragAndDrop } from "@Renderer/components/icons";
import { RegularButton } from "@Renderer/component/Button";

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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <DragDropContext onDragEnd={handleOnDragEnd}>
            <Droppable droppableId="devices" direction="horizontal">
              {provided => (
                <div
                  className="droppable-area flex p-6 overflow-auto relative bg-gray-50 dark:bg-gray-700"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {devicesList.map((device: any, index: number) => (
                    <Draggable key={device.serialNumber} draggableId={device.serialNumber} index={index}>
                      {(dragProvided, dragSnapshot) => (
                        <div
                          className={`draggable-item ${dragSnapshot.isDragging ? "dragging" : ""}`}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          ref={dragProvided.innerRef}
                        >
                          <div className="drag-icon">
                            <IconDragAndDrop />
                          </div>
                          <div className="drag-content">
                            {device.name ? <Heading headingLevel={3}>{device.name}</Heading> : null}
                            <Heading headingLevel={device.name ? 4 : 3}>{device.device.info.displayName}</Heading>
                            <p>{device.path}</p>
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
