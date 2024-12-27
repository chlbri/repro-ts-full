import { DEFAULT_DELIMITER } from '~constants';
import { flatMapState } from '~states';
import type { FlatMapMachine_F } from './types';

export const flatMapMachine: FlatMapMachine_F = (
  config,
  delimiter = DEFAULT_DELIMITER,
  path = '',
) => {
  return flatMapState(config, delimiter, path);
};
