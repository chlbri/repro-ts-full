import type { Fn, NOmit, ReduceArray, Require } from '@bemedev/types';
import type { EventObject } from '~events';
import type { Identitfy, SingleOrArrayL } from '~types';
import type { Action, ActionConfig } from '~actions';
import type { GuardConfig, Predicate } from '~guards';

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

export type FinallyConfig =
  Pick<
    TransitionConfigMapA,
    'description' | 'actions' | 'guards' | 'in'
  > extends infer F extends Pick<
    TransitionConfigMapA,
    'description' | 'actions' | 'guards' | 'in'
  >
    ?
        | (F | string)
        | readonly [
            ...(Require<F, 'guards'> | Require<F, 'in'>)[],
            F | string,
          ]
    : never;

export type ThenNext = TransitionConfigMapF | TransitionConfigMapA;

export type PromiseConfig = {
  readonly src: string;
  readonly id?: string;

  // #region To perform
  // readonly autoForward?: boolean;
  // #endregion

  readonly description?: string;
  readonly then: SingleOrArrayT;
  readonly catch: SingleOrArrayT;
  readonly finally?: FinallyConfig;
};

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
  readonly in?: string[];
};

export type Promisee<TC, TE extends EventObject = EventObject, R = any> = {
  readonly src: Fn<[TC, TE], Promise<R>>;
  readonly id?: string;
  readonly description?: string;
  readonly then: Transition<TC, TE>[];
  readonly catch: Transition<TC, TE>[];
  readonly finally: NOmit<Transition<TC, TE>, 'target'>[];
};

export type Transitions<
  TC,
  TE extends EventObject = EventObject,
  R = any,
> = {
  on: Identitfy<Transition<TC, TE>>[];
  always: Transition<TC, TE>[];
  after: Transition<TC, TE>[];
  promises: Promisee<TC, TE, R>[];
};
