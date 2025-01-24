import type { GuardDefUnion } from '@bemedev/boolean-recursive';
import type { ActionConfig, FromAction } from '~actions';
import type { GUARD_TYPE } from '~constants';
import type { EventObject } from '~events';
import type { PrimitiveObject, ReduceArray } from '~types';

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

export type FromGuard<T extends GuardConfig> = T extends ActionConfig
  ? FromAction<T>
  : T extends GuardAnd
    ? FromGuard<ReduceArray<T['and']>>
    : T extends GuardOr
      ? FromGuard<ReduceArray<T['or']>>
      : never;

export type PredicateS<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = (pContext: Pc, context: TC, event: TE) => boolean;

export type PredicateUnion<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> =
  | PredicateS<Pc, TC, TE>
  | PredicateAnd<Pc, TC, TE>
  | PredicateOr<TC, TE>;

export type PredicateAnd<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = {
  and: PredicateUnion<Pc, TC, TE>[];
};

export type PredicateOr<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = {
  or: PredicateUnion<Pc, TC, TE>[];
};

export type Predicate<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = PredicateUnion<Pc, TC, TE>;

export type PredicateMap<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = Record<string, PredicateS<Pc, TC, TE>>;

type ToPredicateParams<
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = {
  guard?: GuardConfig;
  predicates?: PredicateMap<Pc, TC, TE>;
  strict?: boolean;
};

export type _ToPredicateF = <
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
>(
  params: ToPredicateParams<Pc, TC, TE>,
) => GuardDefUnion<[Pc, TC, TE]>;

export type ToPredicate_F = <
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
>(
  params: ToPredicateParams<Pc, TC, TE>,
) => PredicateS<Pc, TC, TE>;
