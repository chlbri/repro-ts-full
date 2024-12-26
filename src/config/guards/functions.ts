import recursive from '@bemedev/boolean-recursive';
import { defaultReturn } from 'src/utils';
import { isDescriber, isString } from '../../types';
import { DEFAULT_NOTHING, ERRORS, GUARD_TYPE } from '../constants';
import type { EventObject } from '../events';
import type {
  EvaluateGuardF,
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

function _toPredicate<TC, TE extends EventObject>(
  guard?: GuardConfig,
  predicates?: PredicateMap<TC, TE>,
  bool = true,
): Predicate<TC, TE> {
  const _return = (error: Error, _return?: Predicate<TC, TE>) => {
    return defaultReturn({
      _default: {
        bool,
        value: returnTrue,
      },
      _return,
      error,
    });
  };
  if (!guard) {
    return _return(ERRORS.guard.notDefined.error);
  }

  if (isString(guard)) {
    const arg = predicates?.[guard];
    return _return(ERRORS.guard.notProvided.error, arg);
  }

  if (isDescriber(guard)) {
    const arg = predicates?.[guard.name];
    return _return(ERRORS.guard.notDescribed.error, arg);
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
  _default,
}) => {
  const out1 = _toPredicate(guard, predicates, _default);
  return recursive(out1);
};

export const evaluateGuard: EvaluateGuardF = ({
  args: { context, event },
  ...params
}) => {
  const out1 = toPredicate(params);
  const out2 = out1(context, event);

  return out2;
};
