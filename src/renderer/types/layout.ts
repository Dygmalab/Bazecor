export interface LayoutEditorProps {
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  darkMode: boolean;
  setLoading: (lding: boolean) => void;
  inContext: boolean;
}
