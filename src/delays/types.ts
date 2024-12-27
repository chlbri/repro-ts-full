import type { Fn } from '@bemedev/types';
import type { EventObject } from '~events';

export type Delay<Tc, Te extends EventObject> =
  | number
  | Fn<[Tc, Te], number>;

export type DelayMap<Tc, Te extends EventObject> = Record<
  string,
  Delay<Tc, Te>
>;
