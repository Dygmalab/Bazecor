import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@Renderer/components/ui/accordion";
import i18n from "../../i18n";

// Visual components
import Title from "../Title";
import { IconCheckmarkSm, IconChevronDown, IconCloseXs } from "../Icon";

const Style = Styled.div`
width: 100%;
margin-top: 32px;
.stepsCompletedStatus {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: ${({ theme }) => theme.styles.accordionFirmware.colorTitle};
    h5 {
        margin-bottom: 0;
        letter-spacing: -0.03em;
        text-transform: none;
        font-size: 0.85rem;
    }
    .stepsCompleted,
    .stepsCompletedHeader {
        display: flex;
        align-items: center;
        grid-gap: 8px;
    }
    .stepsCompleted {
        font-size: 0.7rem;
        letter-spacing: -0.03em;
        small {
            max-width: 16px;
            svg {
                max-width: 100%;
                opacity: 0.5;
            }
        }
    }
    .stepsCompletedLabel {
        padding: 4px 8px;
        color: ${({ theme }) => theme.colors.brandSuccess};
        background-color: rgba(0,206,201,0.1);
        border-radius: 3px;
        &.warning {
          color: ${({ theme }) => theme.colors.brandWarning};
          background-color: rgba(255,159,67,0.1);
        }
    }
}
.card {
    border-radius: 6px;
    background-color: ${({ theme }) => theme.styles.accordionFirmware.background};
}
.card-header {
    margin-bottom: 0;
    background-color: ${({ theme }) => theme.styles.accordionFirmware.headerBackground};
}
.item-checked {
    display: flex;
    padding: 0.25rem 1.25rem;
    color: ${({ theme }) => theme.colors.gray100};
    grid-gap: 8px;
    font-size: 0.7rem;
    &.checked {
        color: ${({ theme }) => theme.colors.brandSuccess};
    }
    &.warning {
      color: ${({ theme }) => theme.colors.brandWarning};
    }
    &.error,
    &.error.warning {
        color: ${({ theme }) => theme.colors.brandPrimary};
    }
    .item-checked--icon {
        width: 10px;
        svg {
            max-width: 100%;
        }
    }
}
`;

const AccordionFirmware = ({ items }: any) => {
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
    items.forEach((item: any, index: number) => {
      if (index === 0) {
        SetCounterTasks(-1);
      }
      if ((index === 0 && !item.checked) || (index === 2 && !item.checked)) {
        SetPassedTasks(false);
      }
      if (item.checked) {
        SetCounterTasks(previousValue => previousValue + 1);
      }
    });
    console.log(passedTasks);
  }, [items, passedTasks]);

  return (
    <Style>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>
            <div className="stepsCompletedStatus">
              <div className="stepsCompletedHeader">
                {passedTasks ? <IconCheckmarkSm /> : ""}
                <Title
                  text={passedTasks ? i18n.firmwareUpdate.milestones.readyToStart : i18n.firmwareUpdate.milestones.analyzedTasks}
                  headingLevel={5}
                />
              </div>
              <div className="stepsCompleted">
                <div className={`stepsCompletedLabel ${counterTasks === items.length ? "passed" : "warning"}`}>
                  {counterTasks} {i18n.general.of} {items.length} {i18n.firmwareUpdate.milestones.tasksPassed}
                </div>{" "}
                <small>
                  <IconChevronDown />
                </small>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div>
              {items.map((item: any, index: number) => (
                <div
                  className={`item-checked ${
                    (index === 0 && item.checked === false) || (index === 2 && item.checked === false) ? "error" : ""
                  } ${item.checked ? "checked" : "warning"}`}
                  key={`itemChecked-${item.id}`}
                >
                  <div className="item-checked--icon">{item.checked ? <IconCheckmarkSm /> : <IconCloseXs />}</div>
                  {textList[index].text}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Style>
  );
};

export default AccordionFirmware;
