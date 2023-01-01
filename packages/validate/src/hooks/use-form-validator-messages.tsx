/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { GetAllObjectPaths, GetPathObjectType } from '@under-control/core';
import { ValidationError, ValidationErrorsListProps } from '../types';

type FormErrorsExtractor<V> = <P extends GetAllObjectPaths<V>>(
  path: P,
) => ValidationErrorsListProps<GetPathObjectType<V, P>>;

export type FormValidatorMessagesHookAttrs<V> = {
  errors: Array<ValidationError<V>>;
};

export type FormValidatorMessagesHookResult<V> = {
  all: Array<ValidationError<V>>;
  extract: FormErrorsExtractor<V>;
};

export function useFormValidatorMessages<V>({
  errors,
}: FormValidatorMessagesHookAttrs<V>): FormValidatorMessagesHookResult<V> {
  const extract: FormErrorsExtractor<V> = path => ({
    errors: errors.flatMap(item => {
      const itemPath = item.path as string;
      if (itemPath && itemPath !== path) {
        return [];
      }

      return [
        {
          ...item,
          path,
        } as unknown as ValidationError<any>,
      ];
    }),
  });

  return {
    all: errors,
    extract,
  };
}
