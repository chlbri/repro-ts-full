import { t } from '@bemedev/types';
import { toAction, type ActionConfig } from '~actions';
import { DEFAULT_DELIMITER } from '~constants';
import { toPromise, type PromiseConfig } from '~promises';
import { toTransition, type TransitionConfig } from '~transitions';
import { identify, toArray } from '~utils';
import type {
  FlatMapState_F,
  GetStateType_F,
  ResolveState_F,
  ToStateValue_F as ToStateMap_F,
} from './types';

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
  // #region functions
  const aMapper = (action: any) => {
    return toAction({
      action,
      actions: options?.actions,
      strict,
    });
  };

  const tMapper = (transition: any) => {
    return toTransition(transition, options, strict);
  };
  // #endregion

  const { id, description, initial, tags: _tags } = config;
  const __id = (config as any).__id;
  const type = getStateType(config);
  const tags = toArray<string>(_tags);
  const entry = toArray<ActionConfig>(config.entry).map(aMapper);
  const exit = toArray<ActionConfig>(config.exit).map(aMapper);
  const states = identify(config.states).map(config =>
    resolveState({ config, options, strict }),
  );
  const on = identify(config.on).map(tMapper);
  const always = toArray<TransitionConfig>(config.always).map(tMapper);
  const after = identify(config.after).map(tMapper);
  const promises = toArray<PromiseConfig>(config.promises).map(promise =>
    toPromise({ promise, options, strict }),
  );

  const out = t.anify<any>({
    type,
    entry,
    exit,
    tags,
    states,
    on,
    always,
    after,
    promises,
  });

  if (__id) out.__id = __id;
  if (initial) out.initial = initial;
  if (id) out.id = id;
  if (description) out.description = description;

  return out;
};

export const toStateMap: ToStateMap_F = node => {
  const { states } = node;
  const type = getStateType(node);

  if (states && Object.keys(states).length > 0) {
    const out = t.anify<ReturnType<ToStateMap_F>>({
      states: Object.keys(states).reduce((acc, key) => {
        Object.assign(acc, { [key]: toStateMap(states[key]) });
        return acc;
      }, {} as any),
      type,
    });
    return out;
  }
  return { type };
};
