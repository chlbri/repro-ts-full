import { isDefined } from '@bemedev/basicfunc';
import { t } from '@bemedev/types';
import type { EventsMap, ToEvents } from '~events';
import type { PrimitiveObject } from '~types';
import { flatMap } from './flatMap';
import type { Elements } from './machine.types';
import { recomposeNode } from './recompose';
import { toSimple } from './toSimple';
import type {
  Config,
  ConfigWithInitials,
  FlatMapN,
  MachineOptions,
} from './types';

export class Machine<
  const C extends Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  EventM extends EventsMap = EventsMap,
  Mo extends MachineOptions<C, Pc, Tc, ToEvents<EventM>> = MachineOptions<
    C,
    Pc,
    Tc,
    ToEvents<EventM>
  >,
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
    return t.anify<ToEvents<EventM>>();
  }

  /**
   * @deprecated
   * Just use for typing
   */
  get eventsMap() {
    return t.anify<EventM>();
  }
  // #endregion

  #actions?: Mo['actions'];
  #guards?: Mo['guards'];
  #delays?: Mo['delays'];
  #promises?: Mo['promises'];
  #initials?: Mo['initials'];
  #context!: Tc;
  #pContext!: Pc;

  #postConfig?: ConfigWithInitials;

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
    return Object.freeze(out);
  }

  get pContext() {
    const out = this.#elements.pContext;
    return Object.freeze(out);
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

  _provideInitials = (initials: Mo['initials']) => {
    this.#initials = initials;
    const entries = Object.entries(this.#initials!);
    const flat: any = flatMap<C, true>(this.#config);

    entries.forEach(([key, initial]) => {
      flat[key] = { ...flat[key], initial };
    });

    this.#postConfig = recomposeNode(flat);
    return this.#postConfig;
  };

  provideInitials = (initials: Mo['initials']) => {
    const newConfig = structuredClone(this.#config);
    const actions = structuredClone(this.#actions);
    const out = new Machine<C, Pc, Tc, EventM>(newConfig);

    out._provideInitials(initials);
    if (actions) out._provideActions(actions);

    return out;
  };

  _provideActions = (actions?: Mo['actions']) => {
    this.#actions = actions;
  };

  provideActions = (actions?: Mo['actions']) => {
    return this.#renew('actions', actions);
  };

  _provideGuards = (guards?: Mo['guards']) => {
    this.#guards = guards;
  };

  provideGuards = (guards?: Mo['guards']) => {
    return this.#renew('guards', guards);
  };

  _provideDelays = (delays?: Mo['delays']) => {
    this.#delays = delays;
  };

  provideDelays = (delays?: Mo['delays']) => {
    return this.#renew('delays', delays);
  };

  _providePromises = (promises?: Mo['promises']) => {
    this.#promises = promises;
  };

  get #elements(): Elements<C, Pc, Tc, Mo> {
    const config = structuredClone(this.#config);
    const initials = structuredClone(this.#initials);
    const pContext = structuredClone(this.#pContext);
    const context = structuredClone(this.#context);
    const actions = structuredClone(this.#actions);
    const guards = structuredClone(this.#guards);
    const delays = structuredClone(this.#delays);
    const promises = structuredClone(this.#promises);

    return {
      config,
      initials,
      pContext,
      context,
      actions,
      guards,
      delays,
      promises,
    };
  }

  #_provideElements = (
    key: keyof Elements,
    value: Elements<C, Pc, Tc, Mo>[typeof key],
  ): Elements<C, Pc, Tc, Mo> => {
    const out = this.#elements;

    return {
      ...out,
      [key]: value,
    };
  };

  #renew = (
    key: keyof Elements,
    value: Elements<C, Pc, Tc, Mo>[typeof key],
  ) => {
    const {
      config,
      initials,
      pContext,
      context,
      guards,
      actions,
      delays,
      promises,
    } = this.#_provideElements(key, value);

    const out = new Machine<C, Pc, Tc, EventM, Mo>(config);
    const check1 = isDefined(initials);
    if (check1) out._provideInitials(initials);

    out.#pContext = pContext;
    out.#context = context;

    out._provideGuards(guards);
    out._provideActions(actions);
    out._provideDelays(delays);
    out._providePromises(promises);

    return out;
  };

  providePromises = (promises?: Mo['promises']) => {
    return this.#renew('promises', promises);
  };

  providePrivateContext = <T>(pContext: T) => {
    const newConfig = structuredClone(this.#config);
    const newInitials = structuredClone(this.#initials);
    const context = structuredClone(this.#context);

    const out = new Machine<C, T, Tc, EventM>(newConfig);

    const check1 = isDefined(newInitials);
    if (check1) out._provideInitials(newInitials);

    out.#context = context;
    out.#pContext = pContext;

    return out;
  };

  provideContext = <T extends PrimitiveObject>(context: T) => {
    const newConfig = structuredClone(this.#config);
    const newInitials = structuredClone(this.#initials);
    const pContext = structuredClone(this.#pContext);

    const out = new Machine<C, Pc, T, EventM>(newConfig);

    const check1 = isDefined(newInitials);
    if (check1) out._provideInitials(newInitials);

    out.#pContext = pContext;
    out.#context = context;

    return out;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provideEvents = <T extends EventsMap>(_: T) => {
    const newConfig = structuredClone(this.#config);
    const newInitials = structuredClone(this.#initials);
    const pContext = structuredClone(this.#pContext);
    const context = structuredClone(this.#context);

    const out = new Machine<C, Pc, Tc, T>(newConfig);

    const check1 = isDefined(newInitials);
    if (check1) out._provideInitials(newInitials);

    out.#pContext = pContext;
    out.#context = context;

    return out;
  };

  get simple() {
    if (this.#postConfig) return toSimple(this.#postConfig as any);
    return undefined;
  }
}

export const DEFAULT_MACHINE = new Machine({
  states: {},
});
