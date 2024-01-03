import React from "react";
import { Tab } from "@headlessui/react";

interface TabItemProps {
  icon?: React.ReactNode;
  text: string;
}

const TabItem = ({ icon, text }: TabItemProps) => (
  <Tab as="div">
    {({ selected }) => (
      /* Use the `selected` state to conditionally style the selected tab. */
      <button
        type="button"
        className={`w-full flex items-center gap-2 rounded font-semibold text-sm mt-0 text-left px-2 py-2.5 relative transition-all isolate before:absolute before:w-[32px] before:h-[68px] before:right-[-24px] before:content-[''] before:bg-lightAccent before:opacity-0 before:transition-opacity before:duration-200 before:z-index-[-1] dark:text-gray-100 after:content-[''] after:h-[24px] after:w-[3px] after:absolute after:rounded-tr-[3px] after:rounded-br-[3px] after:opacity-0 after:transition-opacity after:duration-200 after:bg-gradient-to-t after:from-secondary after:to-primary after:top-[50%] after:translate-y-[-50%] after:right-[-27px] ${
          selected
            ? "bg-gray-25/80 dark:bg-gray-900/60 before:opacity-50 dark:before:opacity-100 after:opacity-100 text-purple-200 dark:text-gray-25"
            : "hover:dark:bg-gray-600/30 hover:bg-gray-25/10 hover:dark:text-gray-25 text-gray-400 dark:text-gray-100"
        }`}
      >
        {icon && icon}
        {text}
      </button>
    )}
  </Tab>
);

export default TabItem;
