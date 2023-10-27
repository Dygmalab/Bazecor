import React, { useState, useEffect, useRef } from "react";
import { Path, Group, Rect, Text } from "react-konva";
import { Spring, animated, useSpring } from "@react-spring/konva";
import colorDarkerCalculation from "../../renderer/utils/colorDarkerCalculation";

const NewKeyMotion = ({
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
  const actualKey = useRef(null);
  const [active, setActive] = useState(false);
  const [strokeColor, setStrokeColor] = useState(colorDarkerCalculation(fill));

  const handleClick = e => {
    console.log(e.target);
    console.log(e.target.parent.attrs);
    // animateClick(actualKey.current);
    setActive(prev => !prev);
  };

  const animationActive = useSpring({
    shadowColor: active ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
    shadowOffsetY: active ? 3 : 0,
    stroke: active ? "#ffffff" : fill,
    config: {
      duration: 150,
    },
  });

  return (
    <Group
      x={x}
      y={y}
      onClick={handleClick}
      ref={actualKey}
      data-led-index={dataLedIndex}
      data-key-index={dataKeyIndex}
      data-layer={dataLayer}
    >
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
          perfectDrawEnabled={false}
        />
        <animated.Rect
          width={width}
          height={height}
          fill={fill}
          shadowBlur={0}
          shadowOffsetX={0}
          shadowColor={animationActive.shadowColor}
          shadowOffsetY={animationActive.shadowOffsetY}
          cornerRadius={4}
          perfectDrawEnabled={false}
        />
        <Rect width={width} height={height} fill="#303349" stroke={fill} strokeWidth={2} cornerRadius={4} />
        <Rect
          width={width}
          height={height}
          stroke={fill}
          strokeWidth={2}
          fillLinearGradientStartPoint={{ x: 0 }}
          fillLinearGradientEndPoint={{ x: width }}
          fillLinearGradientColorStops={[0.1, "rgba(255, 255, 255, 1)", 1, "rgba(255, 255, 255, 0)"]}
          opacity={0.2}
          cornerRadius={4}
          perfectDrawEnabled={false}
        />
        <animated.Rect
          width={width}
          height={height}
          fill={fill}
          stroke={animationActive.stroke}
          strokeWidth={2}
          opacity={0.6}
          cornerRadius={4}
        />
        {/*  */}
        <Rect width={width - 6} height={height - 9} x={3} y={2} fill="#303349" cornerRadius={3} perfectDrawEnabled={false} />
        <Rect
          width={width - 6}
          height={height - 9}
          x={3}
          y={2}
          fill={fill}
          opacity={0.3}
          cornerRadius={3}
          perfectDrawEnabled={false}
        />
        <Rect
          width={width - 6}
          height={height - 9}
          x={3}
          y={2}
          opacity={0.3}
          stroke="rgba(255,255,255,0)"
          cornerRadius={3}
          fillLinearGradientStartPoint={{ x: 0 }}
          fillLinearGradientEndPoint={{ x: width }}
          fillLinearGradientColorStops={[0, "rgba(255, 255, 255, 1)", 0.8, "rgba(255, 255, 255, 0)"]}
          perfectDrawEnabled={false}
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
          perfectDrawEnabled={false}
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
            perfectDrawEnabled={false}
          />
        ) : null}
      </>
    </Group>
  );
};

export default NewKeyMotion;
