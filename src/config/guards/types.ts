import type { ActionConfig } from '../action';
import type { GUARD_TYPE } from '../constants';
import type { EventObject } from '../events';

type gType = typeof GUARD_TYPE;
type and = gType['and'];
type or = gType['or'];

export type GuardUnion = ActionConfig | GuardAnd | GuardOr;

export type GuardAnd = {
  [k in and]: GuardUnion[];
};

export type GuardOr = {
  [k in or]: GuardUnion[];
};

export type GuardConfig = GuardUnion;

export type PredicateS<TC, TE extends EventObject> = (
  context: TC,
  event: TE,
) => boolean;

export type PredicateUnion<TC, TE extends EventObject> =
  | PredicateS<TC, TE>
  | PredicateAnd<TC, TE>
  | PredicateOr<TC, TE>;

export type PredicateAnd<TC, TE extends EventObject> = {
  [k in and]: PredicateUnion<TC, TE>[];
};

export type PredicateOr<TC, TE extends EventObject> = {
  [k in or]: PredicateUnion<TC, TE>[];
};

export type Predicate<TC, TE extends EventObject> = PredicateUnion<TC, TE>;

export type PredicateMap<TC, TE extends EventObject> = Record<
  string,
  PredicateS<TC, TE>
>;

export type EvaluateGuardParams<TC, TE extends EventObject> = {
  guard: GuardConfig;
  predicates?: PredicateMap<TC, TE>;
  args: {
    context: TC;
    event: TE;
  };
};
