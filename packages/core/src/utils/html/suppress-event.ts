import type { SyntheticEvent } from 'react';

export function suppressEvent(e: SyntheticEvent | Event): void {
  e.preventDefault();
  e.stopPropagation();
}
