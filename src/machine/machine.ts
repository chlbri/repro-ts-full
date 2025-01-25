import { isDefined } from '@bemedev/basicfunc';
import { t, type NOmit } from '@bemedev/types';
import type { EventsMap, ToEvents } from '~events';
import type { StateValue } from '~states';
import type { PrimitiveObject } from '~types';
import { flatMap } from './flatMap';
import { getInitialNodeConfig } from './getInitialNodeConfig';
import type { Elements } from './machine.types';
import { nodeToValue } from './nodeToValue';
import { recomposeNode } from './recompose';
import { toSimple } from './toSimple';
import type {
  Action,
  Config,
  Delay,
  FlatMapN,
  MachineOptions,
  NodeConfigWithInitials,
  PredicateS,
  PromiseFunction,
  SimpleMachineOptions2,
} from './types';
import { valueToNode } from './valueToNode';

class Machine<
  const C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  E extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, E, Pc, Tc>,
> {
  #config: C;
  #flat: FlatMapN<C, true>;

  // #region Types
  /**
   * @deprecated
   * Just use for typing
   */
  get mo() {
    return t.anify<Mo>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get events() {
    return t.anify<ToEvents<E>>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get eventsMap() {
    return t.anify<E>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get action() {
    return t.anify<Action<E, Pc, Tc>>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get actionParams() {
    return t.anify<{ pContext: Pc; context: Tc; map: E }>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get guard() {
    return t.anify<PredicateS<E, Pc, Tc>>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get delay() {
    return t.anify<Delay<E, Pc, Tc>>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get promise() {
    return t.anify<PromiseFunction<E, Pc, Tc>>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get machine() {
    return t.anify<this>();
  }
  // #endregion

  // #region private
  #actions?: Mo['actions'];

  #guards?: Mo['guards'];

  #delays?: Mo['delays'];

  #promises?: Mo['promises'];

  #machines?: Mo['machines'];

  #initials?: Mo['initials'];

  #context!: Tc;

  #pContext!: Pc;

  #postConfig?: NodeConfigWithInitials;

  #initialNode!: NodeConfigWithInitials;
  // #endregion

  constructor(config: C) {
    this.#config = config;
    this.#flat = flatMap<C, true>(config);
  }

  get preConfig() {
    return this.#config;
  }

  get preflat() {
    return this.#flat;
  }

  /**
   * Use after providing initials
   */
  get postConfig() {
    return this.#postConfig;
  }

  get initials() {
    return this.#initials;
  }

  get context() {
    const out = this.#elements.context;
    return out;
  }

  get pContext() {
    const out = this.#elements.pContext;
    return out;
  }

  get actions() {
    return this.#actions;
  }

  get guards() {
    return this.#guards;
  }

  get delays() {
    return this.#delays;
  }

  get promises() {
    return this.#promises;
  }

  get machines() {
    return this.#machines;
  }

  // #region Providers
  addInitials = (initials: Mo['initials']) => {
    this.#initials = initials;
    const entries = Object.entries(this.#initials!);
    const flat: any = flatMap<C, true>(this.#config);

    entries.forEach(([key, initial]) => {
      flat[key] = { ...flat[key], initial };
    });

    this.#postConfig = recomposeNode(flat);
    this.#initialNode = getInitialNodeConfig(this.#postConfig);

    return this.#postConfig;
  };

  provideInitials = (initials: Mo['initials']) =>
    this.#renew('initials', initials);

  addActions = (actions?: Mo['actions']) => (this.#actions = actions);

  provideActions = (actions?: Mo['actions']) =>
    this.#renew('actions', actions);

  addGuards = (guards?: Mo['guards']) => (this.#guards = guards);

  provideGuards = (guards?: Mo['guards']) => this.#renew('guards', guards);

  addDelays = (delays?: Mo['delays']) => (this.#delays = delays);

  provideDelays = (delays?: Mo['delays']) => this.#renew('delays', delays);

  addPromises = (promises?: Mo['promises']) => (this.#promises = promises);

  providePromises = (promises?: Mo['promises']) =>
    this.#renew('promises', promises);

  addMachines = (machines?: Mo['machines']) => (this.#machines = machines);

  provideMachines = (machines?: Mo['machines']) =>
    this.#renew('machines', machines);

  addOptions = (options?: Mo) => {
    const out = this.#renew();

    out.addActions(options?.actions);
    out.addGuards(options?.guards);
    out.addDelays(options?.delays);
    out.addPromises(options?.promises);
    out.addMachines(options?.machines);
  };

  provideOptions = (
    options?: NOmit<Mo, 'initials'>,
  ): Machine<C, Pc, Tc, E, Mo> => {
    const out = this.#renew('actions', options?.actions);

    out.addGuards(options?.guards);
    out.addDelays(options?.delays);
    out.addPromises(options?.promises);
    out.addMachines(options?.machines);

    return out;
  };
  // #endregion

  start = () => {};

  get #elements(): Elements<C, Pc, Tc, Mo> {
    const config = structuredClone(this.#config);
    const initials = structuredClone(this.#initials);
    const pContext = structuredClone(this.#pContext);
    const context = structuredClone(this.#context);
    const actions = structuredClone(this.#actions);
    const guards = structuredClone(this.#guards);
    const delays = structuredClone(this.#delays);
    const promises = structuredClone(this.#promises);
    const machines = structuredClone(this.#machines);

    return {
      config,
      initials,
      pContext,
      context,
      actions,
      guards,
      delays,
      promises,
      machines,
    };
  }

  #provideElements = <T extends keyof Elements>(
    key?: T,
    value?: Elements<C, Pc, Tc, Mo>[T],
  ): Elements<C, Pc, Tc, Mo> => {
    const out = this.#elements;
    const check = isDefined(key);

    return check
      ? {
          ...out,
          [key]: value,
        }
      : out;
  };

  #renew = <T extends keyof Elements>(
    key?: T,
    value?: Elements<C, Pc, Tc, Mo>[T],
  ): Machine<C, Pc, Tc, E, Mo> => {
    const {
      config,
      initials,
      pContext,
      context,
      guards,
      actions,
      delays,
      promises,
      machines,
    } = this.#provideElements(key, value);

    const out = new Machine<C, Pc, Tc, E, Mo>(config);
    const check1 = isDefined(initials);
    if (check1) out.addInitials(initials);

    out.#pContext = pContext;
    out.#context = context;

    out.addGuards(guards);
    out.addActions(actions);
    out.addDelays(delays);
    out.addPromises(promises);
    out.addMachines(machines);

    return out;
  };

  get renew() {
    return this.#renew();
  }

  /**
   * Reset all options
   */

  providePrivateContext = <T>(pContext: T) => {
    const { context, initials, config } = this.#elements;

    const out = new Machine<C, T, Tc, E>(config);

    const check1 = isDefined(initials);
    if (check1) out.addInitials(initials);

    out.#context = context;
    out.#pContext = pContext;

    return out;
  };

  /**
   * Reset all options
   */
  provideContext = <T extends PrimitiveObject>(context: T) => {
    const { pContext, initials, config } = this.#elements;

    const out = new Machine<C, Pc, T, E>(config);
    const check1 = isDefined(initials);
    if (check1) out.addInitials(initials);

    out.#pContext = pContext;
    out.#context = context;

    return out;
  };

  /**
   * Reset all options
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provideEvents = <T extends EventsMap>(_: T) => {
    const { pContext, initials, config, context } = this.#elements;

    const out = new Machine<C, Pc, Tc, T>(config);
    const check1 = isDefined(initials);
    if (check1) out.addInitials(initials);

    out.#pContext = pContext;
    out.#context = context;

    return out;
  };

  get simple() {
    if (this.#postConfig) return toSimple(this.#postConfig);
    return undefined;
  }

  valueToNode = (from: StateValue) => {
    const config = this.#postConfig;
    const check = isDefined(config);

    if (check) return valueToNode(config, from);

    this.#addError('The machine is not configured');
    return t.anify<NodeConfigWithInitials>();
  };

  // #region TODO
  // TODO : Use It

  // #throw = () => {
  //   const check = this.#errorsCollector.size > 0;
  //   if (check) {
  //     const errors = this.errorsCollector.join('\n');
  //     const error = new Error(errors);

  //     throw error;
  //   }
  // };
  // #endregion

  get initialNode() {
    return this.#initialNode;
  }

  get initialValue() {
    return nodeToValue(this.initialNode);
  }

  toNode = this.valueToNode;

  #errorsCollector = new Set<string>();

  get errorsCollector() {
    return Array.from(this.#errorsCollector);
  }

  #addError = (error: string) => {
    this.#errorsCollector.add(error);
  };
}

export type { Machine };

export type AnyMachine = Machine<
  Config,
  any,
  PrimitiveObject,
  any,
  SimpleMachineOptions2
>;

type CreateMachine_F = <
  C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  EventM extends EventsMap = EventsMap,
  Mo extends SimpleMachineOptions2 = MachineOptions<C, EventM, Pc, Tc>,
>(
  config: C,
  types: { pContext: Pc; context: Tc; eventsMap: EventM },
  initials: Mo['initials'],
  options?: NOmit<Mo, 'initials'>,
) => Machine<C, Pc, Tc, EventM, Mo>;

export const createMachine: CreateMachine_F = (
  config,
  { eventsMap, pContext, context },
  initials,
  options,
) => {
  const out = new Machine(config);
  out.addInitials(initials);
  out
    .provideEvents(eventsMap)
    .providePrivateContext(pContext)
    .provideContext(context)
    .provideOptions(options);

  return out as any;
};

export const DEFAULT_MACHINE = new Machine({
  states: {},
});
