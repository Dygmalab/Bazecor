import React from "react";
import { KslProps, KeyContentProps, KeyCodeProps } from "@Renderer/types/keys";
import { SelectGenericKeys } from "@Renderer/component/Select";

interface GenericBlockDropdownProps {
  x: number;
  y: number;
  ksl: KslProps;
  content: KeyContentProps;
  onKeyPress: () => void;
  id: string;
  idArray: Array<number> | undefined;
  keyCode: KeyCodeProps;
}

const GenericBlockDropdown = ({ x, y, ksl, content, onKeyPress, id, idArray, keyCode }: GenericBlockDropdownProps) => {
  const kslType = ksl[content.type as keyof typeof ksl];
  const dx = kslType?.outb?.dx || 0;
  const newX = x + dx;

  const dy = kslType?.outb?.dy || 0;
  const newY = y + dy;
  return (
    <foreignObject
      width={ksl[content.type as keyof typeof ksl]?.outb?.x || 0}
      height={ksl[content.type as keyof typeof ksl]?.outb?.y || 0}
      x={newX}
      y={newY}
      style={{ overflow: "visible" }}
    >
      <div xmlns="http://www.w3.org/1999/xhtml">
        <SelectGenericKeys
          onSelect={onKeyPress}
          value={id}
          listElements={idArray}
          content={content}
          keyCode={keyCode}
          disabled={false}
        />
      </div>
    </foreignObject>
  );
};

export default GenericBlockDropdown;
