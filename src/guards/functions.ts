import recursive from '@bemedev/boolean-recursive';
import { DEFAULT_NOTHING, ERRORS, GUARD_TYPE } from '~constants';
import type { EventObject } from '~events';
import { isDescriber, isString } from '~types';
import { defaultReturn } from '~utils';
import type {
  GuardConfig,
  GuardUnion,
  Predicate,
  PredicateMap,
  ToPredicateF,
} from './types';

export const returnTrue = () => {
  console.log(`${DEFAULT_NOTHING} call true`);
  return true;
};
export const returnFalse = () => {
  console.log(`${DEFAULT_NOTHING} call false`);
  return false;
};

export function _toPredicate<TC, TE extends EventObject>(
  guard?: GuardConfig,
  predicates?: PredicateMap<TC, TE>,
  strict = false,
): Predicate<TC, TE> {
  const out = (error: Error, _return?: Predicate<TC, TE>) => {
    return defaultReturn({
      config: {
        strict: strict,
        value: returnTrue,
      },
      _return,
      error,
    });
  };

  if (!guard) return out(ERRORS.guard.notDefined.error);

  if (isDescriber(guard)) {
    const arg = predicates?.[guard.name];
    return out(ERRORS.guard.notDescribed.error, arg);
  }

  if (isString(guard)) {
    const arg = predicates?.[guard];
    return out(ERRORS.guard.notProvided.error, arg);
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

export const toPredicate: ToPredicateF = ({
  guard,
  predicates,
  strict,
}) => {
  const out1 = _toPredicate(guard, predicates, strict);
  return recursive(out1);
};
