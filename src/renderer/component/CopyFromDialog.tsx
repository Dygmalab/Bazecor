// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from "react";
import Styled from "styled-components";

// React Bootstrap components
import Modal from "react-bootstrap/Modal";
import ListGroup from "react-bootstrap/ListGroup";
import { i18n } from "@Renderer/i18n";
import { LayerType } from "@Renderer/types/neurons";

import { RegularButton } from "./Button";
import Title from "./Title";

const Styles = Styled.div`
.list-group-item {
  border-radius: none;
}
.list-group-item:first-child {
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
}
.list-group-item:last-child {
  border-bottom-left-radius: .25rem;
  border-bottom-right-radius: .25rem;
}
.listitem {
  background-color: ${({ theme }) => theme.styles.listGroup.listItem.background};
  color: ${({ theme }) => theme.styles.listGroup.listItem.color};
  font-weight: 410;
  margin-top: 1px;
  transition: 300ms background ease-in-out;
  border: none;
  span {
    display: none;
    font-size: 80%;
    margin-left: 8px
  }
  &:focus,
  &:hover {
    background-color: ${({ theme }) => theme.styles.listGroup.listItem.backgroundHover};
    outline: none;
    box-shadow: none;
  }
}
.disabled {
  background-color: ${({ theme }) => theme.styles.listGroup.listItem.backgroundDisabled};
  color: ${({ theme }) => theme.styles.listGroup.listItem.colorDisabled};
}
.selected {
  background-color: ${({ theme }) => theme.styles.listGroup.listItem.backgroundSelected};
  color: ${({ theme }) => theme.styles.listGroup.listItem.colorSelected};
  span {
    display: inline-block;
    color: ${({ theme }) => theme.styles.listGroup.listItem.colorSelectedSpan};
  }
  &:focus,
  &:hover {
    background-color: ${({ theme }) => theme.styles.listGroup.listItem.backgroundSelected};
    color: ${({ theme }) => theme.styles.listGroup.listItem.colorSelected};
  }
}
`;

interface CopyFromDialogProps {
  open: boolean;
  onCancel: () => void;
  onCopy: (layer: number) => void;
  layers: LayerType[];
  currentLayer: number;
}

export function CopyFromDialog(props: CopyFromDialogProps) {
  const { open, onCancel, onCopy, layers, currentLayer } = props;
  const [selectedLayer, setSelectedLayer] = useState(-1);
  return (
    <Modal backdrop="static" show={open} onHide={onCancel} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Styles>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.editor.layers.copyFrom}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Title text={i18n.editor.pleaseSelectLayer} headingLevel={4} />
          <ListGroup variant="flush">
            {layers.map(layer => (
              <ListGroup.Item
                className={`listitem ${layer.id === currentLayer ? "disabled" : ""} ${
                  layer.id === selectedLayer ? "selected" : ""
                }`}
                key={layer.id}
                action
                disabled={layer.id === currentLayer}
                onClick={() => {
                  setSelectedLayer(layer.id);
                }}
              >
                {layer.name} {layer.id === selectedLayer ? <span>{i18n.editor.layers.layerToCopy}</span> : ""}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Modal.Body>
        <Modal.Footer>
          <RegularButton
            buttonText={i18n.dialog.cancel}
            styles="outline transp-bg"
            size="sm"
            onClick={() => {
              setSelectedLayer(-1);
              onCancel();
            }}
          />
          <RegularButton
            buttonText={i18n.dialog.ok}
            styles="outline gradient"
            size="sm"
            onClick={() => {
              const layer = selectedLayer;
              setSelectedLayer(-1);
              onCopy(layer);
            }}
          />
        </Modal.Footer>
      </Styles>
    </Modal>
  );
}
