import type { KeysMatching } from '@bemedev/decompose';
import type { FlatMapByKeys, PickKeysBy } from '@bemedev/types';
import type { Action, ActionConfig } from '~actions';
import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import type { Transitions, TransitionsConfig } from '~transitions';
import type { Define, Identitfy, SingleOrArrayR } from '~types';

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

export type FlatMapState_F<T extends StateNodeConfig = StateNodeConfig> = <
  const SN extends T,
>(
  config: SN,
  delimiter?: string,
  path?: string,
) => FlatMapStateNodeConfig<SN>;

export type GetStateType_F = (node: StateNodeConfig) => StateType;

export type StateNode<TC, TE extends EventObject = EventObject> = {
  id?: string;
  description?: string;
  type: StateType;
  entry: Action<TC, TE>[];
  exit: Action<TC, TE>[];
  tags: string[];
  states: Identitfy<StateNode<TC, TE>>[];
  initial?: string;
} & Transitions<TC, TE>;

type ResoleStateParams<Tc, Te extends EventObject = EventObject> = {
  config: StateNodeConfig;
  options?: MachineOptions<Tc, Te>;
  strict?: boolean;
};

export type ResolveState_F = <Tc, Te extends EventObject = EventObject>(
  params: ResoleStateParams<Tc, Te>,
) => StateNode<Tc, Te>;
