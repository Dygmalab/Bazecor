import { PaletteType } from "@Types/layout";

export interface ColorPaletteProps {
  colors: PaletteType[];
  selected: number;
  onColorSelect?: (event: Event, idx: number) => void;
  className?: string;
}
