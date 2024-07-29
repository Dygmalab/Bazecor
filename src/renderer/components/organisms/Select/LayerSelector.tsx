// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  Dygmalab, Inc.
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
import { i18n } from "@Renderer/i18n";

import NameModal from "@Renderer/components/molecules/CustomModal/ModalName";

import {
  IconDelete,
  IconPen,
  IconClone,
  IconArrowUpWithLine,
  IconArrowDownWithLine,
  IconSettings,
} from "@Renderer/components/atoms/icons";
import ToggleGroupKeyboardViewMode from "@Renderer/components/molecules/CustomToggleGroup/ToggleGroupKeyboardViewMode";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@Renderer/components/atoms/DropdownMenu";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";

interface ItemList {
  id: number;
  name: string;
}

const LayerSelector: React.FC<any> = ({
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
  updateItem,
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);

  const handleSave = (data: string) => {
    toggleShow();
    updateItem(data);
  };

  // For future implementations use exportToPdf function
  // eslint-disable-next-line
  const exportToPdfInternal = exportToPdf;

  return (
    <div className="flex items-center gap-1">
      <div className="itemListelector dropdownMultipleActions max-w-[290px] min-w-[290px]">
        <Select onValueChange={value => onSelect(parseInt(value, 10))} value={selectedItem}>
          <SelectTrigger variant="combo">
            {/* dropdownListInner */}
            <div className="flex flex-nowrap items-center">
              {/* dropdownListNumber */}
              <div className="relative self-center w-[34px] text-center pr-[8px] text-[13px] font-semibold tracking-tight text-gray-500 dark:text-gray-200 after:content-[' '] after:absolute after:flex after:w-[1px] after:h-[30px] after:right-0 after:top-1/2 after:transform-style-3d after:translate-y-[-50%] after:bg-gray-200/50 dark:after:bg-gray-500/50">
                {itemList.length === 0 ? "#0" : `#${parseInt(selectedItem, 10) + 1}`}
              </div>
              {/* dropdownListItem style={{ width: "calc(100% - 42px)" }} */}
              <div className="flex flex-wrap pl-[12px] leading-[1.25em] text-left">
                {/* dropdownListItemInner */}
                <div className="relative w-full leading-[1em]">
                  {/* dropdownListItemLabel */}
                  <div className="tracking-tight text-[11px] text-gray-200 dark:text-gray-200">{subtitle}</div>
                  {/* dropdownListItemSelected */}
                  <div className="max-w-[200px] whitespace-nowrap overflow-hidden text-ellipsis text-[13px] text-gray-600 dark:text-gray-100 [&_em]:hidden">
                    <SelectValue placeholder="Theme" />
                  </div>
                  {/* <span className="caret right-4 text-gray-300 dark:text-gray-300">
                    <IconArrowsSmallSeparating />
                  </span> */}
                </div>
              </div>
            </div>
          </SelectTrigger>
          <SelectContent>
            {itemList.map((item: ItemList, i: string) => (
              <SelectItem key={`item-layer-id-${item.id}`} value={i}>
                <em className="itemIndex inline-block w-7 mr-1 text-right not-italic">#{i + 1}.</em>
                {item.name === "" ? i18n.general.noname : item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="absolute top-1 right-1">
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
              {/* 
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex gap-2" onSelect={exportToPdf}>
                <IconFileDownload /> {i18n.editor.layers.exportToPdf}
              </DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <ToggleGroupKeyboardViewMode value={editModeActual} onValueChange={editModeFunc} />

      {itemList === undefined || itemList.length === 0 || itemList.length <= selectedItem ? (
        ""
      ) : (
        <NameModal
          show={show}
          name={itemList[selectedItem].name}
          toggleShow={toggleShow}
          handleSave={handleSave}
          modalTitle="Change layer name"
          labelInput="Layer name"
        />
      )}
    </div>
  );
};

export default LayerSelector;
