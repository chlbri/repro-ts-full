import type { KeysMatching } from '@bemedev/decompose';
import type { FlatMapByKeys, Fn, PickKeysBy } from '@bemedev/types';
import type { Action, ActionConfig } from '~actions';
import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import type { Transitions, TransitionsConfig } from '~transitions';
import type {
  Define,
  Describer2,
  Identitfy,
  PrimitiveObject,
  SingleOrArrayR,
} from '~types';

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

export type IsParallel_F = (
  arg: unknown,
) => arg is StateNodeConfigParallel;

export type SimpleStateConfig = {
  type: StateType;
  initial?: string;
  states: Identitfy<SimpleStateConfig>[];
  entry: Describer2[];
  exit: Describer2[];
  tags: string[];
};

export const restSimpleState = {
  entry: [],
  exit: [],
  tags: [],
  states: [],
};

export const DEFAULT_SIMPLE_STATE_CONFIG_A: SimpleStateConfig = {
  type: 'atomic',
  ...restSimpleState,
};

export const DEFAULT_SIMPLE_STATE_CONFIG_C: SimpleStateConfig = {
  type: 'compound',
  initial: 'state1',
  ...restSimpleState,
  states: [
    {
      __id: 'state1',
      type: 'atomic',
      ...restSimpleState,
    },
  ],
};

export const DEFAULT_SIMPLE_STATE_CONFIG_P: SimpleStateConfig = {
  type: 'parallel',
  ...restSimpleState,
  states: [
    {
      __id: 'state1',
      type: 'atomic',
      ...restSimpleState,
    },
    {
      __id: 'state2',
      type: 'atomic',
      ...restSimpleState,
    },
  ],
};

export const DEFAULT_SIMPLE_CONFIGS = {
  atomic: DEFAULT_SIMPLE_STATE_CONFIG_A,
  compound: DEFAULT_SIMPLE_STATE_CONFIG_C,
  parallel: DEFAULT_SIMPLE_STATE_CONFIG_P,
};

export type ToSimple_F = Fn<[state: SNC], SimpleStateConfig>;

export type GetInitialStateConfig_F = Fn<[body: SNC], SNC>;
export type GetInitialSimpleState_F = Fn<[body: SNC], SimpleStateConfig>;

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
  withChildren?: boolean,
  delimiter?: string,
  path?: string,
) => FlatMapStateNodeConfig<SN>;

export type GetStateType_F = (node: StateNodeConfig) => StateType;

export type StateNode<
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
> = {
  id?: string;
  description?: string;
  type: StateType;
  entry: Action<TC, TE>[];
  exit: Action<TC, TE>[];
  tags: string[];
  states: Identitfy<StateNode<TC, TE>>[];
  initial?: string;
} & Transitions<TC, TE>;

type ResoleStateParams<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = {
  config: StateNodeConfig;
  options?: MachineOptions<Tc, Te>;
  strict?: boolean;
};

export type ResolveState_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
>(
  params: ResoleStateParams<Tc, Te>,
) => StateNode<Tc, Te>;

export type StateMap = {
  states?: Record<string, StateMap>;
  type: StateType;
};

export type ToStateValue_F = (node: StateNodeConfig) => StateMap;

export type StateValue = string | StateValueMap;

export interface StateValueMap {
  [key: string]: StateValue;
}

type ResoleStateValueParams<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = {
  config: StateValue;
  options?: MachineOptions<Tc, Te>;
  strict?: boolean;
};

export type ResolveStateValue_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
>(
  params: ResoleStateValueParams<Tc, Te>,
) => StateNode<Tc, Te>;

export type GetInitialStateValue_F = Fn<[body: any], StateValue>;

export type ValueToNode_F = <T extends StateValue>(
  body: StateNodeConfig,
  from: T,
) => StateNodeConfig;

export type NodeToValue_F = (body: StateNodeConfig) => StateValue;

export type GetNextStateValue_F = <T extends StateValue>(
  from: T,
  target?: string | undefined,
) => StateValue;

export type GetNextStateConfig_F = Fn<
  [actuals: { from: StateValue; body: SNC; to: string }],
  StateNodeConfig
>;

export type GetNextSimple_F = Fn<
  [actuals: { from: StateValue; body: SNC; to: string }],
  SimpleStateConfig
>;
