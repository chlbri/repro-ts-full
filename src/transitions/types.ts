import type { ReduceArray, Require } from '@bemedev/types';
import type { SingleOrArrayL } from '~types';
import type { ActionConfig } from '../action';
import type { GuardConfig } from '../guards';

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

export type Finally =
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

  readonly innerContext?: string;
  readonly description?: string;
  readonly then: SingleOrArrayT;
  readonly catch: SingleOrArrayT;
  readonly finally?: Finally;
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
  readonly promise?: SingleOrArrayL<PromiseConfig>;
};

export type _ExtractTargetsFromConfig<T extends AlwaysConfig> = T extends {
  target: string;
}
  ? T['target']
  : T;

export type ExtractTargetsFromConfig<T> = _ExtractTargetsFromConfig<
  Extract<ReduceArray<T>, AlwaysConfig>
>;
