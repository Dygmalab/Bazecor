import { ReleaseType } from "@Renderer/types/releases";
import type * as Input from "./input";

/** https://stately.ai/docs/input#initial-event-input */
export interface AutoInit {
  readonly type: "xstate.init";
  readonly input: Input.InputType;
}

export interface NEXT {
  readonly type: "next-event";
  readonly firmwareList?: ReleaseType[];
  readonly firmwares?: string;
  readonly device?: string;
  readonly isUpdated?: string;
  readonly isBeta?: string;
  readonly backup?: string;
  readonly sideLeftOk?: boolean;
  readonly sideLeftBL?: boolean;
  readonly sideRightOK?: boolean;
  readonly sideRightBL?: boolean;
  readonly RaiseBrightness?: string;
}

export interface RETRY {
  readonly type: "retry-event";
  readonly Block?: number;
  readonly backup?: unknown;
}

export interface ERROR {
  readonly type: "error-event";
  readonly error: Error;
}

export type Events = AutoInit | NEXT | RETRY | ERROR;
