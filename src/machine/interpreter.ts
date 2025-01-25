import type { Action } from '~actions';
import type { Delay } from '~delays';
import type { EventsMap, ToEvents } from '~events';
import type { PredicateS } from '~guards';
import { Machine, type AnyMachine } from '~machine';
import type { PromiseFunction } from '~promises';
import type { PrimitiveObject } from '~types';
import type {
  Config,
  Keys,
  MachineOptions,
  SimpleMachineOptions2,
} from './types';

export type WorkingStatus = 'started' | 'idle' | 'stopped' | 'busy';

export class Interpreter<
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  EventM extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<
    C,
    Pc,
    Tc,
    ToEvents<EventM>
  >,
> {
  #machine: Machine<C, Pc, Tc, EventM, Mo>;

  #status: WorkingStatus = 'idle';

  constructor(machine: Machine<C, Pc, Tc, EventM, Mo>) {
    this.#machine = machine;
  }

  get status() {
    return this.#status;
  }

  start = () => {
    this.#status = 'started';
  };

  stop = () => {
    const check1 = this.#status === 'started';
    const check2 = this.#status === 'busy';
    const check3 = check1 || check2;

    if (check3) this.#status = 'started';
  };

  get #canAct() {
    return this.#status === 'started';
  }

  //TODO: use it !
  // #makeBusy = () => {
  //   this.#status = 'busy';
  // };

  addAction = (
    key: Keys<Mo['actions']>,
    action: Action<Pc, Tc, ToEvents<EventM>>,
  ) => {
    if (this.#canAct) {
      const out: any = { [key]: action };
      this.#machine.addActions(out);
    }
  };

  addGuard = (
    key: Keys<Mo['guards']>,
    guard: PredicateS<Pc, Tc, ToEvents<EventM>>,
  ) => {
    if (this.#canAct) {
      const out: any = { [key]: guard };
      this.#machine.addGuards(out);
    }
  };

  addPromise = (
    key: Keys<Mo['promises']>,
    promise: PromiseFunction<Pc, Tc, ToEvents<EventM>>,
  ) => {
    if (this.#canAct) {
      const out: any = { [key]: promise };
      this.#machine.addPromises(out);
    }
  };

  addDelay = (
    key: Keys<Mo['delays']>,
    delay: Delay<Pc, Tc, ToEvents<EventM>>,
  ) => {
    if (this.#canAct) {
      const out: any = { [key]: delay };
      this.#machine.addDelays(out);
    }
  };

  addMachine = (key: Keys<Mo['machines']>, machine: AnyMachine) => {
    if (this.#canAct) {
      const out: any = { [key]: machine };
      this.#machine.addMachines(out);
    }
  };
}
//TODO: Simplify typing

export const createInterpreter = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  EventM extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<
    C,
    Pc,
    Tc,
    ToEvents<EventM>
  >,
>(
  machine: Machine<C, Pc, Tc, EventM, Mo>,
) => {
  return new Interpreter<C, Pc, Tc, EventM, Mo>(machine);
};
