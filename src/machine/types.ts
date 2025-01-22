import type { SubType } from '@bemedev/basicfunc';
import type { NotUndefined, UnionToIntersection2 } from '@bemedev/types';
import type { Action, ActionConfig } from '~actions';
import type { ChildConfig } from '~children';
import type { Delay } from '~delays';
import type { EventObject } from '~events';
import type { PredicateS } from '~guards';
import type { PromiseFunction } from '~promises';
import type {
  ExtractActionsFromTransitions,
  ExtractDelaysFromTransitions,
  ExtractGuardsFromTransitions,
  ExtractSrcFromTransitions,
  TransitionsConfig,
} from '~transitions';
import type { PrimitiveObject, SingleOrArrayR } from '~types';

export type NodeConfig =
  | NodeConfigAtomic
  | NodeConfigCompound
  | NodeConfigParallel;

export type SNC = NodeConfig;

export type NodesConfig = Record<string, NodeConfig>;

export type NodeConfigAtomic = TransitionsConfig & {
  readonly type?: 'atomic';
  readonly id?: string;
  readonly description?: string;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
  readonly states?: never;
};

export type NodeConfigCompound = TransitionsConfig & {
  readonly type?: 'compound';
  readonly id?: string;
  readonly description?: string;
  readonly states: NodesConfig;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
};

export type NodeConfigParallel = TransitionsConfig & {
  readonly type: 'parallel';
  readonly id?: string;
  readonly description?: string;
  readonly states: NodesConfig;
  readonly entry?: SingleOrArrayR<ActionConfig>;
  readonly exit?: SingleOrArrayR<ActionConfig>;
  readonly tags?: SingleOrArrayR<string>;
};

export type Config = (NodeConfigCompound | NodeConfigParallel) & {
  machines?: SingleOrArrayR<ChildConfig>;
  strict?: boolean;
};

type FlatMapNodeConfig<
  T extends NodeConfig,
  Remaining extends string = '/',
> = 'states' extends keyof T
  ? {
      readonly [key in keyof T['states'] as `${Remaining}${key & string}`]: T['states'][key];
    } & (T['states'][keyof T['states']] extends infer S extends NodeConfig
      ? S extends any
        ? FlatMapNodeConfig<
            S,
            `${Remaining}${keyof SubType<NotUndefined<T['states']>, { states: NodesConfig }> & string}/`
          >
        : never
      : never)
  : // eslint-disable-next-line @typescript-eslint/no-empty-object-type
    {};

export type FlatMapN<T extends NodeConfig = NodeConfig> =
  UnionToIntersection2<FlatMapNodeConfig<T>> & { readonly '/': T };

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
  [key in keyof Flat]: ExtractActionsFromTransitions<
    Extract<Flat[key], TransitionsConfig>
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
  [key in keyof Flat]: ExtractDelaysFromTransitions<
    Extract<Flat[key], TransitionsConfig>
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
  NC extends Config,
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
  Flat extends FlatMapN<NC> = FlatMapN<NC>,
> = {
  initials?: Partial<GetInititalsFromFlat<Flat>>;
  actions?: Partial<GetActionsFromFlat<Flat, Tc, Te>>;
  guards?: Partial<GetGuardsFromFlat<Flat, Tc, Te>>;
  promises?: Partial<GetSrcFromFlat<Flat, Tc, Te>>;
  delays?: Partial<GetDelaysFromFlat<Flat, Tc, Te>>;

  //TODO: Add activities
};

export type CreateConfig_F = <const T extends Config>(config: T) => T;
