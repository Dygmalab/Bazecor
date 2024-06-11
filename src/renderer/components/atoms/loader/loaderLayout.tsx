import React from "react";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import Heading from "@Renderer/components/atoms/Heading";
import log from "electron-log/renderer";

interface LoaderLayoutProps {
  steps: number;
}
const LoaderLayout = ({ steps }: LoaderLayoutProps) => {
  // log.info(steps);

  const contextualStep = [
    { step: 1, text: "Loading Neuron information" },
    { step: 2, text: "Retrieving stored Neuron data" },
    { step: 3, text: "Restoring backup if flashing failed" },
    { step: 4, text: "Loading default Keymap layers" },
    { step: 5, text: "Loading custom Keymap layers" },
    { step: 6, text: "Loading ColorMap and Palette" },
    { step: 7, text: "Loading Macros" },
    { step: 8, text: "Loading Superkeys" },
    { step: 9, text: "Preparing Layout for render" },
    { step: 10, text: "Ready!" },
  ];

  return (
    <div className="flex flex-col justify-center items-center w-full h-screen gap-3">
      <LogoLoader />
      <Heading headingLevel={4} renderAs="paragraph-sm" className="">
        {contextualStep[steps].text}
      </Heading>
      <div className="max-w-32 w-full relative h-1 rounded-sm bg-gray-300 dark:bg-gray-600 overflow-hidden">
        <div className="absolute left-0 top-0 h-1 bg-purple-200 transition-all flex" style={{ width: `${10 * steps}%` }}>
          <span className="sr-only">{contextualStep[steps].text}</span>
        </div>
      </div>
    </div>
  );
};

export default LoaderLayout;
