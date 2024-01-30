import Pages from "@Types/pages";

export interface NavigationMenuProps {
  connected: boolean;
  flashing: boolean;
  fwUpdate: boolean;
  allowBeta: boolean;
  modified: boolean;
  loading: boolean;
  pages: Pages | object;
}

export interface HeaderInterface {
  connected: boolean;
  flashing: boolean;
  fwUpdate: boolean;
  allowBeta: boolean;
  modified: boolean;
  loading: boolean;
  pages: Pages | object;
}
