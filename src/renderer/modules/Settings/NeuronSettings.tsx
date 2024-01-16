import React from "react";

// React Bootstrap Components
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import i18n from "@Renderer/i18n";

// Own Components
import Title from "@Renderer/component/Title";
import { NeuronSelector } from "@Renderer/component/Select";
import NeuronData from "@Renderer/modules/NeuronData";
import { Neuron } from "@Types/neurons";

// Icons Imports
import { IconNeuronManager } from "@Renderer/component/Icon";

interface NeuronSettingsProps {
  neurons: [Neuron];
  selectedNeuron: number;
  selectNeuron: () => void;
  updateNeuronName: () => void;
  deleteNeuron: () => void;
}

function NeuronSettings(props: NeuronSettingsProps) {
  const { neurons, selectedNeuron, selectNeuron, updateNeuronName, deleteNeuron } = props;

  return (
    <Card className="overflowFix card-preferences mt-4">
      <Card.Title>
        <Title text={i18n.keyboardSettings.neuronManager.header} headingLevel={3} svgICO={<IconNeuronManager />} />
      </Card.Title>
      <Card.Body className="py-0">
        <Form.Group controlId="backupFolder" className="mb-3">
          <NeuronSelector
            onSelect={selectNeuron}
            itemList={neurons}
            selectedItem={selectedNeuron}
            updateItem={updateNeuronName}
            deleteItem={deleteNeuron}
            subtitle={i18n.keyboardSettings.neuronManager.neuronLabel}
          />
          <Row className="mb-4 mt-4">
            <Col>
              {Array.isArray(neurons) && neurons.length > 0 ? (
                <NeuronData neurons={neurons} selectedNeuron={selectedNeuron} />
              ) : (
                ""
              )}
            </Col>
          </Row>
        </Form.Group>
      </Card.Body>
    </Card>
  );
}

export default NeuronSettings;
