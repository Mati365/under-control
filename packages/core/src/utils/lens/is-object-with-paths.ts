export type ObjectWithPaths = Record<string, unknown> | unknown[];

export function isObjectWithPaths(obj: any): obj is ObjectWithPaths {
  return Array.isArray(obj) || typeof obj === 'object';
}
