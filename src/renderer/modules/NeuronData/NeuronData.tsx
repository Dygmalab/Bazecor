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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@Renderer/components/ui/accordion";
import { Neurons } from "@Types/neurons";
import NeuronTitle from "../NeuronTitle";
import { IconPlus, IconRobot, IconLayers, IconThunder } from "../../component/Icon";

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
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="accordionHeader">
                <div className="accordionIcon">
                  <IconLayers />
                </div>
                <div className="accordionTitle">Layers</div>
                <span className="plus">
                  <IconPlus />
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <ol>
                  {neurons[selectedNeuron].layers.map((layer: { id: number; name: string }) => (
                    <li key={`${layer.id}-${layer.name}`}>{layer.name}</li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="accordionHeader">
                <div className="accordionIcon">
                  <IconRobot />
                </div>
                <div className="accordionTitle">Macro</div>
                <span className="plus">
                  <IconPlus />
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <ol>
                  {neurons[selectedNeuron].macros.map((macro: { name: string; id: number }) => (
                    <li key={`${macro.id}-${macro.name}`}>{macro.name}</li>
                  ))}
                </ol>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="accordionHeader">
                <div className="accordionIcon">
                  <IconThunder />
                </div>
                <div className="accordionTitle">Superkeys</div>
                <span className="plus">
                  <IconPlus />
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div>
                <ol>
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
