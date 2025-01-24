import { flatMap } from './flatMap';
import type { ProvideInitials_F } from './machine.types';
import { recomposeNode } from './recompose';
import { toSimple } from './toSimple';
import type { Config, ConfigWithInitials, FlatMapN } from './types';

export class Machine<const C extends Config = Config> {
  #config: C;

  #flat: FlatMapN<C, true>;

  #postConfig?: ConfigWithInitials;

  constructor(config: C = { states: {} } as any) {
    this.#config = config;
    this.#flat = flatMap<C, true>(config);
  }

  get preConfig() {
    return this.#config;
  }

  get preflat() {
    return this.#flat;
  }

  get postConfig() {
    return this.#postConfig;
  }

  provideInitials: ProvideInitials_F<C> = initials => {
    const entries = Object.entries(initials);
    const flat: any = flatMap<C, true>(this.#config);

    entries.forEach(([key, initial]) => {
      flat[key] = { ...flat[key], initial };
    });

    this.#postConfig = recomposeNode(flat);

    return this.#postConfig;
  };

  get simple() {
    if (this.#postConfig) return toSimple(this.#postConfig as any);
    return undefined;
  }
}

export const DEFAULT_MACHINE = new Machine();
