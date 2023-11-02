import React, { useState, useRef, useEffect, useMemo } from "react";
import Konva from "konva";
import { Path, Group } from "react-konva";
import { animated, useSpring } from "@react-spring/konva";
import colorDarkerCalculation from "../../renderer/utils/colorDarkerCalculation";

const Led = ({
  id,
  onClick,
  fill,
  stroke,
  visibility,
  clickAble,
  x,
  y,
  selectedLED,
  dataLedIndex,
  dataKeyIndex,
  dataLayer,
  path,
}) => {
  const actualLed = useRef(null);
  // const [active, setActive] = useState(false);
  const [hovered, setHovered] = useState(false);
  // const [color, setColor] = useState("rgb(255,255,255)");
  // const [strokeColor, setStrokeColor] = useState(colorDarkerCalculation("rgb(255,255,255)"));

  // useEffect(() => {
  //   setColor(fill);
  //   setStrokeColor(colorDarkerCalculation(fill));
  // }, [fill]);

  const strokeColor = useMemo(() => colorDarkerCalculation(fill), [fill]);

  const active = useMemo(() => {
    if (selectedLED === dataLedIndex) {
      return true;
    }
    return false;
  }, [selectedLED, dataLedIndex]);

  const animationActive = useSpring({
    shadowOpacity: active || hovered ? 1 : 0.7,
    blur: active || hovered ? 4 : 16,
    strokeColor: active || hovered ? "rgb(255, 255, 255 )" : strokeColor,
    config: {
      duration: 150,
    },
  });

  if (!visibility) return null;
  return (
    <Group
      x={x}
      y={y}
      onClick={clickAble ? onClick : () => {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      ledIndex={dataLedIndex}
      keyIndex={dataKeyIndex}
      layer={dataLayer}
      ref={actualLed}
    >
      <animated.Path
        data={path}
        fill={fill}
        shadowColor={fill}
        shadowBlur={animationActive.blur}
        shadowOffsetX={0}
        shadowOffsetY={0}
        shadowOpacity={animationActive.shadowOpacity}
      />
      <animated.Path data={path} fill={fill} stroke={animationActive.strokeColor} strokeWidth={1.5} />
    </Group>
  );
};

export default Led;
