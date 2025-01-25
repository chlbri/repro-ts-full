import type { AllowedNames, SubType } from '@bemedev/basicfunc';
import type {
  Fn,
  NOmit,
  NotUndefined,
  UnionToIntersection2,
} from '@bemedev/types';
import type { Action, ActionConfig, FromAction } from '~actions';
import type { Delay } from '~delays';
import type { EventObject } from '~events';
import type { PredicateS } from '~guards';
import type { AnyMachine } from '~machine';
import type { PromiseConfig, Promisee, PromiseFunction } from '~promises';
import type { StateNode } from '~states';
import type {
  ExtractActionsFromTransitions,
  ExtractDelaysFromTransitions,
  ExtractGuardsFromTransitions,
  ExtractSrcFromTransitions,
  Transition,
  TransitionConfig,
  TransitionsConfig,
} from '~transitions';
import type {
  Describer2,
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
  ? { [key in keyof TA]: FromAction<ReduceArray<TA[key]>> }[keyof TA]
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
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<_GetKeyActionsFromFlat<Flat>, Action<Pc, Tc, Te>>;

export type GetGuardsFromFlat<
  Flat extends FlatMapN,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<_GetKeyGuardsFromFlat<Flat>, PredicateS<Pc, Tc, Te>>;

export type GetSrcFromFlat<
  Flat extends FlatMapN,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<_GetKeySrcFromFlat<Flat>, PromiseFunction<Pc, Tc, Te>>;

export type GetDelaysFromFlat<
  Flat extends FlatMapN,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<_GetKeyDelaysFromFlat<Flat>, Delay<Pc, Tc, Te>>;

export type GetMachineKeysFromConfig<C extends Config> = FromAction<
  ReduceArray<NotUndefined<C['machines']>>
>;

export type Child<
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = <T extends AnyMachine>(
  machine: T,
  pContext: Pc,
  context: Tc,
  events: Te,
) => { subscriber: Fn<ActionParamsFrom<T>, Tc>; machine: T };

export type GetMachinesFromConfig<
  C extends Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<GetMachineKeysFromConfig<C>, Child<Pc, Tc, Te>>;

export type MachineOptions<
  NC extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
  Flat extends FlatMapN<NC> = FlatMapN<NC>,
> = {
  initials: GetInititalsFromFlat<Flat>;
  actions?: Partial<GetActionsFromFlat<Flat, Pc, Tc, Te>>;
  guards?: Partial<GetGuardsFromFlat<Flat, Pc, Tc, Te>>;
  promises?: Partial<GetSrcFromFlat<Flat, Pc, Tc, Te>>;
  delays?: Partial<GetDelaysFromFlat<Flat, Pc, Tc, Te>>;
  machines?: Partial<GetMachinesFromConfig<NC, Pc, Tc, Te>>;
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
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = {
  initials: RecordS<string>;
  actions?: Partial<RecordS<Action<Pc, Tc, Te>>>;
  guards?: Partial<RecordS<PredicateS<Pc, Tc, Te>>>;
  promises?: Partial<RecordS<PromiseFunction<Pc, Tc, Te>>>;
  delays?: Partial<RecordS<Delay<Tc, Te>>>;
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
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = {
  config: NodeConfigWithInitials;
  options?: SimpleMachineOptions<Tc, Te>;
  strict?: boolean;
};

export type ResolveState_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
>(
  params: ResoleStateParams<Tc, Te>,
) => StateNode<Tc, Te>;

export type ToTransition_F = <
  Pc = any,
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
>(
  transition: TransitionConfig,
  options?: {
    actions?: Partial<Record<string, Action<Pc, TC, TE>>>;
    guards?: Partial<Record<string, PredicateS<Pc, TC, TE>>>;
  },
  strict?: boolean,
) => Transition<TC, TE>;

export type ToPromiseSrc_F = <
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
>(params: {
  src: ActionConfig;
  promises?: SimpleMachineOptions<TC, TE>['promises'];
  strict?: boolean;
}) => PromiseFunction<TC, TE>;

export type ToPromise_F = <
  TC extends PrimitiveObject,
  TE extends EventObject = EventObject,
>(params: {
  promise: PromiseConfig;
  options?: NOmit<SimpleMachineOptions<TC, TE>, 'delays'>;
  strict?: boolean;
}) => Promisee<TC, TE>;

export type StateMap = {
  states?: Record<string, StateMap>;
  type: StateType;
  id: string;
};

export type Values<T> = NotUndefined<
  NotUndefined<T>[keyof NotUndefined<T>]
>;

export type Keys<T> = keyof NotUndefined<T>;
// export type ToAction_F = {};
