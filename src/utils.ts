import { DEFAULT_NOTHING } from '~constants';
import {
  isArray,
  type Asyncfy_F,
  type DefaultReturn,
  type Identify_F,
} from '~types';

export function toArray<T>(obj: any) {
  if (isArray(obj)) {
    return obj as T[];
  } else {
    if (!obj) return [];
    return [obj] as T[];
  }
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
  config: { value, strict },
  _return,
  error,
}) => {
  if (_return) return _return;
  if (!strict) return value;
  throw error;
};

// @ts-expect-error no need to return
export const nothing = () => {
  if (IS_TEST) {
    console.log(`${DEFAULT_NOTHING} call ${DEFAULT_NOTHING}`);
    return DEFAULT_NOTHING;
  }
};

const env = process.env.NODE_ENV;

export const IS_TEST = env === 'test';
export const IS_PRODUCTION = env === 'production';

export const ERRORS = {
  noParams: { error: new Error('No params'), string: 'No params' },
};

export const identify: Identify_F = arg => {
  if (!arg) return [];
  const entries = Object.entries(arg);

  const out: any[] = entries.map(([__id, value]) => {
    const out2 = { ...value, __id };
    return out2;
  });

  return out;
};

export const asyncfy: Asyncfy_F = fn => {
  type T = typeof fn;
  return async (...args: Parameters<T>) => {
    return fn(...args);
  };
};
