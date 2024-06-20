import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { IconArrowsSmallSeparating } from "@Renderer/components/atoms/icons";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const popoverTriggerVariants = cva("flex w-full items-center justify-between rounded-md", {
  variants: {
    variant: {
      default:
        "border-[1px] py-[8px] pl-[16px] pr-[10px] border-solid border-gray-100/60 dark:border-gray-600 hover:border-purple-200 data-[state=open]:border-purple-200 dark:data-[state=open]:border-purple-300 hover:dark:border-purple-300 bg-white/50 dark:bg-gray-900/20 hover:border-purple-100 [&_svg]:text-gray-300 [&_svg]:dark:text-gray-300",
      combo:
        "border-[1px] py-[6px] pl-[8px] pr-[2px] border-solid border-gray-100/60 dark:border-gray-600 hover:border-purple-200 data-[state=open]:border-purple-200 dark:data-[state=open]:border-purple-300 hover:dark:border-purple-300 bg-white/50 dark:bg-gray-900/20 hover:border-purple-100 pr-[40px] [&_svg]:text-gray-300 [&_svg]:dark:text-gray-300",
      comboButton:
        "border-regular shadow-buttonConfigLight dark:shadow-buttonConfig hover:buttonConfigLightHover dark:hover:shadow-buttonConfigHover text-ssm py-[8px] px-[16px] text-gray-500 hover:text-gray-600 dark:text-gray-25 bg-configButton dark:bg-configButtonDark hover:bg-configButtonHover dark:hover:bg-configButtonDarkHover aria-pressed:!bg-configButtonActive dark:aria-pressed:!bg-configButtonDarkActive aria-pressed:bg-purple-200 dark:aria-pressed:!bg-purple-300 aria-pressed:!border-purple-200 dark:aria-pressed:!border-none aria-pressed:text-white aria-pressed:!shadow-buttonConfigLightActive [&_svg]:text-gray-300 [&_svg]:dark:text-gray-300",
    },
    size: {
      default: "h-[44px]",
      sm: "h-8 px-2.5 text-[11px] rounded",
      lg: "h-11 px-5",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

interface PopoverButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  active?: boolean;
}

const PopoverButton = React.forwardRef<HTMLDivElement, PopoverButtonProps>(
  ({ children, disabled = false, active = false, ...props }, forwardedRef) => (
    <div
      {...props}
      ref={forwardedRef}
      className={`w-full flex justify-between items-center border-regular rounded shadow-buttonConfigLight dark:shadow-buttonConfig hover:buttonConfigLightHover dark:hover:shadow-buttonConfigHover text-2xxs py-[8px] pl-2.5 pr-[4px] text-gray-500 hover:text-gray-600 dark:text-gray-25 bg-configButton dark:bg-configButtonDark hover:bg-configButtonHover dark:hover:bg-configButtonDarkHover aria-pressed:!bg-configButtonActive dark:aria-pressed:!bg-configButtonDarkActive aria-pressed:bg-purple-200 dark:aria-pressed:!bg-purple-300 aria-pressed:!border-purple-200 dark:aria-pressed:!border-none aria-pressed:text-white aria-pressed:!shadow-buttonConfigLightActive [&_svg]:text-gray-300 [&_svg]:dark:text-gray-300 ${active ? "!bg-configButtonActive dark:!bg-configButtonDarkActive bg-purple-200 dark:!bg-purple-300 !border-purple-200 dark:border-none text-white !shadow-buttonConfigLightActive !text-white [&_svg]:!text-white relative after:absolute after:top-[-4px] after:right-[-2px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary/100" : ""} ${disabled ? "!pointer-events-none !opacity-50" : ""}`}
    >
      <div className="flex">{children}</div>
      <IconArrowsSmallSeparating size="sm" />
    </div>
  ),
);

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 min-w-72 rounded-md border-none bg-gray-25 dark:bg-gray-600 p-[8px] shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverButton };
