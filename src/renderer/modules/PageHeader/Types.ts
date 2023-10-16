import { ReactNode } from "react";

export interface PageHeaderType {
  size?: number;
  text: string;
  style?: string;
  contentSelector?: ReactNode | undefined;
  colorEditor?: ReactNode | undefined;
  isColorActive?: boolean;
  showSaving?: boolean;
  saveContext?: unknown | undefined;
  destroyContext?: unknown | undefined;
  inContext?: boolean;
  isSaving?: boolean;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}
