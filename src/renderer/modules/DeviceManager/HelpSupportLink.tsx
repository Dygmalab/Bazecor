import React from "react";
import { IconBugWarning } from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";

import { i18n } from "@Renderer/i18n";

const HelpSupportLink = () => (
  <div className="w-full flex justify-end mt-auto pb-4">
    <a
      href="https://dygma.com/pages/contact-us"
      className="help-wrapper flex flex-nowrap gap-2 max-w-[264px] group [&_svg]:mt-1 [&_svg]:flex-shrink-0 [&_svg]:flex-grow-0 [&_svg]:flex-basis-[24px] [&_svg]:text-gray-500 [&_svg]:dark:text-gray-100 no-underline hover:no-underline"
    >
      <IconBugWarning />
      <div className="help-warning--content">
        <Heading renderAs="h4" headingLevel={4} className="transition-colors text-gray-600 dark:text-gray-25">
          {i18n.deviceManager.needHelpTitle}
        </Heading>
        <p className="text-sm text-gray-200 dark:text-gray-200 group-hover:text-gray-400 dark:group-hover:text-gray-50">
          {i18n.deviceManager.needHelpDescription}
        </p>
      </div>
    </a>
  </div>
);

export default HelpSupportLink;
