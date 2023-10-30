import React, { useState, useEffect, useRef } from "react";
import { Path, Group, Rect, Text } from "react-konva";
import { Spring, animated, useSpring } from "@react-spring/konva";
import { settingColorOpacity } from "../../renderer/utils/colorOpacityCalculation";

const NewKeyCompressed = ({
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
  const [hovered, setHovered] = useState(false);
  const [colorOpacity, setColorOpacity] = useState(settingColorOpacity("#ffffff", 0.6));

  const animationActive = useSpring({
    shadowOpacity: active ? 0.8 : 0.5,
    shadowColor: active ? "rgba(255,255,255,1)" : "rgba(255,255,255,0)",
    shadowOffsetY: active ? 4 : 0,
    stroke: active || hovered ? "#ffffff" : fill,
    config: {
      duration: 150,
    },
  });

  const handleClick = e => {
    console.log(e.target);
    console.log(e.target.parent.attrs);
    // animateClick(actualKey.current);
    setActive(prev => !prev);
  };

  useEffect(() => {
    setColorOpacity(settingColorOpacity(fill, 0.6));
  }, [fill]);

  return (
    <Group
      x={x}
      y={y}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ref={actualKey}
      data-led-index={dataLedIndex}
      data-key-index={dataKeyIndex}
      data-layer={dataLayer}
    >
      <>
        <animated.Rect
          width={width}
          height={height}
          fill={fill}
          shadowColor={fill}
          shadowBlur={20}
          shadowOffsetX={0}
          shadowOffsetY={10}
          shadowOpacity={animationActive.shadowOpacity}
          cornerRadius={10}
          perfectDrawEnabled={false}
        />
        <animated.Rect
          width={width + 2}
          height={height}
          x={-1}
          y={animationActive.shadowOffsetY}
          fill="rgba(255, 255, 255, 1)"
          cornerRadius={4}
        />
        <animated.Rect
          width={width}
          height={height}
          stroke={animationActive.stroke}
          cornerRadius={4}
          fillLinearGradientStartPoint={{ x: 0, y: 0 }}
          fillLinearGradientEndPoint={{ x: width, y: height }}
          fillLinearGradientColorStops={[0, "#5A616E", 0.8, "#323B4B"]}
        />
        <animated.Rect width={width} height={height} fill={colorOpacity} stroke={animationActive.stroke} cornerRadius={4} />

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
          stroke="rgba(255,255,255,0)"
          cornerRadius={3}
          fillLinearGradientStartPoint={{ x: 0 }}
          fillLinearGradientEndPoint={{ x: width }}
          fillLinearGradientColorStops={[0, "rgba(255, 255, 255, 0.3)", 0.8, "rgba(255, 255, 255, 0)"]}
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

export default NewKeyCompressed;
