import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown, ChevronUp } from "lucide-react";
import { IconArrowsSmallSeparating } from "@Renderer/components/atoms/icons";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const selectVariants = cva("flex w-full items-center justify-between rounded-md", {
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
  compoundVariants: [
    {
      variant: "comboButton",
      size: "sm",
      className: "h-auto",
    },
  ],
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

const Select = SelectPrimitive.Root;

const SelectGroup = SelectPrimitive.Group;

const SelectValue = SelectPrimitive.Value;

interface SelectFixedValueProps {
  label: string;
}

const SelectFixedValue = React.forwardRef<HTMLDivElement, SelectFixedValueProps>(({ label, ...props }, forwardedRef) => {
  const internalLabel: string = label;
  return (
    <div {...props} ref={forwardedRef}>
      {internalLabel}
    </div>
  );
});

const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & VariantProps<typeof selectVariants>
>(({ className, variant, size, children, ...props }, ref) => (
  <SelectPrimitive.Trigger ref={ref} className={cn(selectVariants({ variant, size, className }))} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <IconArrowsSmallSeparating size="sm" />
    </SelectPrimitive.Icon>
  </SelectPrimitive.Trigger>
));
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

const SelectScrollUpButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollUpButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollUpButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollUpButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronUp className="h-4 w-4" />
  </SelectPrimitive.ScrollUpButton>
));
SelectScrollUpButton.displayName = SelectPrimitive.ScrollUpButton.displayName;

const SelectScrollDownButton = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.ScrollDownButton>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.ScrollDownButton>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.ScrollDownButton
    ref={ref}
    className={cn("flex cursor-default items-center justify-center py-1", className)}
    {...props}
  >
    <ChevronDown className="h-4 w-4" />
  </SelectPrimitive.ScrollDownButton>
));
SelectScrollDownButton.displayName = SelectPrimitive.ScrollDownButton.displayName;

const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = "popper", ...props }, ref) => (
  <SelectPrimitive.Portal>
    <SelectPrimitive.Content
      ref={ref}
      className={cn(
        "relative z-[1201] max-h-96 min-w-[8rem] overflow-hidden rounded-md  bg-[#ffffff] text-slate-950 shadow-md dark:bg-gray-600 dark:text-slate-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ",
        position === "popper" &&
          "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className,
      )}
      position={position}
      {...props}
    >
      <SelectScrollUpButton />
      <SelectPrimitive.Viewport
        className={cn(
          "p-1 flex flex-col gap-0.5",
          position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
        )}
      >
        {children}
      </SelectPrimitive.Viewport>
      <SelectScrollDownButton />
    </SelectPrimitive.Content>
  </SelectPrimitive.Portal>
));
SelectContent.displayName = SelectPrimitive.Content.displayName;

const SelectLabel = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Label ref={ref} className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)} {...props} />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-[14px] text-gray-400 hover:text-gray-400 dark:text-gray-50 dark:hover:text-gray-50 text-sm outline-none focus:bg-gray-25 focus:text-gray-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-400/20 dark:focus:text-gray-50 hover:bg-gray-25 dark:hover:bg-gray-400/20 data-[state=checked]:bg-purple-200 dark:data-[state=checked]:bg-purple-300 data-[state=checked]:text-gray-25",
      className,
    )}
    {...props}
  >
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>

    <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
      <SelectPrimitive.ItemIndicator>
        <Check className="h-4 w-4" />
      </SelectPrimitive.ItemIndicator>
    </span>
  </SelectPrimitive.Item>
));
SelectItem.displayName = SelectPrimitive.Item.displayName;

const SelectSeparator = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator ref={ref} className={cn("-mx-1 my-1 h-px bg-slate-100 dark:bg-slate-800", className)} {...props} />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectFixedValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
};
