import type { Fn } from '@bemedev/types';
import type { EventObject } from '~events';
import type { PrimitiveObject } from '~types';

export type Delay<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = number | Fn<[Tc, Te], number>;

export type DelayMap<
  Tc extends PrimitiveObject = PrimitiveObject,
  Te extends EventObject = EventObject,
> = Record<string, Delay<Tc, Te>>;
