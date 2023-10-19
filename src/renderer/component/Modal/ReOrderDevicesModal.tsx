import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { RegularButton } from "@Renderer/component/Button";
import Heading from "@Renderer/component/Heading";

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

import Styled from "styled-components";
import { IconDragAndDrop } from "../Icon";

const DragListWrapper = Styled.div`
  position: relative;
  .droppable-area {
    display: flex;
    padding: 16px;
    overflow: auto;
    position: relative;
    background-color: ${({ theme }) => theme.styles.modal.modalDevices.bodyBackground};
    .draggable-item {
      width: 224px;
      flex: 0 0 224px;
      margin: 0 4px;
      padding: 16px;
      border-radius: 8px;
      color: ${({ theme }) => theme.styles.modal.modalDevices.titleColor};
      background-color: ${({ theme }) => theme.styles.modal.modalDevices.cardBackground};
      border: 1px dashed ${({ theme }) => theme.styles.modal.modalDevices.cardBorderColor};
    }
  }
  .drag-icon {
    width: 24px;
    height: 24px;
    border-radius: 2px;
    cursor: grab;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 0.1875rem;
    background: ${({ theme }) => theme.styles.modal.modalDevices.dragBackground};
    color: ${({ theme }) => theme.styles.modal.modalDevices.dragIconColor};
    margin-bottom: 16px;
  }
  .drag-content {
    width: 100%;
    h3 {
      color: ${({ theme }) => theme.styles.modal.modalDevices.titleColor};
      font-size: 1em;
    }
    h4 {
      color: ${({ theme }) => theme.styles.modal.modalDevices.subTitleColor};
      font-size: 0.8em;
    }
    p {
      color: ${({ theme }) => theme.styles.modal.modalDevices.contentColor};
      font-size: 0.75em;
      margin-top: 1rem;
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
          </DragListWrapper>
        </Modal.Body>
        <Modal.Footer>
          <RegularButton buttonText="Discard changes" styles="outline transp-bg" size="sm" onClick={toggleShow} />
          <RegularButton buttonText="Apply changes" styles="outline gradient" size="sm" onClick={() => handleSave(devicesList)} />
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ReOrderDevicesModal;
