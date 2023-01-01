import { GetAllObjectPaths, GetPathObjectType } from '@under-control/core';
import { ValidationError } from '../types';

type FormErrorsExtractor<V> = <P extends GetAllObjectPaths<V>>(
  path?: P | null,
) => Array<ValidationError<null> | ValidationError<GetPathObjectType<V, P>>>;

export type FormValidatorMessagesHookAttrs<V> = {
  errors: Array<ValidationError<V>>;
};

export type FormValidatorMessagesHookResult<V> =
  FormValidatorMessagesHookAttrs<V> & {
    extract: FormErrorsExtractor<V>;
  };

export function useFormValidatorMessages<V>({
  errors,
}: FormValidatorMessagesHookAttrs<V>): FormValidatorMessagesHookResult<V> {
  const extract: FormErrorsExtractor<V> = (path = null) =>
    errors.flatMap(item => {
      const itemPath = item.path as string;
      const truncatedPath =
        itemPath?.substring((path as string)?.length + 1) || null;

      if (!truncatedPath && path !== null) {
        return [];
      }

      return [
        {
          ...item,
          path: truncatedPath,
        } as unknown as ValidationError<any>,
      ];
    });

  return {
    errors,
    extract,
  };
}
