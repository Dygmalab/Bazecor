import React, { useState, useEffect, useRef } from "react";
import { Path, Group, Rect, Text } from "react-konva";
import colorDarkerCalculation from "../../renderer/utils/colorDarkerCalculation";

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
  const actualKey = useRef(null);
  const blurShadow = useRef(null);
  const shapeShadow = useRef(null);
  const shapeStroke = useRef(null);
  const highlightStroke = useRef(null);
  const [active, setActive] = useState(false);
  const [strokeColor, setStrokeColor] = useState(colorDarkerCalculation(fill));

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
    // animateClick(actualKey.current);
    setActive(prev => !prev);
  };

  useEffect(() => {
    if (active) {
      shapeShadow.current.to({
        shadowColor: "#fff",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 3,
        duration: 0.2,
      });
      shapeStroke.current.to({
        stroke: "#fff",
        duration: 0.2,
      });
      highlightStroke.current.to({
        stroke: "rgba(255,255,255,1)",
        duration: 0.2,
      });
    } else {
      shapeShadow.current.to({
        shadowColor: "#fff",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        duration: 0.2,
      });
      shapeStroke.current.to({
        stroke: fill,
        duration: 0.2,
      });
      highlightStroke.current.to({
        stroke: "rgba(255,255,255,0)",
        duration: 0.2,
      });
    }
  }, [active]);

  useEffect(() => {
    setStrokeColor(fill);
  }, [fill]);

  const handleLeave = () => {
    if (!active) {
      shapeShadow.current.to({
        shadowColor: "rgba(255, 255, 255, 0)",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 0,
        duration: 0.2,
      });
      highlightStroke.current.to({
        stroke: "rgba(255,255,255,0)",
        duration: 0.2,
      });
    }
  };

  const handleEnter = () => {
    if (!active) {
      shapeShadow.current.to({
        shadowColor: "rgba(255, 255, 255, 0.25)",
        shadowBlur: 0,
        shadowOffsetX: 0,
        shadowOffsetY: 3,
        duration: 0.2,
      });
      highlightStroke.current.to({
        stroke: "rgba(255,255,255,1)",
        duration: 0.2,
      });
    }
  };

  return (
    <Group
      x={x}
      y={y}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      ref={actualKey}
      data-led-index={dataLedIndex}
      data-key-index={dataKeyIndex}
      data-layer={dataLayer}
    >
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
            ref={blurShadow}
          />
          <Rect width={width} height={height} fill="#303349" stroke={fill} strokeWidth={2} cornerRadius={4} ref={shapeShadow} />
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
          />
          <Rect
            width={width}
            height={height}
            fill={fill}
            stroke={fill}
            strokeWidth={2}
            opacity={0.6}
            cornerRadius={4}
            ref={shapeStroke}
          />
          {/*  */}
          <Rect width={width - 6} height={height - 9} x={3} y={2} fill="#303349" cornerRadius={3} />
          <Rect width={width - 6} height={height - 9} x={3} y={2} fill={fill} opacity={0.3} cornerRadius={3} />
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
            ref={highlightStroke}
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
