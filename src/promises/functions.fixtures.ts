import { options, type TC, type TE } from '~fixtures';
import { ERRORS } from '~utils';
import { toPromise } from './functions';
import type { PromiseConfig, Promisee } from './types';

type ToPromiseTest_F = (
  promise?: PromiseConfig,
  strict?: boolean,
) => Promisee<TC, TE>;

export const toPromiseTest: ToPromiseTest_F = (promise, strict = true) => {
  if (!promise) throw ERRORS.noParams.error;

  const out = toPromise({
    promise: promise,
    options,
    strict,
  });

  return out;
};
