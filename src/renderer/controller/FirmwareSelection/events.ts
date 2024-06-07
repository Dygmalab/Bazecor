import type * as Input from "./input";

/** https://stately.ai/docs/input#initial-event-input */
export interface AutoInit {
  readonly type: "xstate.init";
  readonly input: Input.InputType;
}

export interface NEXT {
  readonly type: "next-event";
}

export interface RETRY {
  readonly type: "retry-event";
}

export interface CHANGEFW {
  readonly type: "changeFW-event";
  readonly selected: number;
}

export type Events = AutoInit | NEXT | RETRY | CHANGEFW;
