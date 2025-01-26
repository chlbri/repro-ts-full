import type { EventsMap } from '~events';
import type { PrimitiveObject } from '~types';
import { Interpreter } from './interpreter';
import type { InterpreterTest_F } from './interpreterTest.types';
import type {
  Config,
  MachineOptions,
  SimpleMachineOptions2,
} from './types';

class InterpreterTest<
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
> extends Interpreter<C, Pc, Tc, E, Mo> {}

export type { InterpreterTest };

export type AnyInterpreterTest = InterpreterTest<
  Config,
  any,
  PrimitiveObject,
  any,
  SimpleMachineOptions2
>;

export const interpretTest: InterpreterTest_F = (
  machine,
  { context, pContext },
) => {
  const out = new InterpreterTest(machine);

  out.ppC(pContext);
  out.provideContext(context);

  return out;
};
