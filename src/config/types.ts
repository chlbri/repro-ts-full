import type {
  PrimitiveObject,
  SingleOrArrayR,
} from 'src/types/primitives';
import type { ActionMap } from '~actions';
import type { Child, ChildConfig, MachineMap } from '~children';
import type { DelayMap } from '~delays';
import type { EventObject } from '~events';
import type { PredicateMap } from '~guards';
import type { PromiseMap } from '~promises';
import type {
  FlatMapState_F,
  StateNode,
  StateNodeConfigCompound,
  StateNodeConfigParallel,
} from '~states';

export type Config = (
  | StateNodeConfigCompound
  | StateNodeConfigParallel
) & {
  machines?: SingleOrArrayR<ChildConfig>;
  strict?: boolean;
};

export type FlatMapMachine_F = FlatMapState_F<Config>;

export type MachineOptions<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
  M extends MachineMap = MachineMap,
> = {
  guards?: PredicateMap<Tc, Te>;
  actions?: ActionMap<Tc, Te>;
  promises?: PromiseMap<Tc, Te>;
  delays?: DelayMap<Tc, Te>;
  initials?: Record<string, string>;
  children?: M;
};

type ResoleConfigParams<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = [config: Config, options?: MachineOptions<Tc, Te>];

export type Machine0<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = StateNode<Tc, Te> & {
  machines: Child[];
  strict: boolean;
};

export type ResolveConfig_F = <
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
>(
  ...params: ResoleConfigParams<Tc, Te>
) => Machine0<Tc, Te>;

export type CreateConfig_F = <const T extends Config>(config: T) => T;
