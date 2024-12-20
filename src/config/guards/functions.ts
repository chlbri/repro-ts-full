import recursive from '@bemedev/boolean-recursive';
import { isDescriber, isString } from '../../types';
import { GUARD_TYPE } from '../constants';
import type { EventObject } from '../events';
import type {
  EvaluateGuardParams,
  GuardConfig,
  GuardUnion,
  Predicate,
  PredicateMap,
} from './types';

export const returnTrue = () => true;
export const returnFalse = () => true;

function _toPredicate<TC, TE extends EventObject>(
  guard?: GuardConfig,
  predicates?: PredicateMap<TC, TE>,
): Predicate<TC, TE> {
  if (!guard) return returnTrue;

  if (isString(guard)) {
    const arg = predicates?.[guard];
    if (!arg) return returnTrue;
    return arg;
  }

  if (isDescriber(guard)) {
    const arg = predicates?.[guard.name];
    if (!arg) return returnTrue;
    return arg;
  }

  const makeArray = (guards: GuardUnion[]) => {
    return guards.map(g => _toPredicate(g, predicates));
  };

  if (GUARD_TYPE.and in guard) {
    const and = makeArray(guard.and);
    return { and };
  }

  const or = makeArray(guard.or);
  return { or };
}

export function toPredicate<TC, TE extends EventObject>(
  guard?: GuardConfig,
  predicates?: PredicateMap<TC, TE>,
) {
  const out1 = _toPredicate(guard, predicates);
  return recursive(out1);
}

export const evaluateGuard = <TC, TE extends EventObject>({
  guard,
  predicates,
  args: { context, event },
}: EvaluateGuardParams<TC, TE>) => {
  const out1 = toPredicate(guard, predicates);
  const out2 = out1(context, event);

  return out2;
};
