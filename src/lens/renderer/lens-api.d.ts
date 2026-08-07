import type { KeyboardModel, LensSettings, LensState } from "../shared/types";

declare global {
  interface Window {
    lens: {
      onModel(cb: (m: KeyboardModel) => void): () => void;
      onActiveLayer(cb: (l: number) => void): () => void;
      onSettings(cb: (s: LensSettings) => void): () => void;
      getState(): Promise<LensState>;
      getSettings(): Promise<LensSettings>;
      setOpacity(v: number): Promise<LensSettings>;
      setResizeMode(v: boolean): Promise<LensSettings>;
      setShowUnderglow(v: boolean): Promise<LensSettings>;
      setLayout(v: string): Promise<LensSettings>;
      setLayerName(layer: number, name: string): Promise<LensSettings>;
      setOverlay(v: boolean): Promise<LensSettings>;
      setOverlayAutoShow(v: boolean): Promise<LensSettings>;
      winResize(dir: string, dx: number, dy: number): void;
      winMove(x: number, y: number): void;
      winMoveBy(dx: number, dy: number): void;
    };
  }
}
export {};
