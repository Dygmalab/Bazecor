import React, { useMemo } from "react";

// Local components
import Heading from "@Renderer/components/atoms/Heading";
import { i18n } from "@Renderer/i18n";
import { Button } from "@Renderer/components/atoms/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectFixedValue } from "@Renderer/components/atoms/Select";

interface DualFunctionPickerProps {
  keyCode: { base: number; modified: number };
  onKeySelect: (value: number) => void;
  activeTab: string;
  isStandardView: boolean;
}

const DualFunctionPicker = (props: DualFunctionPickerProps) => {
  const { keyCode, onKeySelect, activeTab, isStandardView } = props;
  const modKey = useMemo(
    () => [
      { name: "None ", keynum: 0 },
      { name: "Dual Control ", nameStd: "Ctrl", keynum: 49169 },
      { name: "Dual Shift   ", nameStd: "Shift", keynum: 49425 },
      { name: "Dual Alt     ", nameStd: "Alt", keynum: 49681 },
      { name: "Dual OS  ", nameStd: "OS", keynum: 49937 },
      { name: "Dual Alt Gr  ", nameStd: "Alt Gr.", keynum: 50705 },
    ],
    [],
  );

  const layerKey = useMemo(
    () => [
      { name: "None ", keynum: 0 },
      { name: "Dual Layer 1  ", nameStd: "1", keynum: 51218 },
      { name: "Dual Layer 2  ", nameStd: "2", keynum: 51474 },
      { name: "Dual Layer 3  ", nameStd: "3", keynum: 51730 },
      { name: "Dual Layer 4  ", nameStd: "4", keynum: 51986 },
      { name: "Dual Layer 5  ", nameStd: "5", keynum: 52242 },
      { name: "Dual Layer 6  ", nameStd: "6", keynum: 52498 },
      { name: "Dual Layer 7  ", nameStd: "7", keynum: 52754 },
      { name: "Dual Layer 8  ", nameStd: "8", keynum: 53010 },
    ],
    [],
  );

  const isMod = useMemo(
    () => [224, 225, 226, 227, 228, 229, 230, 231, 2530, 3043].includes(keyCode.base + keyCode.modified),
    [keyCode],
  );

  const isNotNK = useMemo(() => !(keyCode.base + keyCode.modified > 3 && keyCode.base + keyCode.modified < 256), [keyCode]);

  const isNotDF = useMemo(() => !(keyCode.base + keyCode.modified > 49169 && keyCode.base + keyCode.modified < 53266), [keyCode]);

  const disabled = useMemo(() => isMod || (isNotNK && isNotDF), [isMod, isNotNK, isNotDF]);

  // const isMod = [224, 225, 226, 227, 228, 229, 230, 231, 2530, 3043].includes(keyCode.base + keyCode.modified);
  // const isNotNK = !(keyCode.base + keyCode.modified > 3 && keyCode.base + keyCode.modified < 256);
  // const isNotDF = !(keyCode.base + keyCode.modified > 49169 && keyCode.base + keyCode.modified < 53266);
  // const disabled = isMod || (isNotNK && isNotDF);

  const layers = (
    <div className="dualFunctionPickerInner pt-0 pr-[16px] pb-[16px] pl-[16px]">
      <Heading headingLevel={4} renderAs="h4" className="!text-3xxs">
        Add Dual-function
      </Heading>
      <div className="dropdwonsGroup grid grid-cols-2 gap-1">
        <Select
          value={String(keyCode.base + keyCode.modified)}
          onValueChange={value => onKeySelect(parseInt(value, 10) + keyCode.base)}
          disabled={!!(disabled || activeTab === "super")}
        >
          <SelectTrigger
            variant="comboButton"
            size="sm"
            className={`w-full pr-[4px] ${
              keyCode.modified > 0 && layerKey.map(i => i.keynum).includes(keyCode.modified)
                ? "!bg-configButtonActive dark:!bg-configButtonDarkActive bg-purple-200 dark:!bg-purple-300 !border-purple-200 dark:border-none text-white !shadow-buttonConfigLightActive !text-white [&_svg]:!text-white relative after:absolute after:top-[-4px] after:right-[-2px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary/100"
                : ""
            } ${disabled || activeTab === "super" ? "!pointer-events-none !opacity-50" : ""}`}
          >
            <SelectFixedValue label="Layer" />
          </SelectTrigger>
          <SelectContent>
            {layerKey.map((item, index) => (
              <SelectItem
                value={String(item.keynum)}
                disabled={item.keynum === -1 || isMod}
                // eslint-disable-next-line
                key={`itemDualFunctionLayerSelect-${index}`}
                className={`${keyCode.modified > 0 && item.keynum === keyCode.modified ? "!bg-purple-200 !dark:bg-purple-300 !text-gray-25 [&>svg]:!text-gray-25" : ""}`}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={String(keyCode.base + keyCode.modified)}
          onValueChange={value => onKeySelect(parseInt(value, 10) + keyCode.base)}
          disabled={!!(disabled || activeTab === "super")}
        >
          <SelectTrigger
            variant="comboButton"
            size="sm"
            className={`w-full pr-[4px] ${
              keyCode.modified > 0 && modKey.map(i => i.keynum).includes(keyCode.modified)
                ? "!bg-configButtonActive dark:!bg-configButtonDarkActive bg-purple-200 dark:!bg-purple-300 !border-purple-200 dark:border-none text-white !shadow-buttonConfigLightActive !text-white [&_svg]:!text-white relative after:absolute after:top-[-4px] after:right-[-2px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary/100"
                : ""
            } ${disabled || activeTab === "super" ? "!pointer-events-none !opacity-50" : ""}`}
          >
            <SelectFixedValue label="Modifier" />
          </SelectTrigger>
          <SelectContent>
            {modKey.map((item, index) => (
              <SelectItem
                value={String(item.keynum)}
                disabled={item.keynum === -1 || isMod}
                // eslint-disable-next-line
                key={`itemDualFunctionModifierSelect-${index}`}
                className={`${keyCode.modified > 0 && item.keynum === keyCode.modified ? "!bg-purple-200 !dark:bg-purple-300 !text-gray-25 [&>svg]:!text-gray-25" : ""}`}
              >
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const layersStdView = (
    <div className="dualFuntionWrapper flex flex-wrap gap-6">
      <div className="layersButtons">
        <Heading headingLevel={5} renderAs="h5" className="text-ssm">
          {i18n.general.layer}
        </Heading>
        <div className="groupButtons flex gap-1 mt-2 max-w-[auto]">
          {layerKey.map((item: any, index: number) => (
            <Button
              variant="config"
              size="sm"
              // eslint-disable-next-line
              key={`itemDualFunctionLayerSelectStd-${index}`}
              onClick={() => onKeySelect(item.keynum + keyCode.base)}
              selected={!!(keyCode.modified > 0 && item.keynum === keyCode.modified)}
              disabled={disabled || activeTab === "super"}
              className="w-[40px]"
            >
              {item.nameStd ? item.nameStd : item.keynum}
            </Button>
          ))}
        </div>
      </div>
      <div className="modButtons">
        <Heading headingLevel={5} renderAs="h5" className="text-ssm">
          {i18n.general.modifier}
        </Heading>
        <div className="groupButtons flex gap-1 mt-2">
          {modKey.map((item, index) => (
            <Button
              variant="config"
              size="sm"
              // eslint-disable-next-line
              key={`itemDualFunctionModifierSelectStd-${index}`}
              onClick={() => onKeySelect(item.keynum + keyCode.base)}
              selected={!!(keyCode.modified > 0 && item.keynum === keyCode.modified)}
              disabled={disabled || activeTab === "super"}
              className="w-[60px]"
            >
              {item.nameStd ? item.nameStd : item.keynum}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  return <div>{isStandardView ? layersStdView : layers}</div>;
};

export default DualFunctionPicker;
