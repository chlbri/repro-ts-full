import { isString } from 'src/types/primitives';
import { type ActionConfig } from '~actions';
import { type GuardConfig } from '~guards';
import { toArray } from '~utils';
import { toAction } from './toAction';
import { toPredicate } from './toPredicate';
import type { ToTransition_F } from './types';

export const toTransition: ToTransition_F = ({
  config,
  mode = 'normal',
  options,
  events,
}) => {
  const __id = (config as any).__id;
  if (isString(config)) {
    const target = toArray<string>(config);
    return { target, actions: [], guards: [], in: [] };
  }

  const { description } = config;
  const target = toArray<string>(config.target);

  const actions = toArray<ActionConfig>(config.actions).map(action =>
    toAction({ events, action, actions: options?.actions, mode }),
  );
  const guards = toArray<GuardConfig>(config.guards).map(guard =>
    toPredicate({
      events,
      guard,
      predicates: options?.guards as any,
      mode,
    }),
  );

  const out = { target, actions, guards } as any;

  if (description) out.description = description;
  out.in = toArray(config.in);
  if (__id) out.__id = __id;

  return out;
};
