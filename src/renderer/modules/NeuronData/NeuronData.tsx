// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
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

import React from "react";
import Styled from "styled-components";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@Renderer/components/atoms/Accordion";
import { Neurons } from "@Types/neurons";
import { IconRobot, IconLayers, IconThunder } from "@Renderer/components/atoms/icons";
import NeuronTitle from "../NeuronTitle";

const Style = Styled.div`
.cardContentNeuronData {
  border-radius: 6px;
  padding: 24px;
  background: ${({ theme }) => theme.styles.neuronData.neuronInfoBackground};
  box-shadow: ${({ theme }) => theme.styles.neuronData.neuronInfoBoxShadow};
}
.accordionNeuronData {
  margin-top: 24px;
}
.accordion .card {
  border: 1px solid ${({ theme }) => theme.styles.neuronData.accordionBorder};
  background: ${({ theme }) => theme.styles.neuronData.accordionCardBackground};
}
.accordion .card .card-header{
  padding: 16px 24px 16px 16px;
  background-color: transparent;
  color: ${({ theme }) => theme.styles.neuronData.accordionCardHeaderColor};
  border-bottom: 1px solid ${({ theme }) => theme.styles.neuronData.accordionCardHeaderBorderColor};
}
.accordion .card .card-body {
  padding: 1.25rem;
  background: ${({ theme }) => theme.styles.neuronData.accordionCardBodyBackground};
}
.accordion .card .card-body ol,
.accordion .card .card-body ul{
  margin-bottom: 0;
}
.accordion .card + .card {
  margin-top: -1px;
}
.accordionHeader {
  display: flex;
  position: relative;
  .plus {
    position: absolute;
    top: 50%;
    right: -12px;
    opacity: ${({ theme }) => theme.styles.neuronData.plusOpacity};
    transform: translate3d(0, -50%, 0);
  }
}
.accordionIcon + .accordionTitle {
  padding-left: 12px;
}
`;

function NeuronData(props: Neurons) {
  const { neurons, selectedNeuron } = props;
  return (
    <Style>
      <div className="cardContentNeuronData">
        <NeuronTitle neuronName={neurons[selectedNeuron].name} neuronID={neurons[selectedNeuron].id} />
        <Accordion
          type="single"
          collapsible
          className="w-full mt-3 border-[1px] border-solid border-gray-50 dark:border-gray-600 bg-transparent dark:bg-gray-900/20 rounded"
        >
          <AccordionItem value="item-1" className="border-b border-solid border-gray-50 dark:border-gray-600">
            <AccordionTrigger className="flex justify-between items-center py-3 px-2 mt-0 mb-[-1px] rounded-none text-purple-200 dark:text-gray-25 border-b border-solid border-gray-50 dark:border-gray-600">
              <div className="flex gap-3 items-center">
                <IconLayers />
                <strong className="font-base">Layers</strong>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-gray-25/20 dark:bg-gray-900/50 px-3 py-3">
              <div>
                <ol className="list-decimal pl-6">
                  {neurons[selectedNeuron].layers.map((layer: { id: number; name: string }) => (
                    <li key={`${layer.id}-${layer.name}`}>{layer.name}</li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2" className="border-0">
            <AccordionTrigger className="flex justify-between items-center py-3 px-2 mt-0 mb-[-1px] rounded-none text-purple-200 dark:text-gray-25 border-b border-solid border-gray-50 dark:border-gray-600">
              <div className="flex gap-3 items-center">
                <IconRobot />
                <strong className="font-base">Macro</strong>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-gray-25/20 dark:bg-gray-900/50 px-3 py-3">
              <div>
                <ol className="list-decimal pl-6">
                  {neurons[selectedNeuron].macros.map(macro => (
                    <li key={`${macro.id}-${macro.name}`}>{macro.name}</li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3" className="border-0">
            <AccordionTrigger className="flex justify-between items-center py-3 px-2 mt-0 mb-[-1px] rounded-none text-purple-200 dark:text-gray-25 border-b border-solid border-gray-50 dark:border-gray-600">
              <div className="flex gap-3 items-center">
                <IconThunder />
                <strong className="font-base">Superkeys</strong>
              </div>
            </AccordionTrigger>
            <AccordionContent className="bg-gray-25/20 dark:bg-gray-900/50 px-3 py-3">
              <div>
                <ol className="list-decimal pl-6">
                  {neurons[selectedNeuron].superkeys.map((superkey: { id: number; name: string }) => (
                    <li key={`${superkey.id}-${superkey.name}`}>{superkey.name}</li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Style>
  );
}

export default NeuronData;
