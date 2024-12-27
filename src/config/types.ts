import type { ActionMap } from '~actions';
import type { MachineMap } from '~children';
import type { DelayMap } from '~delays';
import type { EventObject } from '~events';
import type { PredicateMap } from '~guards';
import type { PromiseMap } from '~promises';
import type { ChildrenM, FlatMapState_F, SNC } from '~states';
import type { SingleOrArrayR } from '~types';

export type Config = SNC & {
  machines?: SingleOrArrayR<ChildrenM>;
  strict?: boolean;
};

export type FlatMapMachine_F = FlatMapState_F<Config>;

export type MachineOptions<Tc, Te extends EventObject = EventObject> = {
  guards?: PredicateMap<Tc, Te>;
  actions?: ActionMap<Tc, Te>;
  promises?: PromiseMap<Tc, Te>;
  delays?: DelayMap<Tc, Te>;
  children?: MachineMap;
};
