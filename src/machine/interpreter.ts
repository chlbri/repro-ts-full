import type { EventsMap } from '~events';
import type { Machine } from '~machine';
import type { PrimitiveObject } from '~types';
import type { Interpreter_F, WorkingStatus } from './interpreter.types';
import { nodeToValue } from './nodeToValue';
import type {
  Action,
  Child,
  Config,
  Delay,
  Keys,
  MachineOptions,
  NodeConfigWithInitials,
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

  #currentNodeConfig: NodeConfigWithInitials;

  #initialNodeConfig: NodeConfigWithInitials;

  get #canBeStoped() {
    const check1 = this.#status === 'started';
    const check2 = this.#status === 'busy';
    const check3 = check1 || check2;

    return check3;
  }

  get #idle() {
    return this.#status === 'idle';
  }

  get #canAct() {
    return this.#status === 'started';
  }

  constructor(machine: Machine<C, Pc, Tc, E, Mo>) {
    this.#machine = machine.renew;

    this.#initialNodeConfig = this.#machine.initialNode;
    this.#currentNodeConfig = this.#initialNodeConfig;
  }

  get status() {
    return this.#status;
  }

  get initialNodeConfig() {
    return this.#initialNodeConfig;
  }

  get initialValue() {
    return this.#machine.initialValue;
  }

  get currentNodeConfig() {
    return this.#currentNodeConfig;
  }

  get value() {
    return nodeToValue(this.#currentNodeConfig);
  }

  #start = (): WorkingStatus => (this.#status = 'started');

  start = () => {
    this.#start();
  };

  stop = () => {
    if (this.#canBeStoped) this.#status = 'started';
  };

  //TODO: use it !
  // #makeBusy = () => {
  //   this.#status = 'busy';
  // };

  // #region Types
  providePrivateContext = (pContext: Pc) => {
    if (this.#idle) {
      this.#machine = this.#machine.providePrivateContext(pContext) as any;
    }

    return this.#machine;
  };

  ppC = this.providePrivateContext;

  provideContext = (context: Tc) => {
    if (this.#idle) {
      this.#machine = this.#machine.provideContext(context) as any;
    }

    return this.#machine;
  };
  // #endregion

  // #region Providers

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
  // #endregion
}

export type { Interpreter };

export type AnyInterpreter = Interpreter<
  Config,
  any,
  PrimitiveObject,
  any,
  SimpleMachineOptions2
>;

export const interpret: Interpreter_F = (
  machine,
  { context, pContext },
) => {
  const out = new Interpreter(machine);

  out.ppC(pContext);
  out.provideContext(context);

  return out;
};
