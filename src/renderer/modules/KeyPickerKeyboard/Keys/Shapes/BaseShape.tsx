import React from "react";
import { KslProps, KeyContentProps } from "@Renderer/types/keys";

interface BaseShapeProps {
  x: number;
  y: number;
  ksl: KslProps;
  content: KeyContentProps;
  onClick: () => void;
}

const BaseShape = ({ x, y, ksl, content, onClick }: BaseShapeProps) => {
  const kslType = ksl[content.type as keyof typeof ksl];
  const dx = kslType?.outb?.dx || 0;
  const newX = x + dx;

  const dy = kslType?.outb?.dy || 0;
  const newY = y + dy;
  return (
    <>
      <g filter="url(#filter0_d_2211_181319)">
        <rect
          x={newX}
          y={newY}
          width={ksl[content.type as keyof typeof ksl]?.outb?.x || 0}
          height={ksl[content.type as keyof typeof ksl]?.outb?.y || 0}
          rx="5"
          className="baseKey"
          onClick={onClick}
        />
      </g>
      <rect
        x={newX}
        y={newY}
        width={ksl[content.type as keyof typeof ksl]?.outb?.x || 0}
        height={ksl[content.type as keyof typeof ksl]?.outb?.y || 0}
        onClick={onClick}
        rx="5"
        fill="url(#paint_gradient)"
        fillOpacity={0.1}
        className="shapeKey"
      />
    </>
  );
};

export default BaseShape;
