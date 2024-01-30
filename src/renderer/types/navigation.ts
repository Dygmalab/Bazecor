import Pages from "@Types/pages";

export interface NavigationMenuProps {
  connected: boolean;
  flashing: boolean;
  fwUpdate: boolean;
  allowBeta: boolean;
  modified: boolean;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  pages: Pages | object;
}

export interface HeaderInterface {
  connected: boolean;
  flashing: boolean;
  fwUpdate: boolean;
  allowBeta: boolean;
  modified: boolean;
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  pages: Pages | object;
}
