import { isArray, type DefaultReturn } from '~types';
import { DEFAULT_NOTHING } from '~constants';

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
  config: { value, strict },
  _return,
  error,
}) => {
  if (_return) return _return;
  if (strict) return value;
  throw error;
};

// @ts-expect-error No implicit return
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
