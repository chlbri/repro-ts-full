import type { ReduceArray, Require } from '@bemedev/types';
import type { Action, ActionConfig } from '~actions';
import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import type { GuardConfig, Predicate } from '~guards';
import type { PromiseConfig, Promisee } from '~promises';
import type { Identitfy, SingleOrArrayL } from '~types';

type _TransitionConfigMap = {
  readonly target?: SingleOrArrayL<string>;
  // readonly internal?: boolean;
  readonly actions?: SingleOrArrayL<ActionConfig>;
  readonly guards?: SingleOrArrayL<GuardConfig>;
  readonly description?: string;
  readonly in?: SingleOrArrayL<string>;
};

export type TransitionConfigMapF = Require<_TransitionConfigMap, 'target'>;
export type TransitionConfigMapA = Require<
  _TransitionConfigMap,
  'actions'
>;

export type TransitionConfigMap =
  | TransitionConfigMapF
  | TransitionConfigMapA;

export type TransitionConfig = string | TransitionConfigMap;

export type TransitionConfigF = string | TransitionConfigMapF;

export type ArrayTransitions = readonly [
  ...(
    | Require<TransitionConfigMapF, 'guards'>
    | Require<TransitionConfigMapA, 'guards'>
    | Require<TransitionConfigMapF, 'in'>
    | Require<TransitionConfigMapA, 'in'>
  )[],
  TransitionConfig,
];

export type SingleOrArrayT = ArrayTransitions | TransitionConfig;

export type ThenNext = TransitionConfigMapF | TransitionConfigMapA;

export type AlwaysConfig =
  | readonly [
      ...Require<TransitionConfigMap, 'guards'>[],
      TransitionConfigF,
    ]
  | TransitionConfigF;

export type DelayedTransitions = Record<string, SingleOrArrayT>;

export type TransitionsConfig = {
  readonly on?: DelayedTransitions;
  readonly always?: AlwaysConfig;
  readonly after?: DelayedTransitions;
  readonly promises?: SingleOrArrayL<PromiseConfig>;
};

export type _ExtractTargetsFromConfig<T extends AlwaysConfig> = T extends {
  target: string;
}
  ? T['target']
  : T;

export type ExtractTargetsFromConfig<T> = _ExtractTargetsFromConfig<
  Extract<ReduceArray<T>, AlwaysConfig>
>;

export type Transition<TC, TE extends EventObject = EventObject> = {
  readonly target: string[];
  // readonly internal?: boolean;
  readonly actions: Action<TC, TE>[];
  readonly guards: Predicate<TC, TE>[];
  readonly description?: string;
  readonly in: string[];
};

export type ToTransition_F = <TC, TE extends EventObject = EventObject>(
  transition: TransitionConfig,
  options?: Pick<MachineOptions<TC, TE>, 'guards' | 'actions'>,
  strict?: boolean,
) => Transition<TC, TE>;

export type Transitions<TC, TE extends EventObject = EventObject> = {
  on: Identitfy<Transition<TC, TE>>[];
  always: Transition<TC, TE>[];
  after: Identitfy<Transition<TC, TE>>[];
  promises: Promisee<TC, TE>[];
};
