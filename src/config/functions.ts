import { toMachine, type ChildConfig } from '~children';
import { DEFAULT_DELIMITER } from '~constants';
import { flatMapState, resolveState } from '~states';
import { toArray } from '~utils';
import type {
  CreateConfig_F,
  FlatMapMachine_F,
  ResolveConfig_F,
} from './types';

export const createConfig: CreateConfig_F = config => config;

/**
 *
 */
export const flatMapMachine: FlatMapMachine_F = (
  config,
  delimiter = DEFAULT_DELIMITER,
  path = '',
) => {
  return flatMapState(config, delimiter, path);
};

/**
 *
 */
export const resolveConfig: ResolveConfig_F = (_config, children) => {
  const { strict, machines: _machines, ...config } = _config;

  const out: any = resolveState({ config, options: children });
  const machines = toArray<ChildConfig>(_machines).map(child =>
    toMachine({ child, children, strict }),
  );

  out.machines = machines;
  out.strict = !!strict;

  return out;
};
