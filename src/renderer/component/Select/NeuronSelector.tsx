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

import React, { useState } from "react";
import Styled from "styled-components";
import Dropdown from "react-bootstrap/Dropdown";
import { i18n } from "@Renderer/i18n";
import { ButtonSettings } from "@Renderer/component/Button";
import { IconArrowsSmallSeparating, IconPen, IconDelete } from "@Renderer/component/Icon";

import { NameModal } from "@Renderer/component/Modal"; // Imported custom modal component
import { NeuronSelectorProps } from "@Renderer/types/preferences";

const Style = Styled.div`

`;
const NeuronSelector = (props: NeuronSelectorProps) => {
  const { onSelect, itemList, selectedItem, updateItem, deleteItem, subtitle } = props;
  const [show, setShow] = useState(false);

  const toggleShow = () => {
    setShow(!show);
  };

  const handleSave = (data: string) => {
    toggleShow();
    updateItem(data);
  };

  const handleDelete = (event: any) => {
    deleteItem(parseInt(event.target.value, 10));
  };

  let localItemList = Array.isArray(itemList) ? itemList : [];

  return (
    <Style>
      <div className="itemListelector dropdownMultipleActions">
        <Dropdown onSelect={onSelect} className="dropdownList">
          <Dropdown.Toggle className="toggler neuronToggler">
            {localItemList.length == 0 ? (
              i18n.keyboardSettings.neuronManager.defaultNeuron
            ) : (
              <div className="dropdownListInner">
                <div className="dropdownListNumber">#{selectedItem + 1}</div>
                <div className="dropdownListItem">
                  <div className="dropdownListItemInner">
                    <div className="dropdownListItemLabel">{subtitle}</div>
                    <div className="dropdownListItemSelected">
                      {localItemList[selectedItem].name == "" ? i18n.general.noname : localItemList[selectedItem].name}
                    </div>
                    <span className="caret">
                      <IconArrowsSmallSeparating />
                    </span>
                  </div>
                </div>
              </div>
            )}
          </Dropdown.Toggle>
          <Dropdown.Menu className="dropdownMenu">
            {localItemList?.map((item, iter) => (
              <Dropdown.Item eventKey={`${iter}`} key={`${item.id}`} className={iter === selectedItem ? "active" : ""}>
                {item.name == "" ? i18n.general.noname : item.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
        <div className="dropdownActions">
          <Dropdown drop="down" className="dropdownActionsList">
            <Dropdown.Toggle className="button-settings">
              <ButtonSettings />
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdownMenu">
              <Dropdown.Item onClick={toggleShow}>
                <div className="dropdownInner">
                  <div className="dropdownIcon">
                    <IconPen />
                  </div>
                  <div className="dropdownItem">Change name</div>
                </div>
              </Dropdown.Item>
              <Dropdown.Item onClick={handleDelete}>
                <div className="dropdownInner">
                  <div className="dropdownIcon">
                    <IconDelete />
                  </div>
                  <div className="dropdownItem">Delete</div>
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
      <NameModal
        show={show}
        name={localItemList[selectedItem]?.name}
        toggleShow={toggleShow}
        handleSave={handleSave}
        modalTitle={i18n.keyboardSettings.neuronManager.changeLayerTitle}
        labelInput={i18n.keyboardSettings.neuronManager.inputLabel}
      />
    </Style>
  );
};

export default NeuronSelector;
