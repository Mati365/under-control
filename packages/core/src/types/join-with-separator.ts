export type JoinWithSeparator<K, P, S extends string = '.'> = K extends
  | string
  | number
  ? K extends ''
    ? P
    : P extends string | number
    ? `${K}${'' extends P ? '' : `${S}`}${P}`
    : never
  : never;
