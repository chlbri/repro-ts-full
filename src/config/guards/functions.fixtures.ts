import type { EventObject } from '../events/types';
import { evaluateGuard } from './functions';
import type { GuardConfig, PredicateMap } from './types';

export type TC = {
  val1?: string;
  val2?: number;
};

export type TE = { type: 'TIMER' | 'TIMER2' };

export const map1: PredicateMap<TC, TE> = {
  guard1: ({ val1 }, { type }) => val1 === type,
  guard2: ({ val2 }) => val2 === 5,
  guard3: ({ val1 }) => val1 === 'TIMER',
  guard4: (_, { type }) => type === 'TIMER2',
};

export function toPredicateTest<TC, TE extends EventObject>(
  guard?: GuardConfig,
  predicates?: PredicateMap<TC, TE>,
  args?: {
    context: TC;
    event: TE;
  },
) {
  if (!guard || !args) return true;
  return evaluateGuard({ guard, predicates, args });
}
