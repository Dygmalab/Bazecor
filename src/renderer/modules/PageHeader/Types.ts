import { ReactNode } from "react";

export interface PageHeaderType {
  size?: number;
  text: string;
  styles?: string;
  contentSelector?: ReactNode | undefined;
  colorEditor?: ReactNode | undefined;
  isColorActive?: boolean;
  showSaving?: boolean;
  saveContext?: () => Promise<void> | void;
  destroyContext?: () => Promise<void> | void;
  inContext?: boolean;
  isSaving?: boolean;
  primaryButton?: React.ReactNode;
  secondaryButton?: React.ReactNode;
}
