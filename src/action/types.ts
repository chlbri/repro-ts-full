import type { EventObject } from '../events';
import type { Describer } from '../types';

export type ActionConfig = string | Describer;

export type Action<TC, TE extends EventObject, R = any> = (
  context: TC,
  event: TE,
) => R;

export type ActionMap<TC, TE extends EventObject> = Record<
  string,
  Action<TC, TE>
>;

export type toActionParams<TC, TE extends EventObject> = {
  actionConfig?: ActionConfig;
  actions?: ActionMap<TC, TE>;
  _default?: boolean;
};

export type ToActionFunction = <TC, TE extends EventObject>(
  params: toActionParams<TC, TE>,
) => Action<TC, TE>;

export type PerformActionParams<TC, TE extends EventObject> = {
  action?: ActionConfig;
  actions?: ActionMap<TC, TE>;
  _default?: boolean;
  args: {
    context: TC;
    event: TE;
  };
};

export type PerformActionFunction = <TC, TE extends EventObject>(
  params: PerformActionParams<TC, TE>,
) => any;
