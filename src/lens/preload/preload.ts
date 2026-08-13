import { contextBridge, ipcRenderer } from "electron";
import type { KeyboardModel, LensSettings, LensState } from "../shared/types";

contextBridge.exposeInMainWorld("lens", {
  onModel(cb: (m: KeyboardModel) => void): () => void {
    const listener = (_: Electron.IpcRendererEvent, m: KeyboardModel) => cb(m);
    ipcRenderer.on("lens:model", listener);
    return () => ipcRenderer.removeListener("lens:model", listener);
  },

  onActiveLayer(cb: (l: number) => void): () => void {
    const listener = (_: Electron.IpcRendererEvent, l: number) => cb(l);
    ipcRenderer.on("lens:active-layer", listener);
    return () => ipcRenderer.removeListener("lens:active-layer", listener);
  },

  onSettings(cb: (s: LensSettings) => void): () => void {
    const listener = (_: Electron.IpcRendererEvent, s: LensSettings) => cb(s);
    ipcRenderer.on("lens:settings", listener);
    return () => ipcRenderer.removeListener("lens:settings", listener);
  },

  getState(): Promise<LensState> {
    return ipcRenderer.invoke("lens:get-state");
  },

  getSettings(): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:get-settings");
  },

  setOpacity(v: number): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-opacity", v);
  },

  setResizeMode(v: boolean): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-resize-mode", v);
  },

  setShowUnderglow(v: boolean): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-show-underglow", v);
  },

  setLayout(v: string): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-layout", v);
  },

  setLayerName(layer: number, name: string): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-layer-name", layer, name);
  },

  setOverlay(v: boolean): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-overlay", v);
  },

  setOverlayAutoShow(v: boolean): Promise<LensSettings> {
    return ipcRenderer.invoke("lens:set-overlay-auto-show", v);
  },

  winResize(dir: string, dx: number, dy: number): void {
    ipcRenderer.send("lens:win-resize", dir, dx, dy);
  },
  winMove(x: number, y: number): void {
    ipcRenderer.send("lens:win-move", x, y);
  },
  winMoveBy(dx: number, dy: number): void {
    ipcRenderer.send("lens:win-move-by", dx, dy);
  },
});
