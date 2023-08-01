export default interface Pages {
  keymap: boolean;
  colormap: boolean;
}
export interface TabLayoutEditorProps {
  keyCode: number;
  onKeySelect: (key: number) => void;
  isStandardView: boolean;
}
