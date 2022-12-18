export function pickEventValue(e: any): any {
  if (['string', 'number'].includes(typeof e)) {
    return e;
  }

  if (
    e instanceof Event ||
    (e && 'target' in e && e.target instanceof HTMLElement)
  ) {
    const target = (e as Event).target as HTMLInputElement;

    switch (target?.type) {
      case 'checkbox':
        return target.checked;

      case 'file':
        return target.files?.[0];

      default:
        return target.value;
    }
  }

  return e;
}
