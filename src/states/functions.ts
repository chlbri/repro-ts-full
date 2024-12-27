import { toAction, type ActionConfig } from '~actions';
import type { Config } from '~config';
import { DEFAULT_DELIMITER } from '~constants';
import { toPromise, type PromiseConfig } from '~promises';
import { toTransition, type TransitionConfig } from '~transitions';
import { identify, toArray } from '~utils';
import type {
  FlatMapState_F,
  GetStateType_F,
  ResolveState_F,
} from './types';

export const createConfig = <const SN extends Config = Config>(
  config: SN,
) => {
  return config;
};

/**
 * Transformer une machine à états hiérarchique en une structure plate où
 * chaque état est identifié par un chemin complet.
 * @param node  La configuration de la machine à états
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
export const flatMapState: FlatMapState_F = (
  node,
  delimiter = DEFAULT_DELIMITER,
  path = '',
) => {
  const { states, ...rest } = node;

  let out: any = {};
  out[path === '' ? DEFAULT_DELIMITER : path] = rest;

  if (states) {
    for (const key in states) {
      if (Object.prototype.hasOwnProperty.call(states, key)) {
        const element = states[key];
        const inner = flatMapState(
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

export const getStateType: GetStateType_F = config => {
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

export const resolveState: ResolveState_F = ({
  config,
  options,
  strict,
}) => {
  const { id, description, initial, tags: _tags } = config;
  const __id = (config as any).__id;
  const type = getStateType(config);
  const tags = toArray<string>(_tags);

  const entry = toArray<ActionConfig>(config.entry).map(action => {
    return toAction({ action, actions: options?.actions, strict });
  });

  const exit = toArray<ActionConfig>(config.exit).map(action => {
    return toAction({ action, actions: options?.actions, strict });
  });

  const states = identify(config.states).map(config =>
    resolveState({ config, options, strict }),
  );

  const on = identify(config.on).map(transition =>
    toTransition(transition as TransitionConfig, options, strict),
  );

  const always = toArray<TransitionConfig>(config.always).map(transition =>
    toTransition(transition, options, strict),
  );

  const after = identify(config.on).map(transition =>
    toTransition(transition as TransitionConfig, options, strict),
  );

  const promises = toArray<PromiseConfig>(config.promises).map(promise =>
    toPromise({ promise, options, strict }),
  );

  const out = {
    type,
    entry,
    exit,
    tags,
    states,
    on,
    always,
    after,
    promises,
  } as any;

  if (initial) out.initial = initial;
  if (id) out.id = id;
  if (description) out.description = description;
  if (__id) out.__id = __id;

  return out;
};
