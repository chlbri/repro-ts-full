import type {
  Fn,
  NOmit,
  NotUndefined,
  UnionToIntersection2,
} from '@bemedev/types';
import type { AllowedNames, SubType } from 'src/types/subtype';
import type { ActionConfig, FromActionConfig } from '~actions';
import type { EventsMap } from '~events';
import type { AnyMachine } from '~machine';
import type { PromiseConfig } from '~promises';
import type {
  ExtractActionsFromTransitions,
  ExtractDelaysFromTransitions,
  ExtractGuardsFromTransitions,
  ExtractSrcFromTransitions,
  TransitionConfig,
  TransitionsConfig,
} from '~transitions';
import type {
  Describer2,
  FnMap,
  Identitfy,
  PrimitiveObject,
  ReduceArray,
  SingleOrArrayL,
  SingleOrArrayR,
} from '~types';

export type NodeConfig =
  | NodeConfigAtomic
  | NodeConfigCompound
  | NodeConfigParallel;

export type NodeConfigWithInitials =
  | NodeConfigAtomic
  | NodeConfigCompoundWithInitials
  | NodeConfigParallelWithInitials;

export type SNC = NodeConfig;

export type NodesConfig = Record<string, NodeConfig>;
export type NodesConfigWithInitials = Record<
  string,
  NodeConfigWithInitials
>;

export type ActivityConfig = Record<string, SingleOrArrayL<ActionConfig>>;

export type ExtractActionsFromActivity<
  T extends { activities: ActivityConfig },
> = T['activities'] extends infer TA extends ActivityConfig
  ? { [key in keyof TA]: FromActionConfig<ReduceArray<TA[key]>> }[keyof TA]
  : never;

export type ExtractDelaysFromActivity<T> = 'activities' extends keyof T
  ? T['activities'] extends infer TA extends ActivityConfig
    ? TA extends any
      ? keyof TA
      : never
    : never
  : never;

export type CommonNodeConfig = {
  readonly id?: string;
  readonly description?: string;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly activities?: ActivityConfig;
};

export type NodeConfigAtomic = TransitionsConfig &
  CommonNodeConfig & {
    readonly type?: 'atomic';
    readonly id?: string;
    readonly initial?: never;
    readonly states?: never;
  };

export type NodeConfigCompound = TransitionsConfig &
  CommonNodeConfig & {
    readonly type?: 'compound';
    readonly initial?: never;
    readonly states: NodesConfig;
  };

export type NodeConfigCompoundWithInitials = TransitionsConfig &
  CommonNodeConfig & {
    readonly initial: string;
    readonly type?: 'compound';
    readonly states: NodesConfigWithInitials;
  };

export type NodeConfigParallel = TransitionsConfig &
  CommonNodeConfig & {
    readonly type: 'parallel';
    readonly states: NodesConfig;
  };

export type NodeConfigParallelWithInitials = TransitionsConfig &
  CommonNodeConfig & {
    readonly type: 'parallel';
    readonly initial?: never;
    readonly states: NodesConfigWithInitials;
  };

export type ConfigNode = NodeConfigCompound | NodeConfigParallel;
export type ConfigNodeWithInitials =
  | NodeConfigCompoundWithInitials
  | NodeConfigParallelWithInitials;

export type Config = ConfigNode & {
  readonly machines?: SingleOrArrayR<ActionConfig>;
  readonly strict?: boolean;
};

export type ConfigWithInitials = ConfigNodeWithInitials & {
  machines?: SingleOrArrayR<ActionConfig>;
  strict?: boolean;
};

type FlatMapNodeConfig<
  T extends NodeConfig,
  withChildren extends boolean = true,
  Remaining extends string = '/',
> = 'states' extends keyof T
  ? {
      readonly [key in keyof T['states'] as `${Remaining}${key & string}`]: withChildren extends true
        ? T['states'][key]
        : Omit<T['states'][key], 'states'>;
    } & (T['states'][keyof T['states']] extends infer S
      ? S extends NodeConfigParallel | NodeConfigCompound
        ? FlatMapNodeConfig<
            S,
            withChildren,
            `${Remaining}${AllowedNames<NotUndefined<T['states']>, { states: NodesConfig }> & string}/`
          >
        : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
          {}
      : never)
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

export type FlatMapN<
  T extends NodeConfig = NodeConfig,
  withChildren extends boolean = true,
> = UnionToIntersection2<FlatMapNodeConfig<T, withChildren>> & {
  readonly '/': T;
};

export type FlatMap_F<T extends NodeConfig = NodeConfig> = <
  const SN extends T,
  WC extends boolean = true,
>(
  config: SN,
  withChildren?: WC,
  delimiter?: string,
  path?: string,
) => FlatMapN<SN, WC>;

export type GetInititalsFromFlat<Flat extends FlatMapN = FlatMapN> =
  SubType<
    Flat,
    { type?: 'compound'; states: NodesConfig }
  > extends infer Sub
    ? {
        [key in keyof Sub]: keyof ('states' extends keyof Sub[key]
          ? Sub[key]['states']
          : never);
      }
    : never;

export type GetInititals<NC extends Config> =
  FlatMapN<NC> extends infer Flat extends object
    ? SubType<
        Flat,
        { type?: 'compound'; states: NodesConfig }
      > extends infer Sub
      ? {
          [key in keyof Sub]: keyof ('states' extends keyof Sub[key]
            ? Sub[key]['states']
            : never);
        }
      : never
    : never;

type _GetKeyActionsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractActionsFromTransitions<Extract<Flat[key], TransitionsConfig>>
    | ExtractActionsFromActivity<
        Extract<Flat[key], { activities: ActivityConfig }>
      > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

type _GetKeyGuardsFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: ExtractGuardsFromTransitions<
    Extract<Flat[key], TransitionsConfig>
  > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

type _GetKeySrcFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]: ExtractSrcFromTransitions<
    Extract<Flat[key], TransitionsConfig>
  > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

export type _GetKeyDelaysFromFlat<Flat extends FlatMapN> = {
  [key in keyof Flat]:
    | ExtractDelaysFromTransitions<Extract<Flat[key], TransitionsConfig>>
    | ExtractDelaysFromActivity<Flat[key]> extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

export type GetActionsFromFlat<
  Flat extends FlatMapN,
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Record<_GetKeyActionsFromFlat<Flat>, Action<E, Pc, Tc>>;

export type PredicateS<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = FnMap<E, Pc, Tc, boolean>;

export type PredicateUnion<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> =
  | PredicateS<E, Pc, Tc>
  | PredicateAnd<E, Pc, Tc>
  | PredicateOr<E, Pc, Tc>;

export type PredicateAnd<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  and: PredicateUnion<E, Pc, Tc>[];
};

export type PredicateOr<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  or: PredicateUnion<E, Pc, Tc>[];
};

export type Predicate<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = PredicateUnion<E, Pc, Tc>;

export type GetGuardsFromFlat<
  Flat extends FlatMapN,
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Record<_GetKeyGuardsFromFlat<Flat>, PredicateS<E, Pc, Tc>>;

export type GetSrcFromFlat<
  Flat extends FlatMapN,
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Record<_GetKeySrcFromFlat<Flat>, PromiseFunction<E, Pc, Tc>>;

export type Delay<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = number | FnMap<E, Pc, Tc>;

export type GetDelaysFromFlat<
  Flat extends FlatMapN,
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Record<_GetKeyDelaysFromFlat<Flat>, Delay<E, Pc, Tc>>;

export type GetMachineKeysFromConfig<C extends Config> = FromActionConfig<
  ReduceArray<NotUndefined<C['machines']>>
>;

export type Child<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = <T extends AnyMachine>(
  machine: T,
  types?: {
    map?: E;
    pContext?: Pc;
    context?: Tc;
  },
) => {
  machine: T;
  subcriber: FnMap<
    EventsMapFrom<T>,
    PrivateContextFrom<T>,
    ContextFrom<T>,
    Tc
  >;
};

export type GetMachinesFromConfig<
  C extends Config,
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = Record<GetMachineKeysFromConfig<C>, Child<E, Pc, Tc>>;

export type MachineOptions<
  C extends Config = Config,
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Flat extends FlatMapN<C> = FlatMapN<C>,
> = {
  initials: GetInititalsFromFlat<Flat>;
  actions?: Partial<GetActionsFromFlat<Flat, E, Pc, Tc>>;
  guards?: Partial<GetGuardsFromFlat<Flat, E, Pc, Tc>>;
  promises?: Partial<GetSrcFromFlat<Flat, E, Pc, Tc>>;
  delays?: Partial<GetDelaysFromFlat<Flat, E, Pc, Tc>>;
  machines?: Partial<GetMachinesFromConfig<C, E, Pc, Tc>>;
};

export type KeyU<S extends string> = Record<S, unknown>;

export type MachineOptionsFrom<T extends KeyU<'mo'>> = T['mo'];

export type MoF<T extends KeyU<'mo'>> = MachineOptionsFrom<T>;

export type ConfigFrom<T extends KeyU<'preConfig'>> = T['preConfig'];

export type PrivateContextFrom<T extends KeyU<'pContext'>> = T['pContext'];

export type ContextFrom<T extends KeyU<'context'>> = T['context'];

export type EventsMapFrom<T extends KeyU<'eventsMap'>> = T['eventsMap'];

export type EventsFrom<T extends KeyU<'events'>> = T['events'];

export type ActionsFrom<T extends KeyU<'actions'>> = NotUndefined<
  T['actions']
>;

export type ActionFrom<T extends KeyU<'action'>> =
  NotUndefined<T['action']> extends infer A extends any[] ? A : never;

export type ActionParamsFrom<T extends KeyU<'actionParams'>> =
  NotUndefined<T['actionParams']>;

export type ActionKeysFrom<T extends KeyU<'actions'>> =
  keyof ActionsFrom<T>;

export type GuardsFrom<T extends KeyU<'guards'>> = NotUndefined<
  T['guards']
>;

export type GuardKeysFrom<T extends KeyU<'guards'>> = keyof GuardsFrom<T>;

export type DelaysFrom<T extends KeyU<'delays'>> = NotUndefined<
  T['delays']
>;

export type DelayKeysFrom<T extends KeyU<'delays'>> = keyof DelaysFrom<T>;

export type PromisesFrom<T extends KeyU<'promises'>> = NotUndefined<
  T['promises']
>;

export type PromiseKeysFrom<T extends KeyU<'promises'>> =
  keyof PromisesFrom<T>;

export type MachinesFrom<T extends KeyU<'machines'>> = NotUndefined<
  T['machines']
>;

export type MachineKeysFrom<T extends KeyU<'machines'>> =
  keyof MachinesFrom<T> extends infer M
    ? unknown extends M
      ? never
      : M
    : never;

export type RecordS<T> = Record<string, T>;

export type SimpleMachineOptions<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  initials: RecordS<string>;
  actions?: Partial<RecordS<Action<E, Pc, Tc>>>;
  guards?: Partial<RecordS<PredicateS<E, Pc, Tc>>>;
  promises?: Partial<RecordS<PromiseFunction<E, Pc, Tc>>>;
  delays?: Partial<RecordS<Delay<E, Pc, Tc>>>;
  machines?: Partial<RecordS<any>>;
};

export type SimpleMachineOptions2 = {
  initials: any;
  actions?: any;
  guards?: any;
  promises?: any;
  delays?: any;
  machines?: any;
};

export type CreateConfig_F = <const T extends Config>(config: T) => T;

export type StateType = 'atomic' | 'compound' | 'parallel';

export type GetStateType_F = (
  node: NodeConfig | NodeConfigWithInitials,
) => StateType;

export type SimpleStateConfig = {
  type: StateType;
  initial?: string;
  states: Identitfy<SimpleStateConfig>[];
  entry: Describer2[];
  exit: Describer2[];
  tags: string[];
};

export type ToSimple_F = Fn<
  [state: NodeConfig | NodeConfigWithInitials],
  SimpleStateConfig
>;

type ResoleStateParams<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  config: NodeConfigWithInitials;
  options?: SimpleMachineOptions<E, Pc, Tc>;
  strict?: boolean;
};

export type Node<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  id?: string;
  description?: string;
  type: StateType;
  entry: Action<E, Pc, Tc>[];
  exit: Action<E, Pc, Tc>[];
  tags: string[];
  states: Identitfy<Node<E, Pc, Tc>>[];
  initial?: string;
} & Transitions<E, Pc, Tc>;

export type ResolveState_F = <
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
>(
  params: ResoleStateParams<E, Pc, Tc>,
) => Node<E, Pc, Tc>;

export type Transition<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  readonly target: string[];
  // readonly internal?: boolean;
  readonly actions: Action<E, Pc, Tc>[];
  readonly guards: Predicate<E, Pc, Tc>[];
  readonly description?: string;
  readonly in: string[];
};

export type Transitions<
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
> = {
  on: Identitfy<Transition<E, Pc, Tc>>[];
  always: Transition<E, Pc, Tc>[];
  after: Identitfy<Transition<E, Pc, Tc>>[];
  promises: Promisee<E, Pc, Tc>[];
};

export type ToTransition_F = <
  E extends EventsMap = EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
>(
  transition: TransitionConfig,
  options?: {
    actions?: Partial<Record<string, Action<E, Pc, Tc>>>;
    guards?: Partial<Record<string, PredicateS<E, Pc, Tc>>>;
  },
  strict?: boolean,
) => Transition<E, Pc, Tc>;

export type PromiseFunction<
  E extends EventsMap = EventsMap,
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
> = FnMap<E, Pc, TC, Promise<any>>;

export type ToPromiseSrc_F = <
  E extends EventsMap = EventsMap,
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
>(params: {
  src: ActionConfig;
  promises?: SimpleMachineOptions<E, Pc, TC>['promises'];
  strict?: boolean;
}) => PromiseFunction<E, Pc, TC>;

export type Promisee<
  E extends EventsMap = EventsMap,
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
> = FnMap<E, Pc, TC>;

export type ToPromise_F = <
  E extends EventsMap = EventsMap,
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
>(params: {
  promise: PromiseConfig;
  options?: NOmit<SimpleMachineOptions<E, Pc, TC>, 'delays'>;
  strict?: boolean;
}) => Promisee<E, Pc, TC>;

export type StateMap = {
  states?: Record<string, StateMap>;
  type: StateType;
  id: string;
};

export type Values<T> = NotUndefined<
  NotUndefined<T>[keyof NotUndefined<T>]
>;

export type Keys<T> = keyof NotUndefined<T>;

export type Action<
  E extends EventsMap,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  R = any,
> = FnMap<E, Pc, Tc, R>;
// export type ToAction_F = {};
