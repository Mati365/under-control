import { ObjectWithPaths } from '@under-control/core';

export type ControlValue =
  | ObjectWithPaths
  | Date
  | number
  | string
  | boolean
  | null
  | undefined;
