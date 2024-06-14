/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
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

import { i18n } from "@Renderer/i18n";

// Own Components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";
import { NeuronSelector } from "@Renderer/components/molecules/CustomSelect";
import NeuronData from "@Renderer/modules/NeuronData";
import { Neuron } from "@Types/neurons";

// Icons Imports
import { IconNeuronManager } from "@Renderer/components/atoms/icons";
import { NeuronSettingsProps } from "@Renderer/types/preferences";

function NeuronSettings(props: NeuronSettingsProps) {
  const { neurons, selectedNeuron, selectNeuron, applyNeurons, updateNeuronName, deleteNeuron } = props;
  const [localSelection, setLocalSelection] = useState(selectedNeuron);

  const localSelectNeuron = (value: string) => {
    setLocalSelection(parseInt(value, 10));
  };

  const localUpdateNeuronName = (data: string) => {
    const neuronsToChangeName = neurons;
    neuronsToChangeName[localSelection].name = data;
    if (selectedNeuron === localSelection) {
      updateNeuronName(data);
    } else {
      applyNeurons(neuronsToChangeName);
    }
  };

  return (
    <Card className="mt-3 max-w-2xl mx-auto" variant="default">
      <CardHeader>
        <CardTitle>
          <IconNeuronManager /> {i18n.keyboardSettings.neuronManager.header}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3">
          <NeuronSelector
            onSelect={localSelectNeuron}
            itemList={neurons}
            selectedItem={localSelection}
            updateItem={localUpdateNeuronName}
            deleteItem={deleteNeuron}
            subtitle={i18n.keyboardSettings.neuronManager.neuronLabel}
          />
          <div className="mb-4 mt-4 w-full">
            <div className="w-full">
              {Array.isArray(neurons) && neurons.length > 0 ? (
                <NeuronData neurons={neurons} selectedNeuron={localSelection} />
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default NeuronSettings;
