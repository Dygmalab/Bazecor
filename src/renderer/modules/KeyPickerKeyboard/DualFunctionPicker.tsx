import React, { useState, useMemo } from "react";
import Styled from "styled-components";

// React Components
import Dropdown from "react-bootstrap/Dropdown";

// Local components
import Heading from "@Renderer/components/atoms/Heading";
import { i18n } from "@Renderer/i18n";
import { Button } from "@Renderer/components/atoms/Button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";

const Style = Styled.div`
.dualFunctionPickerInner {
  padding: 0 16px 16px 16px;
  h4 {
    font-size: 12px;
  }
}
.dropdwonsGroup {
  display: grid;
  grid-gap: 4px;
  grid-template-columns: 1fr 1fr;
}
.dropdown-toggle.btn.btn-primary {
  padding: 8px;
}
.dropdown-toggle::after {
  right: 8px;
}
.dropdownInner, .dropdownItemSelected {
  font-size: inherit;
  .badge-circle {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(254,0,124,1);
    position: absolute;
    right: -10px;
    top: -12px;
    font-size: 11px;
  }
}
.dropdownItemSelected {
  position: relative;
}
.active .dropdownItemSelected .badge-circle {
  opacity: 1;
}
.dualFuntionWrapper {
  display: flex;
  grid-gap: 24px;
  h5 {
    text-transform: none;
    font-weight: 600;
    font-size: 13px;
    letter-spacing: -0.03em;
  }
}
.groupButtons {
  max-width: auto;
}
.layersButtons {
    .button-config {
      width: 40px;
    }
}
.modButtons {
  .button-config {
    width: 60px;
  }
}
`;

const DualFunctionPicker = ({ keyCode, onKeySelect, activeTab, isStandardView }) => {
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
      { name: "Dual Layer 6  ", keynum: 52498 },
      { name: "Dual Layer 7  ", keynum: 52754 },
      { name: "Dual Layer 8  ", keynum: 53010 },
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
    <div className="dualFunctionPickerInner">
      <Heading headingLevel={4} renderAs="h4">
        Add Dual-function
      </Heading>
      <div className="dropdwonsGroup">
        <Dropdown
          onSelect={value => onKeySelect(parseInt(value, 10) + keyCode.base)}
          className={`custom-dropdown ${
            keyCode.modified > 0 && layerKey.map(i => i.keynum).includes(keyCode.modified) ? "active" : ""
          }`}
        >
          <Dropdown.Toggle id="dropdown-custom" className="button-config-style" disabled={!!(disabled || activeTab === "super")}>
            <div className="dropdownItemSelected">
              <div className="dropdownItem">Layer</div>
              <div className="badge-circle" />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {layerKey.map(item => (
              <Dropdown.Item
                eventKey={item.keynum}
                key={`itemDualFunctionLayer-${item.keynum}`}
                disabled={item.keynum === -1 || isMod}
                className={`${keyCode.modified > 0 && item.keynum === keyCode.modified ? "active" : ""}`}
              >
                <div className="dropdownInner">
                  <div className="dropdownItem">{item.name}</div>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown
          onSelect={value => onKeySelect(parseInt(value, 10) + keyCode.base)}
          className={`custom-dropdown ${
            keyCode.modified > 0 && modKey.map(i => i.keynum).includes(keyCode.modified) ? "active" : ""
          }`}
          disabled={disabled || activeTab === "super"}
        >
          <Dropdown.Toggle id="dropdown-custom" className="button-config-style" disabled={!!(disabled || activeTab === "super")}>
            <div className="dropdownItemSelected">
              <div className="dropdownItem">Modifier</div>
              <div className="badge-circle" />
            </div>
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {modKey.map(item => (
              <Dropdown.Item
                eventKey={item.keynum}
                key={`itemDualFunctionMod-${item.keynum}`}
                disabled={item.keynum === -1 || isMod}
                className={`${keyCode.modified > 0 && item.keynum === keyCode.modified ? "active" : ""}`}
              >
                <div className="dropdownInner">
                  <div className="dropdownItem">{item.name}</div>
                </div>
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );

  const layersStdView = (
    <div className="dualFuntionWrapper">
      <div className="layersButtons">
        <Heading headingLevel={5} renderAs="h5">
          {i18n.general.layer}
        </Heading>
        <div className="groupButtons flex gap-1 mt-2">
          {layerKey.map(item => {
            if (item.nameStd === undefined) return;
            return (
              <Button
                variant="config"
                size="sm"
                key={`itemDualFunctionLayers-${item.keynum}`}
                onClick={() => onKeySelect(parseInt(item.keynum, 10) + keyCode.base)}
                selected={!!(keyCode.modified > 0 && item.keynum === keyCode.modified)}
                disabled={disabled || activeTab === "super"}
              >
                {item.nameStd}
              </Button>
            );
          })}
        </div>
      </div>
      <div className="modButtons">
        <Heading headingLevel={5}>{i18n.general.modifier}</Heading>
        <div className="groupButtons flex gap-1 mt-2">
          {modKey.map(item => {
            if (item.nameStd === undefined) return;
            return (
              <Button
                variant="config"
                size="sm"
                key={`itemDualFunctionMod-${item.keynum}`}
                onClick={() => onKeySelect(parseInt(item.keynum, 10) + keyCode.base)}
                selected={!!(keyCode.modified > 0 && item.keynum === keyCode.modified)}
                disabled={disabled || activeTab === "super"}
              >
                {item.nameStd}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return <Style>{isStandardView ? layersStdView : layers}</Style>;
};

export default DualFunctionPicker;
