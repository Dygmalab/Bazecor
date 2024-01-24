export interface CustomRCBProps {
  label: string;
  type: string;
  id: string | number;
  name: string;
  tooltip: any;
  className: string;
  onClick: (checked: boolean) => void;
  disabled: boolean;
  checked: boolean;
}
