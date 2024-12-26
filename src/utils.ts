import { isArray, type DefaultReturn } from '~types';

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

export const defaultReturn: DefaultReturn = ({
  _default: { value, bool },
  _return,
  error,
}) => {
  if (_return) return _return;
  if (bool) return value;
  throw error;
};

const env = process.env.NODE_ENV;

export const IS_TEST = env === 'test';
export const IS_PRODUCTION = env === 'production';

export const ERRORS = {
  noParams: { error: new Error('No params'), string: 'No params' },
};
