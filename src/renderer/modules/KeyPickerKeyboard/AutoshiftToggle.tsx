import React from "react";

import { SegmentedKeyType } from "@Renderer/types/layout";
import Heading from "@Renderer/components/atoms/Heading";
import CustomRadioCheckBox from "@Renderer/components/molecules/Form/CustomRadioCheckBox";
import { autoshiftBaseCode, canBeAutoshifted, isAutoshift, toAutoshift } from "../../../hw/autoshift";

interface AutoshiftToggleProps {
  keyCode: SegmentedKeyType;
  onKeySelect: (key: number) => void;
  disabled: boolean;
}

function AutoshiftToggle(props: AutoshiftToggleProps) {
  const { keyCode, onKeySelect, disabled } = props;

  /* Autoshift replaces the whole keycode rather than adding flags, so it is
   * derived from the current code. */
  const currentCode = keyCode.base + keyCode.modified;
  const autoshifted = isAutoshift(currentCode);
  const plainCode = autoshifted ? autoshiftBaseCode(currentCode) : currentCode;
  const autoshiftAvailable = autoshifted || canBeAutoshifted(plainCode);

  const toggleAutoshift = () => onKeySelect(autoshifted ? plainCode : toAutoshift(plainCode));

  return (
    <CustomRadioCheckBox
      label={<div className="pl-0.5">Autoshift</div>}
      onClick={toggleAutoshift}
      checked={autoshifted}
      type="checkbox"
      name="makeAutoshiftable"
      id="makeAutoshiftable"
      disabled={disabled || !autoshiftAvailable}
      tooltip={
        <>
          <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
            Autoshift
          </Heading>
          <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
            Holding the key will output its shifted variant. For example, holding A will output capital A.
          </p>
          <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
            It only works for letters, numbers and punctuation.
          </p>
        </>
      }
      className="autoshiftPicker col-start-1 row-start-2 mt-4"
    />
  );
}

export default AutoshiftToggle;
