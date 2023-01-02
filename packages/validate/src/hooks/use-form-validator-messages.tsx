/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { GetAllObjectPaths, GetPathObjectType } from '@under-control/core';
import {
  ValidationError,
  ValidationErrorsArray,
  ValidationErrorsListProps,
} from '../types';

const CACHE_EMPTY_ERRORS_ARRAY: Readonly<ValidationErrorsArray<any>> =
  Object.freeze([]);

type FormExtractorAttrs = {
  includeGlobals?: boolean;
};

type FormErrorsExtractor<V> = <P extends GetAllObjectPaths<V>>(
  path: P,
  attrs?: FormExtractorAttrs,
) => ValidationErrorsListProps<GetPathObjectType<V, P>>;

type GlobalFormErrorsExtractor<V> = () => ValidationErrorsListProps<V>;

export type FormValidatorMessagesHookAttrs<V> = {
  errors: ValidationErrorsArray<V>;
};

export type FormValidatorMessagesHookResult<V> = {
  all: ValidationErrorsArray<V>;
  global: GlobalFormErrorsExtractor<V>;
  extract: FormErrorsExtractor<V>;
};

export function useFormValidatorMessages<V>({
  errors,
}: FormValidatorMessagesHookAttrs<V>): FormValidatorMessagesHookResult<V> {
  const extract: FormErrorsExtractor<V> = (path, attrs) => {
    const extractedErrors = errors.flatMap(item => {
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
    });

    if (extractedErrors.length) {
      return {
        errors: extractedErrors,
      };
    }

    return {
      errors: CACHE_EMPTY_ERRORS_ARRAY,
    };
  };

  const global: GlobalFormErrorsExtractor<V> = () => ({
    errors: errors.filter(error => !(error.path as string)),
  });

  return {
    all: errors,
    global,
    extract,
  };
}
