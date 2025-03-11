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

import React, { useEffect, useState } from "react";
import { i18n } from "@Renderer/i18n";

import NameModal from "@Renderer/components/molecules/CustomModal/ModalName";
import MacrosMemoryUsage from "@Renderer/modules/Macros/MacrosMemoryUsage";
import CurrentMacroLength from "@Renderer/components/molecules/Indicators/CurrentMacroLength";

import {
  IconDelete,
  IconPen,
  IconClone,
  IconAddNew,
  IconSettings,
  IconArrowUpWithLine,
  IconArrowDownWithLine,
} from "@Renderer/components/atoms/icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Renderer/components/atoms/DropdownMenu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { Button } from "@Renderer/components/atoms/Button";
import { MacrosType } from "@Renderer/types/macros";

interface MacroSelectorProps {
  onSelect: (value: number) => void;
  deleteItem: () => void;
  addItem: (name: string) => void;
  cloneItem: () => void;
  importMacro: () => void;
  exportMacro: () => void;
  updateItem: (name: string) => void;
  itemList: MacrosType[];
  selectedItem: number;
  subtitle: string;
  mem: number;
  tMem: number;
}

const MacroSelector: React.FC<MacroSelectorProps> = ({
  onSelect,
  itemList,
  selectedItem,
  deleteItem,
  addItem,
  cloneItem,
  importMacro,
  exportMacro,
  subtitle,
  mem,
  tMem,
  updateItem,
}) => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow(!show);
  const [showAdd, setShowAdd] = useState(false);
  const toggleShowAdd = () => setShowAdd(!showAdd);
  const [macroLength, setMacroLength] = useState(0);

  useEffect(() => {
    if (
      !Array.isArray(itemList) ||
      selectedItem < 0 ||
      selectedItem >= itemList.length ||
      itemList.length === 0 ||
      !Array.isArray(itemList[selectedItem].actions) ||
      itemList[selectedItem].actions.length === 0
    ) {
      setMacroLength(0);
    } else {
      setMacroLength(itemList[selectedItem].actions.length);
    }
  }, [itemList, selectedItem]);

  const handleSave = (data: string) => {
    toggleShow();
    updateItem(data);
  };

  const handleAdd = (data: string) => {
    toggleShowAdd();
    addItem(data);
  };

  return (
    <div className="flex items-center gap-1">
      <div className="itemListelector dropdownMultipleActions max-w-[350px] min-w-[350px]">
        <Select onValueChange={value => onSelect(parseInt(value, 10))} value={String(selectedItem)}>
          <SelectTrigger variant="combo" className="pr-[80px]">
            {/* dropdownListInner */}
            <div className="flex flex-nowrap items-center">
              {/* dropdownListNumber */}
              <div className="relative self-center w-[34px] text-center pr-[8px] text-[13px] font-semibold tracking-tight text-gray-500 dark:text-gray-200 after:content-[' '] after:absolute after:flex after:w-[1px] after:h-[30px] after:right-0 after:top-1/2 after:transform-style-3d after:translate-y-[-50%] after:bg-gray-200/50 dark:after:bg-gray-500/50">
                {itemList.length === 0 ? "#0" : `#${selectedItem + 1}`}
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
            {itemList.map((item, i) => (
              <SelectItem key={`item-macro-id-${item.id}`} value={String(i)}>
                <em className="itemIndex inline-block w-7 mr-1 text-right not-italic">#{i + 1}.</em>
                {item.name === "" ? i18n.general.noname : item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="absolute top-1 right-[44px]">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="flex w-[36px] h-[36px] rounded-md items-center justify-center shadow-none p-0 text-purple-300 dark:text-white hover:text-purple-300 hover:dark:text-gray-50 bg-gradient-to-r from-gray-100/40 to-gray-25/40 hover:from-gray-70 hover:to-gray-25 dark:bg-none dark:bg-gray-600 dark:hover:bg-gray-500">
                <IconSettings />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-56">
              <DropdownMenuItem className="flex gap-2" onSelect={toggleShow}>
                <IconPen /> {i18n.app.menu.changeName}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2" onSelect={exportMacro}>
                <IconArrowUpWithLine /> {i18n.editor.macros.exportTitle}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2" onSelect={importMacro}>
                <IconArrowDownWithLine /> {i18n.editor.macros.importTitle}
              </DropdownMenuItem>
              <DropdownMenuItem className="flex gap-2" onSelect={cloneItem}>
                <IconClone /> {i18n.editor.macros.clone}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="absolute top-[2px] right-[2px] flex gap-0.5 p-0.5">
          <TooltipProvider delayDuration={50}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button variant="config" size="icon" onClick={deleteItem} className="!w-[36px] !h-[36px]">
                    <IconDelete />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs" side="bottom" size="sm">
                {i18n.general.delete}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <Button variant="secondary" size="icon" onClick={toggleShowAdd}>
                <IconAddNew />
              </Button>
            </div>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs" side="bottom" size="sm">
            {i18n.general.new} macro
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <MacrosMemoryUsage mem={mem} tMem={tMem} />

      <CurrentMacroLength macroLenght={macroLength} />

      {itemList === undefined || itemList.length === 0 || itemList.length <= selectedItem ? (
        ""
      ) : (
        <NameModal
          show={show}
          name={itemList[selectedItem]?.name}
          toggleShow={toggleShow}
          handleSave={handleSave}
          modalTitle="Change macro name"
          labelInput="Macro name"
        />
      )}
      <NameModal
        show={showAdd}
        name=""
        toggleShow={toggleShowAdd}
        handleSave={handleAdd}
        modalTitle="Create new macro name"
        labelInput="Macro name"
      />
    </div>
  );
};

export default MacroSelector;
