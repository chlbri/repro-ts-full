import type { TC, TE, TestParams } from 'src/types.fixtures';
import { evaluateGuard } from './functions';
import type { GuardConfig, PredicateMap } from './types';

export const predicates: PredicateMap<TC, TE> = {
  guard1: ({ val1 }, { type }) => val1 === type,
  guard2: ({ val2 }) => val2 === 5,
  guard3: ({ val1 }) => val1 === 'TIMER',
  guard4: (_, { type }) => type === 'TIMER2',
};

type toPredicateTestF = (
  params: TestParams<GuardConfig, 'guard'>,
) => boolean;

export const toPredicateTest: toPredicateTestF = ({
  guard,
  args,
  _default = false,
}) => {
  if (!args) throw new Error('No params');
  return evaluateGuard({ guard, predicates, args, _default });
};
