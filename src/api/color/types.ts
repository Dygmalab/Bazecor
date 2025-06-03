/**
 * Represents a color in the Red, Green, Blue (RGB) color model.
 * Optionally includes a string representation of the RGB color.
 */
export interface RGB {
  // The red component of the color, typically ranging from 0 to 255.
  r: number;
  // The green component of the color, typically ranging from 0 to 255.
  g: number;
  // The blue component of the color, typically ranging from 0 to 255.
  b: number;
  // An optional string representation of the RGB color, e.g., "rgb(255, 100, 50)".
  rgb?: string;
}

/**
 * Represents a color in the Red, Green, Blue, White (RGBW) color model.
 * This is often used for LEDs that have a dedicated white channel
 * in addition to red, green, and blue.
 */
export interface RGBW {
  // The red component of the color, typically ranging from 0 to 255.
  r: number;
  // The green component of the color, typically ranging from 0 to 255.
  g: number;
  // The blue component of the color, typically ranging from 0 to 255.
  b: number;
  // The white component of the color, typically ranging from 0 to 255.
  w: number;
}
