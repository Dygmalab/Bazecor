import React, { useState, useEffect } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@Renderer/components/atoms/Accordion";
import { i18n } from "@Renderer/i18n";

// Visual components
import Heading from "@Renderer/components/atoms/Heading";
import { IconCheckmark, IconClose } from "@Renderer/components/atoms/icons";
import { Badge } from "@Renderer/components/atoms/Badge";

interface CheckedItem {
  id: number;
  text: string;
  checked?: boolean;
}
interface AccordionFirmwareProps {
  items: CheckedItem[];
}

const AccordionFirmware = ({ items }: AccordionFirmwareProps) => {
  const [passedTasks, SetPassedTasks] = useState(true);
  const [counterTasks, SetCounterTasks] = useState(0);

  const textList = [
    {
      text: i18n.firmwareUpdate.milestones.checkLeftSide,
    },
    {
      text: i18n.firmwareUpdate.milestones.checkLeftSideBL,
    },
    {
      text: i18n.firmwareUpdate.milestones.checkRightSide,
    },
    {
      text: i18n.firmwareUpdate.milestones.checkRightSideBL,
    },
    {
      text: i18n.firmwareUpdate.milestones.checkBackup,
    },
  ];

  useEffect(() => {
    items.forEach((item: CheckedItem, index: number) => {
      if (index === 0) {
        SetCounterTasks(0);
      }
      if ((index === 0 && !item.checked) || (index === 2 && !item.checked)) {
        SetPassedTasks(false);
      }
      if (item.checked) {
        SetCounterTasks(previousValue => previousValue + 1);
      }
    });
    // console.log(passedTasks);
  }, [items, passedTasks]);

  return (
    <div className="w-full mt-4">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="bg-[#fff]/50 dark:bg-gray-700 rounded border-none border-0">
          <AccordionTrigger className="px-2 py-3 bg-transparent bg-dark:bg-black/5 mb-[-1px] hover:no-underline">
            <div className="stepsCompletedStatus flex w-full gap-2 justify-between items-center text-gray-500 dark:text-gray-100">
              <div className="stepsCompletedHeader flex gap-2 items-center">
                {passedTasks ? <IconCheckmark size="sm" /> : ""}
                <Heading
                  headingLevel={5}
                  renderAs="h5"
                  className={`${passedTasks ? "pl-0" : "pl-2"} text-xs tracking-tight mb-0 normal-case`}
                >
                  {passedTasks ? i18n.firmwareUpdate.milestones.readyToStart : i18n.firmwareUpdate.milestones.analyzedTasks}
                </Heading>
              </div>
              <div className="stepsCompleted text-xs tracking-tight flex gap-2 mr-1">
                <Badge variant={`${counterTasks === items.length ? "success" : "warning"}`} size="xs">
                  {counterTasks} {i18n.general.of} {items.length} {i18n.firmwareUpdate.milestones.tasksPassed}
                </Badge>
                {/* <div
                  className={`stepsCompletedLabel py-1 px-2 rounded-sm ${
                    counterTasks === items.length
                      ? "passed text-green-200 bg-green-200/10"
                      : "warning text-orange-200 bg-orange-200/10"
                  }`}
                >
                  {counterTasks} {i18n.general.of} {items.length} {i18n.firmwareUpdate.milestones.tasksPassed}
                </div> */}
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {items.map((item: CheckedItem, index: number) => (
                <div
                  className={`item-checked flex items-center py-1 px-[1em] text-xs gap-2 ${
                    (index === 0 && item.checked === false) || (index === 2 && item.checked === false) ? "error text-red-200" : ""
                  } ${item.checked ? "checked text-green-200" : "warning text-orange-200"}`}
                  key={`itemChecked-${item.id}`}
                >
                  <div className="item-checked--icon w-[10px] [&_svg]:max-w-full text-xs">
                    {item.checked ? <IconCheckmark size="sm" /> : <IconClose />}
                  </div>
                  {textList[index].text}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default AccordionFirmware;
