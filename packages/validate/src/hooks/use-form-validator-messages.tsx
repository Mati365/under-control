/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { GetAllObjectPaths, GetPathObjectType } from '@under-control/core';
import { ValidationError, ValidationErrorsListProps } from '../types';

type FormExtractorAttrs = {
  includeGlobals?: boolean;
};

type FormErrorsExtractor<V> = <P extends GetAllObjectPaths<V>>(
  path: P,
  attrs?: FormExtractorAttrs,
) => ValidationErrorsListProps<GetPathObjectType<V, P>>;

type GlobalFormErrorsExtractor<V> = () => ValidationErrorsListProps<V>;

export type FormValidatorMessagesHookAttrs<V> = {
  errors: Array<ValidationError<V>>;
};

export type FormValidatorMessagesHookResult<V> = {
  all: Array<ValidationError<V>>;
  global: GlobalFormErrorsExtractor<V>;
  extract: FormErrorsExtractor<V>;
};

export function useFormValidatorMessages<V>({
  errors,
}: FormValidatorMessagesHookAttrs<V>): FormValidatorMessagesHookResult<V> {
  const extract: FormErrorsExtractor<V> = (path, attrs) => ({
    errors: errors.flatMap(item => {
      const itemPath = item.path as string;
      if (
        (!itemPath || itemPath !== path) &&
        (!attrs?.includeGlobals || itemPath)
      ) {
        return [];
      }

      return [
        {
          ...item,
          path: itemPath,
        } as unknown as ValidationError<any>,
      ];
    }),
  });

  const global: GlobalFormErrorsExtractor<V> = () => ({
    errors: errors.filter(error => !(error.path as string)),
  });

  return {
    all: errors,
    global,
    extract,
  };
}
