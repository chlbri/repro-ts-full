import type { ReduceArray, Require } from '@bemedev/types';
import type { SingleOrArrayR } from '~types';
import type { ActionConfig } from '../action';
import type { GuardConfig } from '../guards';

type TransitionConfigMap = {
  readonly target?: SingleOrArrayR<string>;
  // readonly internal?: boolean;
  readonly actions?: SingleOrArrayR<ActionConfig>;
  readonly guards?: SingleOrArrayR<GuardConfig>;
  readonly description?: string;
  readonly in?: SingleOrArrayR<string>;
};

export type TransitionConfig = string | TransitionConfigMap;

export type TransitionConfigMapF = Require<TransitionConfigMap, 'target'>;

export type TransitionConfigF = string | TransitionConfigMapF;

export type ArrayTransitions = readonly [
  ...(readonly Require<TransitionConfigMap, 'guards'>[]),
  TransitionConfigF,
];

export type SingleOrArrayT = ArrayTransitions | TransitionConfig;

export type Finally =
  | (Pick<
      TransitionConfigMap,
      'description' | 'actions' | 'guards'
    > extends infer F extends Pick<
      TransitionConfigMap,
      'description' | 'actions' | 'guards'
    >
      ? F | readonly [...(readonly Require<F, 'guards'>[]), F]
      : never)
  | string;

export type PromiseConfig = {
  readonly promise: string;
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

export type AlwaysConfig = ArrayTransitions | TransitionConfigF;

export type DelayedTransitions = Record<string, SingleOrArrayT>;

export type TransitionsConfig = {
  readonly on?: DelayedTransitions;
  readonly always?: AlwaysConfig;
  readonly after?: DelayedTransitions;
  readonly invoke?: SingleOrArrayR<PromiseConfig>;
};

export type _ExtractTargetsFromConfig<T extends AlwaysConfig> = T extends {
  target: string;
}
  ? T['target']
  : T;

export type ExtractTargetsFromConfig<T> = _ExtractTargetsFromConfig<
  Extract<ReduceArray<T>, AlwaysConfig>
>;
