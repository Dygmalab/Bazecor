const settingColorOpacity = (color: string, opacity: number) => {
  console.log("COLOR: ", color);
  function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  }

  function getRGBValues(rgbColor: string) {
    // Check if the input is in the correct format (rgb(r, g, b))
    const regex = /^rgb\((\d+), (\d+), (\d+)\)$/;
    const match = rgbColor.match(regex);

    if (match) {
      // Extract the values and convert them to integers
      const red = parseInt(match[1], 10);
      const green = parseInt(match[2], 10);
      const blue = parseInt(match[3], 10);

      // Return an object with the RGB values
      return {
        red,
        green,
        blue,
      };
    }
    // Handle invalid input
    console.error("Invalid RGB color format");
    return null;
  }

  let newColor;
  const regexTestHEX = /^#([0-9a-f]{3}){1,2}$/i;
  // let newColorArray = color;
  // const newColorArray = color.replace(/[^\d,]/g, "").split(",");

  if (regexTestHEX.test(color)) {
    // is Hexa
    newColor = `rgba(${hexToRgb(color).r}, ${hexToRgb(color).g}, ${hexToRgb(color).b},  ${opacity})`;
  } else {
    // is rgb
    newColor = `rgba(${getRGBValues(color).red}, ${getRGBValues(color).green}, ${getRGBValues(color).blue}, ${opacity} )`;
  }

  return newColor;
};

export { settingColorOpacity };
