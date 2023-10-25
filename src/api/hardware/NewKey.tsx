import React from "react";
import Konva from "konva";
import { Path, Group, Rect, Text } from "react-konva";

const NewKey = ({
  keyType,
  id,
  onClick,
  fill,
  stroke,
  width,
  height,
  x,
  y,
  dataLedIndex,
  dataKeyIndex,
  dataLayer,
  selectedKey,
  contrastText,
  centerPrimary,
  centerExtra,
}) => {
  console.log("centerPrimary :", centerPrimary);
  console.log("centerPrimary :", centerExtra);
  return (
    <Group x={x} y={y} onClick={onClick} data-led-index={dataLedIndex} data-key-index={dataKeyIndex} data-layer={dataLayer}>
      {keyType === "regularKey" ? (
        <>
          <Rect
            width={width}
            height={height}
            fill={fill}
            shadowColor={fill}
            shadowBlur={20}
            shadowOffsetX={0}
            shadowOffsetY={10}
            shadowOpacity={0.5}
            cornerRadius={10}
          />
          <Rect width={width} height={height} fill={fill} stroke="rgba(0, 0, 0, 0.15)" strokeWidth={2} cornerRadius={4} />
          <Rect
            width={width - 6}
            height={height - 7}
            x={3}
            y={2}
            fill="#303349"
            stroke="#25273B"
            strokeWidth={2}
            cornerRadius={3}
          />
          <Text
            text={centerPrimary.label}
            fontSize={12}
            fontStyle="700"
            fontFamily="Libre Franklin"
            fill="#ffffff"
            width={width - 6}
            padding={6}
            y={2}
          />
          {centerPrimary.extraLabel ? (
            <Text
              text={centerPrimary.extraLabel}
              fontSize={11}
              fontStyle="700"
              fontFamily="Libre Franklin"
              fill="#ffffff"
              width={width - 6}
              padding={6}
              y={14}
            />
          ) : null}
        </>
      ) : null}

      {keyType === "t5" ? (
        <>
          <Path
            data="M118 1H6.79086C3.31638 1 1.49404 5.12511 3.8338 7.69366L47.5766 55.7139C48.9031 57.1701 50.7817 58 52.7515 58H118C120.761 58 123 55.7614 123 53V6C123 3.23858 120.761 1 118 1Z"
            fill={fill}
            shadowColor={fill}
            shadowBlur={20}
            shadowOffsetX={0}
            shadowOffsetY={10}
            shadowOpacity={0.5}
            cornerRadius={10}
          />
          <Path
            data="M118 1H6.79086C3.31638 1 1.49404 5.12511 3.8338 7.69366L47.5766 55.7139C48.9031 57.1701 50.7817 58 52.7515 58H118C120.761 58 123 55.7614 123 53V6C123 3.23858 120.761 1 118 1Z"
            fill={fill}
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth={2}
          />
          <Path
            data="M116 2H9.90123C7.21327 2 5.88177 5.26296 7.80235 7.14353L50.551 49.0016C51.8593 50.2826 53.6174 51 55.4484 51H116C118.209 51 120 49.2091 120 47V6C120 3.79086 118.209 2 116 2Z"
            fill="#303349"
            stroke="#25273B"
            strokeWidth={2}
            x={1}
          />
          <Text
            text={centerPrimary.label}
            fontSize={12}
            fontStyle="700"
            align="right"
            fontFamily="Libre Franklin"
            fill="#ffffff"
            width={width - 6}
            padding={6}
            y={2}
          />
          {centerPrimary.extraLabel ? (
            <Text
              text={centerPrimary.extraLabel}
              fontSize={11}
              fontStyle="700"
              align="right"
              fontFamily="Libre Franklin"
              fill="#ffffff"
              width={width - 6}
              padding={6}
              y={14}
            />
          ) : null}
        </>
      ) : null}

      {keyType === "t8" ? (
        <>
          <Path
            data="M117.218 1H6C3.23858 1 1 3.23858 1 6V53C1 55.7614 3.23858 58 6 58H71.3458C73.318 58 75.1987 57.168 76.5254 55.7087L120.178 7.69069C122.514 5.1212 120.691 1 117.218 1Z"
            fill={fill}
            shadowColor={fill}
            shadowBlur={20}
            shadowOffsetX={0}
            shadowOffsetY={10}
            shadowOpacity={0.5}
            cornerRadius={10}
          />
          <Path
            data="M117.218 1H6C3.23858 1 1 3.23858 1 6V53C1 55.7614 3.23858 58 6 58H71.3458C73.318 58 75.1987 57.168 76.5254 55.7087L120.178 7.69069C122.514 5.1212 120.691 1 117.218 1Z"
            fill={fill}
            stroke="rgba(0, 0, 0, 0.15)"
            strokeWidth={2}
          />
          <Path
            data="M114.099 2H8C5.79086 2 4 3.79086 4 6V47C4 49.2091 5.79086 51 8 51H68.5516C70.3826 51 72.1407 50.2826 73.449 49.0016L116.198 7.14353C118.118 5.26296 116.787 2 114.099 2Z"
            fill="#303349"
            stroke="#25273B"
            strokeWidth={2}
            x={1}
          />
          <Text
            text={centerPrimary.label}
            fontSize={12}
            fontStyle="700"
            fontFamily="Libre Franklin"
            fill="#ffffff"
            width={width - 6}
            padding={6}
            y={2}
          />
          {centerPrimary.extraLabel ? (
            <Text
              text={centerPrimary.extraLabel}
              fontSize={11}
              fontStyle="700"
              fontFamily="Libre Franklin"
              fill="#ffffff"
              width={width - 6}
              padding={6}
              y={14}
            />
          ) : null}
        </>
      ) : null}
    </Group>
  );
};

export default NewKey;
