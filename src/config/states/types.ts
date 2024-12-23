import type { KeysMatching } from '@bemedev/decompose';
import type { FlatMapByKeys, PickKeysBy } from '@bemedev/types';
import type { Define, SingleOrArrayR } from '~types';
import type { ActionConfig } from '../action';
import type { TransitionsConfig } from '../transitions';

export type StateType = 'atomic' | 'compound' | 'parallel';

export type ReducedStateNodeConfig = {
  states?: Record<string, ReducedStateNodeConfig>;
} & Record<string, any>;

export type StringKeys<T extends ReducedStateNodeConfig> = KeysMatching<T>;

export type StateNodesConfig = Record<string, StateNodeConfig>;

export type StateNodeConfig =
  | StateNodeConfigAtomic
  | StateNodeConfigCompound
  | StateNodeConfigParallel;

export type SNC = StateNodeConfig;

export type StateNodeConfigAtomic = TransitionsConfig & {
  readonly type?: 'atomic';
  readonly id?: string;
  readonly description?: string;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly states?: never;
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
};

export type ChildrenM =
  | string
  | { id?: string; src: string; events?: SingleOrArrayR<string> };

export type Config = (
  | StateNodeConfigCompound
  | StateNodeConfigParallel
  | StateNodeConfigAtomic
) & {
  machines?: SingleOrArrayR<ChildrenM>;
};

type _FlatMapStateNodeConfigOptions = {
  withStates?: boolean;
  delimiter?: string;
};

export type FlatMapStateNodeConfig<
  T extends StateNodeConfig,
  Options extends _FlatMapStateNodeConfigOptions = {
    withStates: true;
    delimiter: '/';
  },
> = 'states' extends infer S extends PickKeysBy<T, object>
  ? FlatMapByKeys<
      T,
      S,
      {
        with: Options['withStates'];
        delimiter: Options['delimiter'];
      }
    >
  : {
      [key in Define<Options['delimiter'], '/'>]: T;
    };
