import React, { useState, useRef, useEffect } from "react";
import Konva from "konva";
import { Path, Group, Rect, Text } from "react-konva";
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
  const [active, setActive] = useState(false);
  const [color, setColor] = useState("rgb(255,255,255)");
  const [strokeColor, setStrokeColor] = useState(colorDarkerCalculation("rgb(255,255,255)"));

  useEffect(() => {
    setColor(fill);
    setStrokeColor(colorDarkerCalculation(fill));
  }, [fill]);

  const animateClick = led => {
    // use Konva methods to animate a shape
    led.to({
      scaleX: 1.5,
      scaleY: 1.5,
      onFinish: () => {
        led.to({
          scaleX: 1,
          scaleY: 1,
        });
      },
    });
  };

  const handleClick = e => {
    console.log(e.target);
    console.log(e.target.parent.attrs);
    animateClick(e.target);
    setActive(prev => !prev);
  };

  if (!visibility) return null;
  return (
    <Group x={x} y={y} onClick={handleClick} data-led-index={dataLedIndex} data-key-index={dataKeyIndex} data-layer={dataLayer}>
      <Path data={path} fill={color} shadowColor={color} shadowBlur={5} shadowOffsetX={0} shadowOffsetY={0} shadowOpacity={0.5} />
      <Path data={path} fill={color} stroke={strokeColor} strokeWidth={1.5} />
    </Group>
  );
};

export default Led;
