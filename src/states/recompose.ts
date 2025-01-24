import type { Ru } from '@bemedev/types';
import { merge } from 'ts-deepmerge';
import { DEFAULT_DELIMITER } from '~constants';

export function recomposeObjectUrl<T>(shape: string, value: T) {
  let obj: any = {};
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { states, ...rest } = value as any;

  if (shape === DEFAULT_DELIMITER) {
    return rest;
  }

  const keys = shape.split(DEFAULT_DELIMITER).filter(str => str !== '');

  if (keys.length <= 1) {
    const key = keys.shift()!;

    obj.states = {};
    obj.states[key] = value;
  } else {
    const key = keys.shift()!;
    const _value = recomposeObjectUrl(keys.join(DEFAULT_DELIMITER), value);

    obj = rest;
    obj.states = {};

    obj.states[key] = _value;
  }
  return obj;
}

export function recomposeNode(shape: Ru) {
  const entries = Object.entries(shape);
  const arr: any[] = [];
  entries.forEach(([key, value]) => {
    arr.push(recomposeObjectUrl(key, value));
  });

  const output = merge(...arr);
  return output;
}
