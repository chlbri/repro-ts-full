import type { SimpleGuardDef } from '@bemedev/boolean-recursive';
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
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = (context: TC, event: TE) => boolean;

export type PredicateUnion<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = PredicateS<TC, TE> | PredicateAnd<TC, TE> | PredicateOr<TC, TE>;

export type PredicateAnd<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = {
  [k in and]: PredicateUnion<TC, TE>[];
};

export type PredicateOr<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = {
  [k in or]: PredicateUnion<TC, TE>[];
};

export type Predicate<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = PredicateUnion<TC, TE>;

export type PredicateMap<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = Record<string, PredicateS<TC, TE>>;

type ToPredicateParams<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = {
  guard?: GuardConfig;
  predicates?: PredicateMap<TC, TE>;
  strict?: boolean;
};

export type _ToPredicateF = <
  TC extends PrimitiveObject,
  TE extends EventObject,
>(
  params: ToPredicateParams<TC, TE>,
) => Predicate<TC, TE>;

export type ToPredicate_F = <
  TC extends PrimitiveObject,
  TE extends EventObject,
>(
  params: ToPredicateParams<TC, TE>,
) => SimpleGuardDef<[context: TC, event: TE]>;
