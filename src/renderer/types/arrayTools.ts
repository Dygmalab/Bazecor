/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-shadow */
/** Type of the elements in an array */
type ElementOf<T> = T extends (infer E)[] ? E : T extends readonly (infer E)[] ? E : never;

/** Used internally for `Tail`. */
type AsFunctionWithArgsOf<T extends unknown[] | readonly unknown[]> = (...args: T) => any;

/** Used internally for `Tail` */
type TailArgs<T> = T extends (x: any, ...args: infer T) => any ? T : never;

/** Elements of an array after the first. */
type Tail<T extends unknown[] | readonly unknown[]> = TailArgs<AsFunctionWithArgsOf<T>>;

/** Used internally for `IndicesOf`; probably useless outside of that. */
type AsDescendingLengths<T extends unknown[] | readonly unknown[]> = [] extends T
  ? [0]
  : [ElementOf<ElementOf<AsDescendingLengths<Tail<T>>[]>>, T["length"]];

/** Union of numerical literals corresponding to a tuple's possible indices */
type IndicesOf<T extends unknown[] | readonly unknown[]> = number extends T["length"]
  ? number
  : [] extends T
    ? never
    : ElementOf<AsDescendingLengths<Tail<T>>>;
