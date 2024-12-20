import { isArray } from '~types';

export function toArray<T>(obj: any) {
  if (isArray(obj)) {
    return obj as T[];
  } else return [obj] as T[];
}

export function checkKeys<T extends object>(arg: T, ...keys: string[]) {
  const argKeys = Object.keys(arg);
  for (const key of keys) {
    const check = !argKeys.includes(key);
    if (check) return false;
  }
  return true;
}
