import type { EventObject } from '~events';
import type { Describer, FromDescriber, PrimitiveObject } from '~types';

export type ActionConfig = string | Describer;

export type FromAction<T extends ActionConfig> = T extends Describer
  ? FromDescriber<T>
  : T;

export type Action<
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
  R = any,
> = (context: TC, event: TE) => R;

export type ActionMap<
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = Partial<Record<string, Action<TC, TE>>>;

export type toActionParams<
  TC extends PrimitiveObject,
  TE extends EventObject,
> = {
  action?: ActionConfig;
  actions?: ActionMap<TC, TE>;
  strict?: boolean;
};

export type ToAction_F = <
  TC extends PrimitiveObject,
  TE extends EventObject,
>(
  params: toActionParams<TC, TE>,
) => Action<TC, TE>;

export type ReduceAction_F = (action: ActionConfig) => string;
