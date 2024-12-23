import type { Config } from '../config';
import { DEFAULT_DELIMITER } from '../constants';
import type { StateNodeConfig, StateType } from './types';

export const createConfig = <const SN extends Config = Config>(
  config: SN,
) => {
  return config;
};

/**
 * Transformer une machine à états hiérarchique en une structure plate où chaque état est identifié par un chemin complet.
 * @param config  La configuration de la machine à états
 * @param delimiter  Le délimiteur à utiliser pour séparer les états,
 * par défaut '/'
 * @returns  La configuration de la machine à états sous forme plate
 * @example
 *
 * ```ts
 *  // Entrée
 *  const config = {
 *    initial: 'idle',
 *    states: {
 *      idle: {
 *        on: { START: 'running' }
 *      },
 *      running: {
 *        states: {
 *          fast: {},
 *          slow: {}
 *        }
 *      }
 *    }
 *  }
 *
 *  // Sortie
 *  flatMapMachine(config) =
 *    {
 *      '': { initial: 'idle' },
 *      '.idle': { on: { START: 'running' } },
 *      '.running': {},
 *      '.running.fast': {},
 *      '.running.slow': {}
 *    }
 * ```
 */
export const flatMapMachine = <const SN extends StateNodeConfig>(
  config: SN,
  delimiter: string = DEFAULT_DELIMITER,
  path = '',
) => {
  const { states, ...rest } = config;

  let out: any = {};
  out[path === '' ? DEFAULT_DELIMITER : path] = rest;

  if (states) {
    for (const key in states) {
      if (Object.prototype.hasOwnProperty.call(states, key)) {
        const element = states[key];
        const inner = flatMapMachine(
          element,
          delimiter,
          `${path}${DEFAULT_DELIMITER}${key}`,
        );
        out = { ...out, ...inner };
      }
    }
  }

  return out;
};

export const getStateType = <T extends StateNodeConfig>(
  config: T,
): StateType => {
  const type = config.type;
  if (type) return type;
  const states = (config as any).states;
  if (states) {
    const len = Object.keys(states).length;
    if (len > 0) {
      return 'compound';
    }
  }

  return 'atomic';
};
