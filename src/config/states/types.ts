import type { KeysMatching } from '@bemedev/decompose';
import type { FlatMapByKeys, PickKeysBy } from '@bemedev/types';
import type { SingleOrArrayR } from '~types';
import type { ActionConfig } from '../action';
import type { TransitionsConfig } from '../transitions';

export type StateType = 'atomic' | 'compound' | 'parallel' | 'final';

export type ReducedStateNodeConfig = {
  states?: Record<string, ReducedStateNodeConfig>;
} & Record<string, any>;

export type StringKeys<T extends ReducedStateNodeConfig> = KeysMatching<T>;

export type StateNodesConfig = Record<string, StateNodeConfig>;

export type StateNodeConfig =
  | StateNodeConfigAtomic
  | StateNodeConfigCompound
  | StateNodeConfigParallel
  | StateNodeConfigFinal;

export type SNC = StateNodeConfig;

export type StateNodeConfigAtomic = TransitionsConfig & {
  readonly type?: 'atomic';
  readonly id?: string;
  readonly description?: string;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly states?: never;
  readonly return?: never;
  readonly initial?: never;
};

export type StateNodeConfigCompound = TransitionsConfig & {
  readonly type?: 'compound';
  readonly id?: string;
  readonly description?: string;
  readonly initial: string;
  readonly states: StateNodesConfig;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly return?: never;
};

export type StateNodeConfigParallel = TransitionsConfig & {
  readonly type: 'parallel';
  readonly id?: string;
  readonly description?: string;
  readonly states: StateNodesConfig;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly initial?: never;
  readonly return?: never;
};

export type StateNodeConfigFinal = {
  readonly type: 'final';
  readonly id?: string;
  readonly description?: string;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly return?: string;
  readonly states?: never;
  readonly exit?: never;
  readonly initial?: never;
};

export type StateNodeConfigForMachine =
  | StateNodeConfigCompound
  | StateNodeConfigParallel
  | StateNodeConfigAtomic;

export type SNC_M = StateNodeConfigForMachine;

export type WithChildren<
  T,
  With extends boolean = true,
> = With extends true ? T : Omit<T, 'states'>;

export type FlatMapStateNodeConfig<
  T extends StateNodeConfig,
  _withStates extends boolean = false,
> = 'states' extends infer S extends PickKeysBy<T, object>
  ? FlatMapByKeys<
      T,
      S,
      {
        with: _withStates;
        delimiter: '/';
      }
    >
  : {
      '/': T;
    };
