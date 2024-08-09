/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@Renderer/utils";

const sliderVariants = cva(
  "relative flex w-full touch-none select-none items-center py-4 [&_.track]:relative [&_.track]:h-2 [&_.track]:w-full [&_.track]:grow [&_.track]:overflow-hidden [&_.track]:rounded-full [&_.range]:absolute [&_.range]:h-full group",
  {
    variants: {
      variant: {
        default:
          "[&_.track]:bg-gray-50 [&_.track]:dark:bg-gray-400 [&_.range]:bg-purple-200 [&_.range]:dark:bg-purple-300 [&_.thumb]:shadow-[0_4px_12px_0px_rgba(97,32,234,0.9)] [&_.thumb]:border-gray-25 [&_.thumb]:bg-purple-200 [&_.thumb]:dark:bg-purple-300",
        alert:
          "[&_.track]:bg-gray-50 [&_.track]:dark:bg-gray-400 [&_.range]:bg-primary/100 [&_.range]:dark:bg-primary/100 [&_.thumb]:shadow-[0_4px_12px_0px_rgba(254,0,124,0.9)] [&_.thumb]:border-gray-25 [&_.thumb]:bg-primary/100 [&_.thumb]:dark:bg-primary/100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
  dataPlacement?: "top" | "bottom";
}

const Slider = React.forwardRef<React.ElementRef<typeof SliderPrimitive.Root>, SliderProps & VariantProps<typeof sliderVariants>>(
  ({ className, variant, dataPlacement = "top", ...props }, ref) => {
    const internalValue = props.value || props.defaultValue;
    return (
      <SliderPrimitive.Root ref={ref} className={cn(sliderVariants({ variant }), className)} {...props}>
        <SliderPrimitive.Track className="track ">
          <SliderPrimitive.Range className="range" />
        </SliderPrimitive.Track>
        <SliderPrimitive.Thumb className="thumb block h-4 w-4 rounded-full border-[3px] ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
          <span
            className={`thumbValue absolute bg-gray-25 dark:bg-gray-600 text-gray-600 dark:text-gray-25 shadow-lg text-ssm rounded-sm p-[6px] left-[50%] translate-x-[-50%] transition-all opacity-0 group-hover:opacity-100 ${dataPlacement === "top" ? "top-[-36px]" : "bottom-[-36px]"}`}
          >
            {internalValue}
          </span>
        </SliderPrimitive.Thumb>
      </SliderPrimitive.Root>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
