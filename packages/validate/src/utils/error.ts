import { GetAllObjectPaths, CanBeBlank } from '@under-control/core';
import { ValidationError } from '../types';

export const error = <V, O extends object>(
  message: string,
  details: O | null = null,
  path: CanBeBlank<GetAllObjectPaths<V>> = undefined,
): ValidationError<V> => ({
  path,
  details,
  messages: [
    {
      message,
    },
  ],
});
