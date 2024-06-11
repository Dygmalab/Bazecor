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
import Dropdown from "react-bootstrap/Dropdown";
import { i18n } from "@Renderer/i18n";

import NameModal from "@Renderer/components/molecules/CustomModal/ModalName";

import { IconDelete, IconKeyboard, IconFlashlight } from "@Renderer/components/atoms/icons";
import ToggleGroupKeyboardViewMode from "@Renderer/components/molecules/CustomToggleGroup/ToggleGroupKeyboardViewMode";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@Renderer/components/atoms/DropdownMenu";
import {
  IconArrowsSmallSeparating,
  IconPen,
  IconClone,
  IconArrowUpWithLine,
  IconArrowDownWithLine,
  IconFileDownload,
  IconSettings,
} from "../Icon";

const Style = Styled.div`
display: flex;
align-items: center;
.dropdownMultipleActions {
    min-width: 290px;
    max-width: 290px;
    .dropdownActions {
      display: flex;
      flex-wrap: nowrap;
      border-radius: 3px;
      height: 48px;
    }
}
.dropdownListItemSelected {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.dropdownListItemInner {
    padding-right: 64px;
    .caret {
      right: 16px;
    }
}
.dropdown-menu {
    min-width: 268px;
}
.itemIndex {
    display: inline-block;
    width: 28px;
    margin-right: 6px;
    text-align: right;
}
.button.outline.gradient {
  align-self: center;
  padding: 12px;
  padding-right: 18px;
  margin-left: 8px;
  .buttonFX {
    width: 50px;
  }
}
.button-config {
  background: transparent;
  padding: 12px 8px;
  border: none;
  box-shadow: none;
}
.dropdown-divider {
    border-top-color: ${({ theme }) => theme.styles.dropdown.dropdownMenu.dropdownDivider};
}
`;
class LayerSelector extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      show: false,
      showAdd: false,
    };
  }

  toggleShow = () => {
    this.setState({ show: !this.state.show });
  };

  toggleShowAdd = () => {
    this.setState({ showAdd: !this.state.showAdd });
  };

  handleSave = data => {
    this.toggleShow();
    this.props.updateItem(data);
  };

  handleAdd = data => {
    this.toggleShowAdd();
    this.props.addItem(data);
  };

  render() {
    const {
      onSelect,
      itemList,
      selectedItem,
      subtitle,
      exportFunc,
      importFunc,
      copyFunc,
      clearFunc,
      editModeActual,
      editModeFunc,
      exportToPdf,
    } = this.props;
    const { show, showAdd } = this.state;
    const layoutsMode = [
      {
        name: i18n.editor.keys,
        tooltip: i18n.editor.keysEditor,
        value: "keyboard",
        icon: <IconKeyboard />,
      },
      {
        name: i18n.editor.color.color,
        tooltip: i18n.editor.color.colorEditor,
        value: "color",
        icon: <IconFlashlight />,
      },
    ];
    return (
      <Style>
        <div className="itemListelector dropdownMultipleActions">
          <Dropdown onSelect={value => onSelect(parseInt(value))} value={selectedItem} className="dropdownList">
            <Dropdown.Toggle className="toggler neuronToggler">
              <div className="dropdownListInner">
                <div className="dropdownListNumber">{itemList.length == 0 ? "#0" : `#${parseInt(selectedItem) + 1}`}</div>
                <div className="dropdownListItem">
                  <div className="dropdownListItemInner">
                    <div className="dropdownListItemLabel">{subtitle}</div>
                    <div className="dropdownListItemSelected">
                      {itemList == undefined || itemList.length == 0 || itemList.length <= selectedItem
                        ? i18n.dialog.loading
                        : itemList[selectedItem].name == ""
                          ? i18n.general.noname
                          : itemList[selectedItem].name}
                    </div>
                    <span className="caret">
                      <IconArrowsSmallSeparating />
                    </span>
                  </div>
                </div>
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu className="dropdownMenu">
              {itemList.map((item, iter) => (
                <Dropdown.Item eventKey={iter} key={`item-${iter}`} className={iter === selectedItem ? "active" : ""}>
                  <span className="itemIndex">#{iter + 1}.</span>
                  {item.name == "" ? i18n.general.noname : item.name}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
          <div className="dropdownActions">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex w-[36px] h-[36px] items-center justify-center shadow-none rounded-sm p-0 text-purple-300 dark:text-gray-100 hover:text-purple-100 hover:dark:text-gray-50 dark:bg-gray-600 dark:hover:bg-gray-500">
                  <IconSettings />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem className="flex gap-2" onSelect={this.toggleShow}>
                  <IconPen /> {i18n.app.menu.changeName}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2" onSelect={exportFunc}>
                  <IconArrowUpWithLine /> {i18n.editor.layers.exportTitle}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2" onSelect={importFunc}>
                  <IconArrowDownWithLine /> {i18n.editor.layers.importTitle}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2" onSelect={copyFunc}>
                  <IconClone /> {i18n.editor.layers.copyFrom}
                </DropdownMenuItem>
                <DropdownMenuItem className="flex gap-2" onSelect={clearFunc}>
                  <IconDelete /> {i18n.editor.layers.clearLayer}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex gap-2" onSelect={exportToPdf}>
                  <IconFileDownload /> {i18n.editor.layers.exportToPdf}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            {/* <Dropdown drop="down" align="end" className="dropdownActionsList">
              <Dropdown.Toggle className="button-settings">
                <ButtonSettings />
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdownMenu">
                <Dropdown.Item onClick={this.toggleShow}>
                  <div className="dropdownInner">
                    <div className="dropdownIcon">
                      <IconPen />
                    </div>
                    <div className="dropdownItem">{i18n.app.menu.changeName}</div>
                  </div>
                </Dropdown.Item>

                <Dropdown.Item onClick={exportFunc}>
                  <div className="dropdownInner">
                    <div className="dropdownIcon">
                      <IconArrowUpWithLine />
                    </div>
                    <div className="dropdownItem">{i18n.editor.layers.exportTitle}</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={importFunc}>
                  <div className="dropdownInner">
                    <div className="dropdownIcon">
                      <IconArrowDownWithLine />
                    </div>
                    <div className="dropdownItem">{i18n.editor.layers.importTitle}</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={copyFunc}>
                  <div className="dropdownInner">
                    <div className="dropdownIcon">
                      <IconClone />
                    </div>
                    <div className="dropdownItem">{i18n.editor.layers.copyFrom}</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Item onClick={clearFunc}>
                  <div className="dropdownInner">
                    <div className="dropdownIcon">
                      <IconDelete />
                    </div>
                    <div className="dropdownItem">{i18n.editor.layers.clearLayer}</div>
                  </div>
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={exportToPdf}>
                  <div className="dropdownInner">
                    <div className="dropdownIcon">
                      <IconFileDownload />
                    </div>
                    <div className="dropdownItem">{i18n.editor.layers.exportToPdf}</div>
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
          </div>
        </div>

        <ToggleGroupKeyboardViewMode value={editModeActual} onValueChange={editModeFunc} />

        {itemList === undefined || itemList.length === 0 || itemList.length <= selectedItem ? (
          ""
        ) : (
          <NameModal
            show={show}
            name={itemList[selectedItem].name}
            toggleShow={this.toggleShow}
            handleSave={this.handleSave}
            modalTitle="Change layer name"
            labelInput="Layer name"
          />
        )}
      </Style>
    );
  }
}

export default LayerSelector;
