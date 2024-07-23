import React from "react";
import Styled from "styled-components";
import log from "electron-log/renderer";
import { i18n } from "@Renderer/i18n";

import CustomRadioCheckBox from "@Renderer/components/molecules/Form/CustomRadioCheckBox";
import { IconArrowInBoxUp, IconMediaShuffle } from "@Renderer/components/atoms/icons";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

const Styles = Styled.div`
.form-control {
    color: ${({ theme }) => theme.styles.form.inputColor};
    background: ${({ theme }) => theme.styles.form.inputBackgroundColor};
    border-color: ${({ theme }) => theme.styles.form.inputBorderSolid};
    font-weight: 600;
    padding: 16px;
    height: auto;
    &:focus {
        background: ${({ theme }) => theme.styles.form.inputBackgroundColorActive};
        border-color: ${({ theme }) => theme.styles.form.inputBorderActive};
        box-shadow: none;
    }
    margin-bottom: 0;
}
.input-group {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    .input-group-text {
        margin-left: -1px;
        font-weight: 600;
        padding: 16px 18px;
        color: ${({ theme }) => theme.styles.form.inputGroupColor};
        background: ${({ theme }) => theme.styles.form.inputGroupBackground};
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-color: ${({ theme }) => theme.styles.form.inputBorderSolid};
    }

}

.formWrapper {
  display: flex;
  flex: 0 0 100%;
  .customCheckbox + .customCheckbox {
    margin-left: 16px;
  }
}
.inputGroupRandom {
  
  .inputMin {
    border-right-color: transparent;
    &:focus {
      border-right: none;
    }
  }
  .inputMax {
    border-left-color: transparent;
    &:focus {
      border-left: none;
    }
  }
  .form-control {
    background-color: ${({ theme }) => theme.styles.form.inputGroup.background};
  }
}
`;

interface DelayTabProps {
  onAddDelay: (value: number, type: number) => void;
  onAddDelayRnd: (valueMin: number, valueMax: number, type: number) => void;
}

interface DelayTabState {
  fixedSelected: boolean;
  fixedValue: number;
  randomValue: { min: number; max: number };
}

class DelayTab extends React.Component<DelayTabProps, DelayTabState> {
  constructor(props: DelayTabProps) {
    super(props);

    this.state = {
      fixedSelected: true,
      fixedValue: 0,
      randomValue: { min: 0, max: 0 },
    };
  }

  setFixedSelected = () => {
    this.setState({ fixedSelected: true });
  };

  setRandomSelected = () => {
    this.setState({ fixedSelected: false });
  };

  updateFixed = (e: React.FormEvent<HTMLInputElement>) => {
    const value = parseInt(e.currentTarget.value, 10);
    this.setState({ fixedValue: value > 65535 ? 65535 : value });
  };

  updateRandomMin = (e: React.FormEvent<HTMLInputElement>) => {
    const { randomValue } = this.state;
    let valueMin = parseInt(e.currentTarget.value, 10);
    valueMin = valueMin > 65535 ? 65535 : valueMin;
    if (valueMin > randomValue.max) {
      randomValue.max = valueMin;
    }
    randomValue.min = valueMin;
    this.setState({ randomValue });
  };

  updateRandomMax = (e: React.FormEvent<HTMLInputElement>) => {
    const { randomValue } = this.state;
    let valueMax = parseInt(e.currentTarget.value, 10);
    valueMax = valueMax > 65535 ? 65535 : valueMax;
    if (valueMax < randomValue.min) {
      randomValue.min = valueMax;
    }
    randomValue.max = valueMax;
    this.setState({ randomValue });
  };

  addDelay = () => {
    const { fixedSelected, fixedValue, randomValue } = this.state;
    const { onAddDelay, onAddDelayRnd } = this.props;
    log.info("add delay", fixedSelected, fixedValue, randomValue);
    if (fixedSelected) {
      onAddDelay(fixedValue, 2);
    } else {
      onAddDelayRnd(randomValue.min, randomValue.max, 1);
    }
    // clean state
    this.setState({
      fixedSelected: true,
      fixedValue: 0,
      randomValue: { min: 0, max: 0 },
    });
  };

  render() {
    const { fixedSelected, fixedValue, randomValue } = this.state;
    return (
      <Styles className="flex flex-wrap h-[inherit]">
        <div className="tabContentWrapper">
          <Heading renderAs="h4" headingLevel={4} className="flex w-full">
            {i18n.editor.macros.delayTabs.title}
          </Heading>
          <div className="formWrapper">
            <CustomRadioCheckBox
              label="Fixed value"
              checked={fixedSelected}
              onClick={this.setFixedSelected}
              type="radio"
              name="addDelay"
              id="addFixedDelay"
              className=""
              disabled={false}
              tooltip={undefined}
            />
            <CustomRadioCheckBox
              label="Random value"
              checked={!fixedSelected}
              onClick={this.setRandomSelected}
              type="radio"
              name="addDelay"
              id="addRandomDelay"
              tooltip="You can configure a maximum value and minimum value for each time the macro is executed Bazecor choose a delay between this range."
              className=""
              disabled={false}
            />
          </div>
          <div className="inputsWrapper mt-3">
            {fixedSelected ? (
              <div className="inputGroupFixed">
                <div className="input-group max-w-full relative flex flex-wrap w-full items-stretch">
                  <input
                    placeholder={i18n.editor.macros.delayTabs.title}
                    min={0}
                    max={65535}
                    type="number"
                    onChange={(e: any) => {
                      this.updateFixed(e);
                    }}
                    value={fixedValue}
                    className="form-control"
                  />
                  <div className="ml-[-1px] py-[1rem] px-4 font-semibold text-gray-300 dark:text-gray-300 bg-gray-25 dark:bg-gray-900/20">
                    ms
                  </div>
                </div>

                <p className="description mt-2 text-sm w-full text-gray-400 dark:text-gray-200">
                  {i18n.editor.macros.delayTabs.minMaxDescription}
                </p>
              </div>
            ) : (
              <div className="inputGroupRandom relative">
                <div className="input-group max-w-full relative flex flex-wrap w-full items-stretch">
                  <input
                    className="inputMin form-control w-[120px]"
                    placeholder="Min."
                    min={0}
                    type="number"
                    onChange={(e: any) => {
                      this.updateRandomMin(e);
                    }}
                    value={randomValue.min}
                  />
                  <input
                    className="inputMax form-control  w-[120px] !pl-9"
                    placeholder="Max"
                    min={1}
                    type="number"
                    onChange={(e: any) => {
                      this.updateRandomMax(e);
                    }}
                    value={randomValue.max}
                  />
                  <div className="ml-[-1px] py-[1rem] px-4 font-semibold text-gray-300 dark:text-gray-300 bg-gray-25 dark:bg-gray-900/20">
                    ms
                  </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -mt-4 -ml-4 rounded w-8 h-8 p-1 z-10 bg-gray-25 dark:bg-gray-800/20 origin-center -translate-y-2/4 -translate-x-2/4">
                  <IconMediaShuffle />
                </div>
                <p className="description mt-2 text-sm w-full text-gray-400 dark:text-gray-200">
                  {i18n.editor.macros.delayTabs.minMaxDescription}
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="tabSaveButton">
          <Button variant="secondary" iconDirection="right" onClick={this.addDelay}>
            <IconArrowInBoxUp /> {i18n.editor.macros.textTabs.buttonText}
          </Button>
        </div>
      </Styles>
    );
  }
}

export default DelayTab;
