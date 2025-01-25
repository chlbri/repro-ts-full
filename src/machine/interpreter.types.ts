import type { EventsMap } from '~events';
import type { Machine } from '~machine';
import type { PrimitiveObject } from '~types';
import type { Interpreter } from './interpreter';
import type {
  Config,
  MachineOptions,
  SimpleMachineOptions2,
} from './types';

export type WorkingStatus = 'started' | 'idle' | 'stopped' | 'busy';

export type Interpreter_F = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
>(
  machine: Machine<C, Pc, Tc, E, Mo>,
) => Interpreter<C, Pc, Tc, E, Mo>;
