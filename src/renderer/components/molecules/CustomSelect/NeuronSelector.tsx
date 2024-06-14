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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Renderer/components/atoms/DropdownMenu";
import { i18n } from "@Renderer/i18n";
import { IconDelete, IconPen, IconSettings } from "@Renderer/components/atoms/icons";

import NameModal from "@Renderer/components/molecules/CustomModal/ModalName";
import { NeuronSelectorProps } from "@Renderer/types/preferences";

const NeuronSelector = (props: NeuronSelectorProps) => {
  const { onSelect, itemList, selectedItem, updateItem, deleteItem } = props;
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

  const localItemList = Array.isArray(itemList) ? itemList : [];

  return (
    <>
      <div className="itemListelector dropdownMultipleActions">
        <Select defaultValue={localItemList.length > 0 ? String(selectedItem + 1) : String(0)} onValueChange={onSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={i18n.keyboardSettings.neuronManager.defaultNeuron} />
          </SelectTrigger>
          <SelectContent>
            {localItemList.map((item, iter) => (
              <SelectItem value={String(iter)} key={`neuronsListManager-${item.id}`}>
                {item.name === "" ? i18n.general.noname : item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="dropdownActions">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex w-[36px] h-[36px] items-center justify-center shadow-none rounded-sm p-0 text-purple-300 dark:text-gray-100 hover:text-purple-300 hover:dark:text-gray-50 bg-gradient-to-r from-gray-100/40 to-gray-25/40 hover:from-gray-70 hover:to-gray-25 dark:bg-none dark:bg-gray-600 dark:hover:bg-gray-500">
                <IconSettings />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuItem className="flex gap-2" onSelect={toggleShow}>
                <IconPen /> {i18n.app.menu.changeName}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2" onSelect={handleDelete}>
                <IconDelete /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
    </>
  );
};

export default NeuronSelector;
