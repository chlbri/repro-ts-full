import { toMachine, type ChildConfig } from '~children';
import { DEFAULT_DELIMITER } from '~constants';
import { flatMapState, resolveState } from '~states';
import { toArray } from '~utils';
import type { FlatMapMachine_F, ResolveConfig_F } from './types';

export const flatMapMachine: FlatMapMachine_F = (
  config,
  delimiter = DEFAULT_DELIMITER,
  path = '',
) => {
  return flatMapState(config, delimiter, path);
};

//TODO: To test
/**
 *
 */
export const resolveConfig: ResolveConfig_F = (_config, children) => {
  const { strict, machines: _machines, ...config } = _config;

  const out: any = resolveState({ config, options: children, strict });
  const machines = toArray<ChildConfig>(_machines).map(child =>
    toMachine({ child, children, strict }),
  );

  out.machines = machines;
  out.strict = !!strict;

  return out;
};
