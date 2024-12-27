import type { ChildrenM, FlatMapState_F, SNC } from '~states';
import type { SingleOrArrayR } from '~types';

export type Config = SNC & {
  machines?: SingleOrArrayR<ChildrenM>;
  strict?: boolean;
};

export type FlatMapMachine_F = FlatMapState_F<Config>;
