/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import type { GetAllObjectPaths, GetPathObjectType } from '@under-control/core';
import type {
  ValidationError,
  ValidationErrorsArray,
  ValidationErrorsListProps,
} from '../types';

const CACHE_EMPTY_ERRORS_ARRAY: Readonly<ValidationErrorsArray<any>> =
  Object.freeze([]);

type FormExtractorAttrs = {
  includeGlobals?: boolean;
  nested?: boolean;
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
  const extract: FormErrorsExtractor<V> = (
    path,
    { includeGlobals, nested } = {},
  ) => {
    const extractedErrors = errors.flatMap(item => {
      const itemPath = item.path as string;

      if (nested) {
        const nestedPath = `${path as string}.`;
        const nestedArrayPath = `${path as string}[`;

        if (itemPath?.startsWith(nestedPath)) {
          return [
            {
              ...item,
              path: itemPath.replace(nestedPath, ''),
            } as unknown as ValidationError<any>,
          ];
        }

        if (itemPath?.startsWith(nestedArrayPath)) {
          return [
            {
              ...item,
              path: itemPath.substring((path as string).length),
            } as unknown as ValidationError<any>,
          ];
        }

        return [];
      }

      if ((!itemPath || itemPath !== path) && (!includeGlobals || itemPath)) {
        return [];
      }

      return [
        {
          ...item,
          path: null,
        } as unknown as ValidationError<any>,
      ];
    });

    if (extractedErrors.length) {
      return {
        errors: extractedErrors,
      };
    }

    return {
      errors: CACHE_EMPTY_ERRORS_ARRAY as ValidationErrorsArray<any>,
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
