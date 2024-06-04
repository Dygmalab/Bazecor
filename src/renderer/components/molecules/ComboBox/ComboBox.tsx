import * as React from "react";
// import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { ChevronDown, Check } from "lucide-react";

import { cn } from "@Renderer/utils";
import { Button } from "@Renderer/components/atoms/Button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@Renderer/components/atoms/Command";
import { Popover, PopoverContent, PopoverTrigger } from "@Renderer/components/atoms/Popover";

function ComboBox({ listElements, onChange, value }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-[1px] py-[12px] pl-[16px] pr-[10px] border-solid border-gray-100/60 dark:border-gray-600 hover:border-purple-200 data-[state=open]:border-purple-200 dark:data-[state=open]:border-purple-300 hover:dark:border-purple-300 bg-white/50 dark:bg-gray-900/20 hover:border-purple-100 [&_svg]:text-gray-300 [&_svg]:dark:text-gray-300"
        >
          {value ? (
            <div className="flex gap-3 items-center">
              {listElements.find(item => item.value === value)?.icon && (
                <img className="h-6 w-6" src={listElements.find(item => item.value === value)?.icon} />
              )}
              {listElements.find(item => item.value === value)?.text}
            </div>
          ) : (
            "Select language"
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search language..." className="h-9" />
          <CommandList>
            <CommandEmpty>No item found.</CommandEmpty>
            <CommandGroup>
              {listElements.map(item => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                  className="flex gap-3"
                >
                  {item.icon && <img className="h-6 w-6" src={item.icon} alt={`${item.text}`} />}
                  {item.text}
                  <Check className={cn("ml-auto h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ComboBox;
