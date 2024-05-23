import type * as Input from "./input";

/** https://stately.ai/docs/input#initial-event-input */
export interface AutoInit {
  readonly type: "xstate.init";
  readonly input: Input.InputType;
}

export interface INTERNAL {
  readonly type: "internal";
}

export interface PRESSED {
  readonly type: "pressed-event";
}
export interface AUTOPRESSED {
  readonly type: "autopressed-event";
}
export interface RETRY {
  readonly type: "retry-event";
}
export interface CANCEL {
  readonly type: "cancel-event";
}

export type Events = AutoInit | INTERNAL | PRESSED | AUTOPRESSED | RETRY | CANCEL;
