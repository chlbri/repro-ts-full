import type { Fn, NOmit, Require } from '@bemedev/types';
import type { ActionConfig } from '~actions';
import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import type {
  ExtractActionsFromDelayed,
  SingleOrArrayT,
  Transition,
  TransitionConfigMapA,
} from '~transitions';
import type { PrimitiveObject } from '~types';

export type PromiseFunction<Tc, Te extends EventObject, R = any> = Fn<
  [Tc, Te],
  Promise<R>
>;

export type PromiseMap<Tc, Te extends EventObject> = Record<
  string,
  PromiseFunction<Tc, Te>
>;

export type FinallyConfig =
  NOmit<TransitionConfigMapA, 'target'> extends infer F extends NOmit<
    TransitionConfigMapA,
    'target'
  >
    ?
        | (F | string)
        | readonly [
            ...(Require<F, 'guards'> | Require<F, 'in'>)[],
            F | string,
          ]
    : never;

export type PromiseConfig = {
  readonly src: ActionConfig;
  readonly id?: string;

  // #region To perform
  // readonly autoForward?: boolean;
  // #endregion
  readonly max?: number;
  readonly description?: string;
  readonly then: SingleOrArrayT;
  readonly catch: SingleOrArrayT;
  readonly finally?: FinallyConfig;
};

export type ExtractActionsFromPromise<T extends PromiseConfig> =
  | ExtractActionsFromDelayed<T['then']>
  | ExtractActionsFromDelayed<T['catch']>
  | ExtractActionsFromDelayed<T['finally']>;

export type Promisee<
  TC extends PrimitiveObject,
  TE extends EventObject = EventObject,
> = {
  readonly src: PromiseFunction<TC, TE>;
  readonly id?: string;
  readonly description?: string;
  readonly then: Transition<TC, TE>[];
  readonly catch: Transition<TC, TE>[];
  readonly finally: Transition<TC, TE>[];
};

export type ToPromiseSrc_F = <
  TC extends PrimitiveObject = PrimitiveObject,
  TE extends EventObject = EventObject,
>(params: {
  src: ActionConfig;
  promises?: MachineOptions<TC, TE>['promises'];
  strict?: boolean;
}) => PromiseFunction<TC, TE>;

export type ToPromise_F = <
  TC extends PrimitiveObject,
  TE extends EventObject = EventObject,
>(params: {
  promise: PromiseConfig;
  options?: NOmit<MachineOptions<TC, TE>, 'children' | 'delays'>;
  strict?: boolean;
}) => Promisee<TC, TE>;
