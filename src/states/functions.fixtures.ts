import { options, type TC, type TE } from '~fixtures';
import { ERRORS } from '~utils';
import { resolveState } from './functions';
import type { SNC, StateNode } from './types';

type ResolveStateTest_F = (
  config?: SNC,
  strict?: boolean,
) => StateNode<TC, TE>;

export const resolveStateTest: ResolveStateTest_F = (config, strict) => {
  if (!config) throw ERRORS.noParams.error;

  const out = resolveState({
    config,
    options,
    strict,
  });

  return out;
};

export const body1 = {
  initial: 'state1',
  states: {
    state1: {
      exit: 'end1',
    },
    state2: {
      entry: 'start2',
    },
  },
} satisfies SNC;

export const stateValue1 = '/state1';
