import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@Renderer/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md font-semibold ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90",
        destructive: "bg-red-200 text-gray-25 hover:bg-red-100",
        outline:
          "tw-outline rounded-md transition-all hover:cursor-pointer hover:bg-gray-400/10 dark:hover:bg-gray-400/40 text-gray-25 font-semibold tracking-tight",
        primary:
          "rounded-md bg-linear bg-[length:300%] transition-all relative transform-style-3d before:absolute before:content-[''] before:w-[62px] before:h-[32px] before:bottom-[2px] before:left-[50%] before:bg-linearButton before:opacity-50 before:blur-[2px] before:transform before:translate-x-[-50%] before:translate-y-[0] before:translate-z-[-1px] before:transition-all before:ease-in-out before:duration-300 hover:cursor-pointer hover:bg-right hover:before:blur-lg hover:before:bottom-[-12px] hover:before:opacity-70 hover:before:w-[100px] disabled:bg-buttonDisabled dark:disabled:bg-buttonDisabledDark disabled:text-gray-300 dark:disabled:text-gray-300 disabled:before:content-none disabled:bg-right disabled:cursor-not-allowed disabled:opacity-100 disabled:pointer-events-none text-gray-25 font-semibold tracking-tight",
        primaryIcon:
          "flex items-center gap-4 justify-start rounded-md py-4 px-6 bg-linear bg-[length:300%] transition-all relative transform-style-3d before:absolute before:content-[''] before:w-[62px] before:h-[32px] before:bottom-[2px] before:left-[50%] before:bg-linearButton before:opacity-50 before:blur-[2px] before:transform before:translate-x-[-50%] before:translate-y-[0] before:translate-z-[-1px] before:transition-all before:ease-in-out before:duration-300 hover:cursor-pointer hover:bg-right hover:before:blur-lg hover:before:bottom-[-12px] hover:before:opacity-70 hover:before:w-[95%] disabled:bg-buttonDisabled dark:disabled:bg-buttonDisabledDark disabled:text-gray-300 dark:disabled:text-gray-300 disabled:before:content-none disabled:bg-right disabled:cursor-not-allowed disabled:opacity-100 disabled:pointer-events-none text-gray-25 font-semibold tracking-tight text-left min-w-36 [&_p]:text-xs [&_p]:text-gray-300 [&_p]:dark:text-gray-100 [&_.buttonIcon]:basis-8",
        secondary:
          "tw-secondary tw-text-primary rounded-md bg-[length:300%] transition-all relative isolate transform-style-3d after:absolute after:content-[''] after:w-[62px] after:h-[32px] after:bottom-[2px] after:left-[50%] after:bg-linearButton after:opacity-50 after:blur-[2px] after:transform after:translate-x-[-50%] after:translate-y-[0] after:translate-z-[-1px] after:transition-all after:ease-in-out after:duration-300 hover:cursor-pointer hover:bg-right hover:after:blur-lg hover:after:bottom-[-12px] hover:after:opacity-70 hover:after:w-[100px] aria-disabled:bg-buttonDisabled aria-disabled:text-gray-300 aria-disabled:after:content-none aria-disabled:bg-right aria-disabled:cursor-not-allowed font-semibold tracking-tight",
        purple:
          "rounded-md bg-purple-200 dark:bg-purple-300 transition-all relative transform-style-3d before:absolute before:content-[''] before:w-[62px] before:h-[32px] before:bottom-[2px] before:left-[50%] before:bg-purple-200 before:opacity-50 before:blur-[2px] before:transform before:translate-x-[-50%] before:translate-y-[0] before:translate-z-[-1px] before:transition-all before:ease-in-out before:duration-300 hover:cursor-pointer hover:bg-right hover:before:blur-lg hover:before:bottom-[-12px] hover:before:opacity-70 hover:before:w-[100px] aria-disabled:bg-buttonDisabled aria-disabled:text-gray-300 aria-disabled:before:content-none aria-disabled:bg-right aria-disabled:cursor-not-allowed text-gray-25 font-semibold tracking-tight",
        ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
        dropdownLink:
          "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-[14px] text-gray-400 hover:text-gray-400 dark:text-gray-50 dark:hover:text-gray-50 text-sm outline-none focus:bg-gray-25 focus:text-gray-400 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:focus:bg-gray-400/20 dark:focus:text-gray-50 hover:bg-gray-25 dark:hover:bg-gray-400/20 data-[state=checked]:bg-purple-200 dark:data-[state=checked]:bg-purple-300 data-[state=checked]:text-gray-25",
        supportive:
          "flex items-center gap-4 justify-start rounded-md py-4 px-6 border-[1px] border-solid border-gray-100 hover:border-gray-200/50 dark:border-gray-600 dark:hover:border-gray-400 bg-gray-100/25 hover:bg-gray-50/80 dark:bg-gray-600/50 hover:dark:bg-gray-600/80 transition-all text-left min-w-36 [&_p]:text-xs [&_p]:text-gray-300 [&_p]:dark:text-gray-100 [&_.buttonIcon]:basis-8",
        config:
          "border-regular shadow-buttonConfigLight dark:shadow-buttonConfig hover:buttonConfigLightHover dark:hover:shadow-buttonConfigHover text-ssm py-[8px] px-[16px] text-gray-500 hover:text-gray-600 dark:text-gray-25 bg-configButton dark:bg-configButtonDark hover:bg-configButtonHover dark:hover:bg-configButtonDarkHover aria-pressed:!bg-configButtonActive dark:aria-pressed:!bg-configButtonDarkActive aria-pressed:bg-purple-200 dark:aria-pressed:!bg-purple-300 aria-pressed:!border-purple-200 dark:aria-pressed:!border-none aria-pressed:text-white aria-pressed:!shadow-buttonConfigLightActive",
        short:
          "rounded-md transition-all border-[1px] border-solid border-gray-50 text-gray-500 hover:text-gray-500 bg-gradient-to-r from-gray-25 to-gray-50 dark:text-gray-25 dark:from-gray-600 dark:to-gray-700 dark:border-none",
      },
      size: {
        default: "px-6 py-[14px] text-base",
        xs: "px-4 py-[7px] text-3xxs",
        md: "px-6 py-[14px]",
        sm: "rounded-md px-3 py-2.5 text-sm",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10 aspect-square",
        iconXS: "h-9 w-9 aspect-square",
      },
      iconDirection: {
        none: "",
        left: "flex gap-4",
        right: "flex gap-4 flex-row-reverse",
      },
    },
    compoundVariants: [
      // Applied via:
      //   `button({ intent: "primary", size: "medium" })`
      {
        variant: "supportive",
        size: "md",
        className: "px-6 py-3",
      },
      {
        variant: "secondary",
        size: "icon",
        className: "before:px-[1rem] after:w-[32px] hover:after:w-[32px]",
      },
      {
        variant: "config",
        size: "icon",
        className: "p-[2px] aspect-square",
      },
      {
        variant: "config",
        size: "iconXS",
        className: "p-[2px] aspect-square",
      },
    ],
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ReactNode | null;
  children: React.ReactNode;
  iconDirection?: "left" | "right" | "none";
  selected?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, icon, iconDirection = "none", children, selected = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, iconDirection, className }))}
        ref={ref}
        {...props}
        aria-pressed={selected}
      >
        {icon && <div className="buttonIcon flex flex-shrink-0 flex-grow-0 [&_svg]:w-full">{icon}</div>}
        {children}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
