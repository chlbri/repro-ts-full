import type { EventsMap } from '~events';
import type { Machine } from '~machine';
import type { PrimitiveObject } from '~types';
import type { WorkingStatus } from './interpreter.types';
import type {
  Action,
  Child,
  Config,
  Delay,
  Keys,
  MachineOptions,
  PredicateS,
  PromiseFunction,
  SimpleMachineOptions2,
} from './types';

class Interpreter<
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
> {
  #machine: Machine<C, Pc, Tc, E, Mo>;

  #status: WorkingStatus = 'idle';

  get #canBeStoped() {
    const check1 = this.#status === 'started';
    const check2 = this.#status === 'busy';
    const check3 = check1 || check2;

    return check3;
  }

  get #canAct() {
    return this.#status === 'started';
  }

  constructor(machine: Machine<C, Pc, Tc, E, Mo>) {
    this.#machine = machine.renew;
  }

  get status() {
    return this.#status;
  }

  start = () => {
    this.#status = 'started';
  };

  stop = () => {
    if (this.#canBeStoped) this.#status = 'started';
  };

  //TODO: use it !
  // #makeBusy = () => {
  //   this.#status = 'busy';
  // };

  addAction = (key: Keys<Mo['actions']>, action: Action<E, Pc, Tc>) => {
    if (this.#canAct) {
      const out = { [key]: action };
      this.#machine.addActions(out);
    }
  };

  addGuard = (key: Keys<Mo['guards']>, guard: PredicateS<E, Pc, Tc>) => {
    if (this.#canAct) {
      const out = { [key]: guard };
      this.#machine.addGuards(out);
    }
  };

  addPromise = (
    key: Keys<Mo['promises']>,
    promise: PromiseFunction<E, Pc, Tc>,
  ) => {
    if (this.#canAct) {
      const out = { [key]: promise };
      this.#machine.addPromises(out);
    }
  };

  addDelay = (key: Keys<Mo['delays']>, delay: Delay<E, Pc, Tc>) => {
    if (this.#canAct) {
      const out = { [key]: delay };
      this.#machine.addDelays(out);
    }
  };

  addMachine = (key: Keys<Mo['machines']>, machine: Child<E, Pc, Tc>) => {
    if (this.#canAct) {
      const out = { [key]: machine };
      this.#machine.addMachines(out);
    }
  };
}

export const interpret = <
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
>(
  machine: Machine<C, Pc, Tc, E, Mo>,
) => {
  return new Interpreter<C, Pc, Tc, E, Mo>(machine);
};
