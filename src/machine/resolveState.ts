import { t } from '@bemedev/types';
import { toAction, type ActionConfig } from '~actions';
import { type PromiseConfig } from '~promises';
import { type TransitionConfig } from '~transitions';
import { identify, toArray } from '~utils';
import { getStateType } from './getStateType';
import { toPromise } from './toPromise';
import { toTransition } from './toTransition';
import type { ResolveState_F } from './types';

export const resolveState: ResolveState_F = ({
  config,
  options,
  strict,
}) => {
  // #region functions
  const aMapper = (action: any) => {
    return toAction({
      action,
      actions: options?.actions as any,
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
