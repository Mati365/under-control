import type { ObjectWithPaths } from '@under-control/core';

export type ControlValue =
  | ObjectWithPaths
  | Date
  | File
  | number
  | string
  | boolean
  | null
  | undefined;
