import type * as Input from "./input";

/** https://stately.ai/docs/input#initial-event-input */
export interface AutoInit {
  readonly type: "xstate.init";
  readonly input: Input.InputType;
}

export interface INTERNAL {
  readonly type: "internal-event";
}

export interface ESCPRESSED {
  readonly type: "escpressed-event";
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

export interface INC {
  readonly type: "increment-event";
  readonly globalProgress: number;
  readonly leftProgress: number;
  readonly rightProgress: number;
  readonly resetProgress: number;
  readonly neuronProgress: number;
  readonly restoreProgress: number;
}

export type Events = AutoInit | INTERNAL | ESCPRESSED | AUTOPRESSED | RETRY | CANCEL | INC;
