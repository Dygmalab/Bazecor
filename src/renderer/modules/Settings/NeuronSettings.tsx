import React from "react";

// React Bootstrap Components
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import i18n from "@Renderer/i18n";

// Own Components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import { NeuronSelector } from "@Renderer/component/Select";
import NeuronData from "@Renderer/modules/NeuronData";
import { Neuron } from "@Types/neurons";

// Icons Imports
import { IconNeuronManager } from "@Renderer/component/Icon";

interface NeuronSettingsProps {
  neurons: Neuron[];
  selectedNeuron: number;
  selectNeuron: (value: string) => void;
  updateNeuronName: (data: string) => void;
  deleteNeuron: () => void;
}

function NeuronSettings(props: NeuronSettingsProps) {
  const { neurons, selectedNeuron, selectNeuron, updateNeuronName, deleteNeuron } = props;

  return (
    <Card className="max-w-2xl mx-auto" variant="default">
      <CardHeader>
        <CardTitle>
          <IconNeuronManager /> {i18n.keyboardSettings.neuronManager.header}
        </CardTitle>
      </CardHeader>
      <CardContent>
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
      </CardContent>
    </Card>
  );
}

export default NeuronSettings;
