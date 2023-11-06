import React from "react";
import { KslProps, KeyContentProps } from "@Renderer/types/keys";

interface TextProps {
  x: number;
  y: number;
  icon?: React.ReactNode;
  iconx?: number;
  icony?: number;
  iconsize?: number | string;
  iconpresent?: boolean;
  centered?: boolean;
  content?: KeyContentProps;
  ksl: KslProps;
  onClick: () => void;
  selected?: boolean;
  disabled?: boolean;
  keyTextDisabledColor: string;
  keyTextColor: string;
  keyActiveSubTextColor: string;
  keySubTextColor: string;
}

const Text = ({
  x,
  y,
  iconpresent,
  icon,
  iconx,
  icony,
  iconsize,
  centered,
  onClick,
  selected,
  content,
  ksl,
  disabled,
  keyTextDisabledColor,
  keyTextColor,
  keyActiveSubTextColor,
  keySubTextColor,
}: TextProps) => {
  const kslType = ksl[content.type as keyof typeof ksl];

  const letterDX = kslType?.text?.letter?.dx || 0;
  const newlettereDX = x + letterDX;
  const letterDDX = kslType?.text?.letter?.ddx || 0;
  const newlettereDDX = x + letterDDX;

  const textADX = kslType?.text?.a?.dx || 0;
  const newTextADX = x + textADX;
  const textBDX = kslType?.text?.b?.dx || 0;
  const newTextBDX = x + textBDX;
  const textCDX = kslType?.text?.c?.dx || 0;
  const newTextCDX = x + textCDX;
  const textDDX = kslType?.text?.d?.dx || 0;
  const newTextDDX = x + textDDX;

  const letterDY = kslType?.text?.letter?.dy || 0;
  const newlettereDY = y + letterDY;
  const letterDDY = kslType?.text?.letter?.ddy || 0;
  const newlettereDDY = y + letterDDY + 8;

  const textADY = kslType?.text?.a?.dy || 0;
  const newTextADY = y + textADY;
  const textBDY = kslType?.text?.b?.dy || 0;
  const newTextBDY = y + textBDY;
  const textCDY = kslType?.text?.c?.dy || 0;
  const newTextCDY = y + textCDY;
  const textDDY = kslType?.text?.d?.dy || 0;
  const newTextDDY = y + textDDY;

  const iconPositionX = kslType?.icon?.x || 0;
  const newIconPositionX = x + iconPositionX;
  const iconPositionY = kslType?.icon?.y || 0;
  const newIconPositionY = y + iconPositionY;

  return (
    <>
      {!iconpresent && content.type === "title" ? (
        <>
          <text
            x={newlettereDX}
            y={newlettereDY}
            onClick={onClick}
            fontSize={kslType?.text?.letter?.fs || 13}
            fontWeight={600}
            className="contentPrimary"
          >
            {content.first}
          </text>
          <text
            x={newlettereDX}
            y={newlettereDY}
            onClick={onClick}
            fontSize={kslType?.text?.letter?.fss || 13}
            fontWeight={600}
            className="contentSeconday"
          >
            {content.second}
          </text>
        </>
      ) : (
        ""
      )}
      {!iconpresent &&
      centered &&
      content.type !== "title" &&
      content.type !== "specialBlockDropdown" &&
      content.type !== "genericBlockDropdown" ? (
        <>
          <text
            x={newlettereDX}
            y={newlettereDY}
            onClick={onClick}
            fontSize={kslType?.text?.letter?.fs || 13}
            fill={disabled ? keyTextDisabledColor : keyTextColor}
            fontWeight={600}
            textAnchor="middle"
            className="contentFirst"
          >
            {content.first}
          </text>
          <text
            x={newlettereDDX}
            y={newlettereDDY}
            onClick={onClick}
            fontSize={kslType?.text?.letter?.fss || 13}
            fontWeight={600}
            fill={selected ? keyActiveSubTextColor : keySubTextColor}
            textAnchor="middle"
            className="contentSeconday"
          >
            {content.second}
          </text>
        </>
      ) : (
        ""
      )}
      {!iconpresent && !centered && content.type !== "title" ? (
        <>
          <text
            x={newTextADX}
            y={newTextADY}
            onClick={onClick}
            fontSize={kslType?.text?.a?.fs || 11}
            fontWeight={600}
            className="contentFirst"
          >
            {content.first}
          </text>
          <text
            x={newTextBDX}
            y={newTextBDY}
            onClick={onClick}
            fontSize={kslType?.text?.b?.fs || 11}
            fontWeight={600}
            className="contentSecondary"
          >
            {content.second}
          </text>
          <text
            x={newTextCDX}
            y={newTextCDY}
            onClick={onClick}
            fontSize={kslType?.text?.c?.fs || 11}
            fontWeight={600}
            className="contentSecondary"
          >
            {content.third}
          </text>
          <text
            x={newTextDDX}
            y={newTextDDY}
            onClick={onClick}
            fontSize={kslType?.text?.d?.fs || 11}
            fontWeight={600}
            className="contentSecondary"
          >
            {content.fourth}
          </text>
        </>
      ) : (
        ""
      )}

      {iconpresent ? (
        <foreignObject
          x={iconx || newIconPositionX}
          y={icony || newIconPositionY}
          width={kslType?.icon?.w || 16}
          height={kslType?.icon?.h || 16}
          fontSize={iconsize || "inherit"}
          onClick={onClick}
        >
          {icon}
        </foreignObject>
      ) : (
        ""
      )}
    </>
  );
};

export default Text;
