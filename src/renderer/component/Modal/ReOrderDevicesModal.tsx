import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { RegularButton } from "@Renderer/component/Button";
import Heading from "@Renderer/component/Heading";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Styled from "styled-components";

const DragListWrapper = Styled.div`
  position: relative;
  .droppable-area {
    display: flex;
    grid-gap: 8px;
    padding: 8px;
    overflow: auto;
    position: relative;
    .draggable-item {
      width: 175px;
      padding: 16px;
      border-radius: 8px;
      background-color: yellow;
    }
  }
`;

const ReOrderDevicesModal = ({ show, toggleShow, handleSave, devices }) => {
  const [devicesList, setDevicesList] = useState(devices);
  const handleOnDragEnd = result => {
    if (!result.destination) return;
    const items = Array.from(devicesList);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setDevicesList(items);
  };
  console.log(devices);

  return (
    <>
      <Modal
        size="lg"
        show={show}
        onHide={toggleShow}
        aria-labelledby="contained-modal-title-vcenter"
        className="with-drag with-scroll"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Re-order list</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DragListWrapper>
            <DragDropContext onDragEnd={handleOnDragEnd}>
              <Droppable droppableId="devices" direction="horizontal">
                {provided => (
                  <div className="droppable-area" {...provided.droppableProps} ref={provided.innerRef}>
                    {devicesList.map((device, index) => (
                      <Draggable key={device.serialNumber} draggableId={device.serialNumber} index={index}>
                        {(dragProvided, dragSnapshot) => (
                          <div
                            className={`draggable-item ${dragSnapshot.isDragging ? "dragging" : ""}`}
                            {...dragProvided.draggableProps}
                            {...dragProvided.dragHandleProps}
                            ref={dragProvided.innerRef}
                          >
                            {device.name ? (
                              <>
                                <Heading headingLevel={3}>{device.name}</Heading>
                                <Heading headingLevel={4}>
                                  {device.device.info.displayName}{" "}
                                  {device.device.info.product === "Raise" ? device.device.info.keyboardType : null}
                                </Heading>
                              </>
                            ) : (
                              <Heading headingLevel={3}>
                                {device.device.info.displayName}{" "}
                                {device.device.info.product === "Raise" ? device.device.info.keyboardType : null}
                              </Heading>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </DragListWrapper>
        </Modal.Body>
        <Modal.Footer>
          <RegularButton buttonText="Discard changes" styles="outline transp-bg" size="sm" onClick={toggleShow} />
          <RegularButton buttonText="Apply changes" styles="outline gradient" size="sm" onClick={handleSave} />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReOrderDevicesModal;
