import type { SubType } from '@bemedev/basicfunc';
import type {
  Fn,
  NOmit,
  NotUndefined,
  UnionToIntersection2,
} from '@bemedev/types';
import type { Action, ActionConfig, FromAction } from '~actions';
import type { ChildConfig } from '~children';
import type { Delay } from '~delays';
import type { EventObject } from '~events';
import type { PredicateS } from '~guards';
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
  | NodeConfigParallel;

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

export type ExtractDelaysFromActivity<
  T extends { activities: ActivityConfig },
> = T['activities'] extends infer TA extends ActivityConfig
  ? TA extends any
    ? keyof TA
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
    readonly initial?: never;
    readonly id?: string;
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
    readonly initial?: never;
  };

export type Config = (NodeConfigCompound | NodeConfigParallel) & {
  machines?: SingleOrArrayR<ChildConfig>;
  strict?: boolean;
};

export type ConfigWithInitials = (
  | NodeConfigCompoundWithInitials
  | NodeConfigParallel
) & {
  machines?: SingleOrArrayR<ChildConfig>;
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
    } & (T['states'][keyof T['states']] extends infer S extends NodeConfig
      ? S extends any
        ? FlatMapNodeConfig<
            S,
            withChildren,
            `${Remaining}${keyof SubType<NotUndefined<T['states']>, { states: NodesConfig }> & string}/`
          >
        : never
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
    | ExtractDelaysFromActivity<
        Extract<Flat[key], { activities: ActivityConfig }>
      > extends infer V
    ? unknown extends V
      ? never
      : V
    : never;
}[keyof Flat];

export type GetActionsFromFlat<
  Flat extends FlatMapN,
  Tc extends PrimitiveObject,
  Te extends EventObject,
> = Record<_GetKeyActionsFromFlat<Flat>, Action<Tc, Te>>;

export type GetGuardsFromFlat<
  Flat extends FlatMapN,
  Tc extends PrimitiveObject,
  Te extends EventObject,
> = Record<_GetKeyGuardsFromFlat<Flat>, PredicateS<Tc, Te>>;

export type GetSrcFromFlat<
  Flat extends FlatMapN,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<_GetKeySrcFromFlat<Flat>, PromiseFunction<Tc, Te>>;

export type GetDelaysFromFlat<
  Flat extends FlatMapN,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<_GetKeyDelaysFromFlat<Flat>, Delay<Tc, Te>>;

export type MachineOptions<
  NC extends NodeConfig,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
  Flat extends FlatMapN<NC> = FlatMapN<NC>,
> = {
  initials: GetInititalsFromFlat<Flat>;
  actions?: Partial<GetActionsFromFlat<Flat, Tc, Te>>;
  guards?: Partial<GetGuardsFromFlat<Flat, Tc, Te>>;
  promises?: Partial<GetSrcFromFlat<Flat, Tc, Te>>;
  delays?: Partial<GetDelaysFromFlat<Flat, Tc, Te>>;
};

export type RecordS<T> = Record<string, T>;

export type SimpleMachineOptions<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = {
  initials: RecordS<string>;
  actions?: Partial<RecordS<Action<Tc, Te>>>;
  guards?: Partial<RecordS<PredicateS<Tc, Te>>>;
  promises?: Partial<RecordS<PromiseFunction<Tc, Te>>>;
  delays?: Partial<RecordS<Delay<Tc, Te>>>;
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

export type ToSimple_F = Fn<[state: NodeConfig], SimpleStateConfig>;

type ResoleStateParams<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = {
  config: NodeConfig | NodeConfigWithInitials;
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
  TC extends PrimitiveObject,
  TE extends EventObject = EventObject,
>(
  transition: TransitionConfig,
  options?: {
    actions?: Partial<Record<string, Action<TC, TE>>>;
    guards?: Partial<Record<string, PredicateS<TC, TE>>>;
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

// export type ToAction_F = {};
