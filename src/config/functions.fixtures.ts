import { options, type TC, type TE } from '~fixtures';
import { ERRORS } from '~utils';
import { resolveConfig } from './functions';
import type { Config, Machine0 } from './types';

type ResolveStateTest_F = (config?: Config) => Machine0<TC, TE>;

export const resolveStateTest: ResolveStateTest_F = config => {
  if (!config) throw ERRORS.noParams.error;

  const out = resolveConfig(config, options);

  return out;
};
