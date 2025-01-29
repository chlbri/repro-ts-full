import type { ActionConfig } from '~actions';
import type { EventsMap, ToEvents } from '~events';
import type { GuardConfig } from '~guards';
import type { Machine } from '~machine';
import type { PromiseConfig } from '~promises';
import { nextSV, type StateValue } from '~states';
import type { PrimitiveObject } from '~types';
import {
  INIT_EVENT,
  type InitEvent,
  type Interpreter_F,
  type Mode,
  type WorkingStatus,
} from './interpreter.types';
import { nodeToValue } from './nodeToValue';
import { resolveNode } from './resolveState';
import { toAction } from './toAction';
import { toDelay } from './toDelay';
import { toMachine } from './toMachine';
import { toPredicate } from './toPredicate';
import { toPromise } from './toPromise';
import { toSimple } from './toSimple';
import type {
  Action,
  Child,
  Config,
  Delay,
  Keys,
  MachineOptions,
  Node,
  NodeConfigWithInitials,
  PredicateS,
  PromiseFunction,
  SimpleMachineOptions2,
} from './types';

export class Interpreter<
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
> {
  #machine: Machine<C, Pc, Tc, E, Mo>;

  #status: WorkingStatus = 'idle';

  #currentConfig: NodeConfigWithInitials;
  #value: StateValue;
  #mode: Mode;
  readonly #initialNode: Node<E, Pc, Tc>;
  #currentNode: Node<E, Pc, Tc>;
  #iterator = 0;

  #event: ToEvents<E> | InitEvent = INIT_EVENT;

  readonly #initialNodeConfig: NodeConfigWithInitials;

  #initialPpc!: Pc;
  #initialContext!: Tc;

  get #canBeStoped() {
    return this.#status === 'started';
  }

  get #idle() {
    return this.#status === 'idle';
  }

  get #canAct() {
    return this.#status === 'started';
  }

  get event() {
    return this.#event;
  }

  constructor(machine: Machine<C, Pc, Tc, E, Mo>, mode: Mode = 'normal') {
    this.#machine = machine.renew;

    this.#initialNodeConfig = this.#machine.initialConfig;
    this.#currentConfig = this.#initialNodeConfig;
    this.#value = nodeToValue(this.#currentConfig);
    this.#mode = mode;
    this.#initialNode = this.#resolveNode(this.#initialNodeConfig);
    this.#currentNode = this.#initialNode;
  }

  protected iterate = () => this.#iterator++;

  #resolveNode = (config: NodeConfigWithInitials) => {
    const options = this.#machine.options;
    const mode = this.#mode;
    const events = this.#machine.eventsMap;

    return resolveNode({ config, options, mode, events });
  };

  get initialNode() {
    return this.#initialNode;
  }

  get node() {
    return this.#currentNode;
  }

  makeStrict = () => {
    this.#mode = 'strict';
  };

  makeStrictest = () => {
    this.#mode = 'strictest';
  };

  get status() {
    return this.#status;
  }

  get initialConfig() {
    return this.#machine.initialConfig;
  }

  get initialValue() {
    return this.#machine.initialValue;
  }

  get config() {
    return this.#currentConfig;
  }

  get renew() {
    const out = new Interpreter(this.#machine);
    out.ppC(this.#initialPpc);
    out.provideContext(this.#initialContext);

    return out;
  }

  get value() {
    return this.#value;
  }

  #start = (): WorkingStatus => (this.#status = 'started');

  start = () => {
    this.#start();
  };

  stop = () => {
    if (this.#canBeStoped) this.#status = 'started';
  };

  #makeBusy = (): WorkingStatus => (this.#status = 'busy');

  // #region Types
  providePrivateContext = (pContext: Pc) => {
    this.#initialPpc = pContext;
    this.#makeBusy();

    if (this.#idle) {
      this.#machine = this.#machine.providePrivateContext(
        this.#initialPpc,
      ) as any;
    }

    this.#status = 'starting';
    return this.#machine;
  };

  ppC = this.providePrivateContext;

  provideContext = (context: Tc) => {
    this.#initialContext = context;
    this.#makeBusy();

    if (this.#idle) {
      this.#machine = this.#machine.provideContext(
        this.#initialContext,
      ) as any;
    }

    this.#status = 'starting';
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

  addGuard = (
    key: Keys<Mo['predicates']>,
    guard: PredicateS<E, Pc, Tc>,
  ) => {
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

  #errorsCollector = new Set<string>();
  #warningsCollector = new Set<string>();

  get errorsCollector() {
    return Array.from(this.#errorsCollector);
  }

  get warningsCollector() {
    return Array.from(this.#warningsCollector);
  }

  protected addError = (error: string) => {
    this.#errorsCollector.add(error);
  };

  protected addWarning = (error: string) => {
    this.#errorsCollector.add(error);
  };

  // #region Next
  nextSV = (target: string) => nextSV(this.#value, target);

  nextConfig = (target: string) => {
    const nextValue = this.nextSV(target);
    const out = this.#machine.valueToConfig(nextValue);

    return out;
  };

  nextSimple = (target: string) => {
    const config = this.nextConfig(target);
    const out = toSimple(config);

    return out;
  };

  // #endregion

  toAction = (action?: ActionConfig) => {
    const events = this.#machine.eventsMap;
    const actions = this.#machine.actions;
    const mode = this.#mode;

    return toAction({ action, events, actions, mode });
  };

  toPredicate = (guard?: GuardConfig) => {
    const events = this.#machine.eventsMap;
    const predicates = this.#machine.predicates;
    const mode = this.#mode;

    return toPredicate({ guard, events, predicates, mode });
  };

  toPromise = (promise: PromiseConfig) => {
    const events = this.#machine.eventsMap;
    const options = this.#machine.options;
    const mode = this.#mode;

    return toPromise({ promise, events, options, mode });
  };

  toDelay = (delay: string) => {
    const events = this.#machine.eventsMap;
    const delays = this.#machine.delays;
    const mode = this.#mode;

    return toDelay({ delay, events, delays, mode });
  };

  toMachine = (machine: ActionConfig) => {
    const events = this.#machine.eventsMap;
    const machines = this.#machine.machines;
    const mode = this.#mode;

    return toMachine({ machine, events, machines, mode });
  };
}

export type AnyInterpreter = Interpreter<
  Config,
  any,
  PrimitiveObject,
  any,
  SimpleMachineOptions2
>;

export const interpret: Interpreter_F = (
  machine,
  { context, pContext, mode },
) => {
  const out = new Interpreter(machine, mode);

  out.ppC(pContext);
  out.provideContext(context);

  return out;
};
