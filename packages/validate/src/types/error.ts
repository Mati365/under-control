import { GetAllObjectPaths, CanBeBlank } from '@under-control/core';

export type ValidationMessage = {
  message: string;
};

export type ValidationError<
  V,
  M extends ValidationMessage = ValidationMessage,
  O extends object = object,
> = {
  path: CanBeBlank<GetAllObjectPaths<V>>;
  messages: M[];
  details?: O | null;
};
