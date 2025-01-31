import type { Fn } from '@bemedev/types';
import type { ActionConfig } from '~actions';
import type { EventsMap, ToEvents } from '~events';
import type { GuardConfig } from '~guards';
import type { Machine } from '~machine';
import type { PromiseConfig } from '~promises';
import type { PrimitiveObject } from '~types';
import type { Interpreter } from './interpreter';
import type {
  Action2,
  ActionResult,
  Config,
  MachineOptions,
  PredicateS2,
  SimpleMachineOptions2,
} from './types';

export type WorkingStatus =
  | 'idle'
  | 'starting'
  | 'started'
  | 'working'
  | 'stopped'
  | 'busy';

export type Mode = 'normal' | 'strict' | 'strictest';

export type Interpreter_F = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
>(
  machine: Machine<C, Pc, Tc, E, Mo>,
  config: { pContext: Pc; context: Tc; mode?: Mode },
) => Interpreter<C, Pc, Tc, E, Mo>;

export const INIT_EVENT = 'machine$$init';
export const ALWAYS_EVENT = 'machine$$always';

export type InitEvent = typeof INIT_EVENT;
export type AlwaysEvent = typeof ALWAYS_EVENT;

export type ToAction_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (action?: ActionConfig) => Action2<E, Pc, Tc>;

export type PerformAction_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (action: Action2<E, Pc, Tc>) => ActionResult<Pc, Tc>;

export type ToPredicate_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (predicate?: GuardConfig) => PredicateS2<E, Pc, Tc>;

export type PerformPredicate_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (predicate: PredicateS2<E, Pc, Tc>) => boolean;

export type ToDelay_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (delay?: string) => Fn<[Pc, Tc, ToEvents<E>], number>;

export type PerformDelay_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (delay: Fn<[Pc, Tc, ToEvents<E>], number>) => number;

export type ToPromise_F<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = (promise: PromiseConfig) => Fn<[Pc, Tc, ToEvents<E>], number>;
