import type { EventsMap } from '~events';
import type { Machine } from '~machine';
import type { PrimitiveObject } from '~types';
import type {
  Config,
  MachineOptions,
  SimpleMachineOptions2,
} from './types';
import type { InterpreterTest } from './interpreterTest';

export type WorkingStatus =
  | 'idle'
  | 'starting'
  | 'started'
  | 'stopped'
  | 'busy';

export type InterpreterTest_F = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
>(
  machine: Machine<C, Pc, Tc, E, Mo>,
  config: { pContext: Pc; context: Tc },
) => InterpreterTest<C, Pc, Tc, E, Mo>;
