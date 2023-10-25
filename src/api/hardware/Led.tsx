import React from "react";
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
  const [color, setColor] = React.useState("rgb(255,255,255)");
  const [strokeColor, setStrokeColor] = React.useState(colorDarkerCalculation("rgb(255,255,255)"));

  React.useEffect(() => {
    setColor(fill);
    setStrokeColor(colorDarkerCalculation(fill));
  }, [fill]);

  if (!visibility) return null;
  return (
    <Group
      x={x}
      y={y}
      onClick={clickAble ? onClick : () => {}}
      data-led-index={dataLedIndex}
      data-key-index={dataKeyIndex}
      data-layer={dataLayer}
    >
      <Path data={path} fill={color} shadowColor={color} shadowBlur={5} shadowOffsetX={0} shadowOffsetY={0} shadowOpacity={0.5} />
      <Path data={path} fill={color} stroke={strokeColor} strokeWidth={1.5} />
    </Group>
  );
};

export default Led;
