export type SplitLiteralBy<
  S extends string,
  V extends string,
> = V extends `${infer T}${S}${infer U}` ? [T, ...SplitLiteralBy<S, U>] : [V];
