import React from "react";
import { i18n } from "@Renderer/i18n";
import { IconArrowInBoxUp } from "@Renderer/components/atoms/icons";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";
import { Textarea } from "@Renderer/components/atoms/Textarea";

interface TextTabProps {
  addText: string;
  onTextChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onAddText: () => void;
}

const TextTab: React.FC<TextTabProps> = ({ addText, onTextChange, onAddText }) => (
  <div className="flex flex-wrap h-full">
    <div className="w-full">
      <Callout size="sm" className="mt-2">
        <p>{i18n.editor.macros.textTabs.callout}</p>
      </Callout>
      <Heading headingLevel={4} renderAs="h4" className="text-lg mt-4 w-full">
        {i18n.editor.macros.textTabs.title}
      </Heading>
      <Textarea
        placeholder={i18n.editor.macros.textTabs.placeholder}
        value={addText}
        onChange={onTextChange}
        className="w-full mb-6 mt-2 p-2"
      />
    </div>
    <div className="w-full flex justify-end">
      <Button variant="secondary" onClick={onAddText} iconDirection="right">
        <IconArrowInBoxUp /> {i18n.editor.macros.textTabs.buttonText}
      </Button>
    </div>
  </div>
);

export default TextTab;
