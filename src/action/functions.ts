import { IS_TEST } from 'src/utils';
import { isDescriber } from '~types';
import { DEFAULT_NOTHING, ERRORS } from '../constants';
import type { PerformActionFunction, ToActionFunction } from './types';

// @ts-expect-error No implicit return
export const nothing = () => {
  if (IS_TEST) {
    console.log(`${DEFAULT_NOTHING} call ${DEFAULT_NOTHING}`);
    return DEFAULT_NOTHING;
  }
};

export const toAction: ToActionFunction = ({
  actionConfig,
  actions,
  _default = true,
}) => {
  if (!actionConfig) {
    if (!_default) throw ERRORS.action.notDefined.error;
    return nothing;
  }

  if (isDescriber(actionConfig)) {
    const action = actions?.[actionConfig.name];
    if (action) return action;
    if (!_default) throw ERRORS.action.notDescribed.error;

    return nothing;
  }

  const action = actions?.[actionConfig];
  if (action) return action;
  if (!_default) throw ERRORS.action.notProvided.error;

  return nothing;
};

export const performAction: PerformActionFunction = ({
  action: action,
  actions,
  _default = true,
  args: { context, event },
}) => {
  const _action = toAction({ actionConfig: action, actions, _default });
  return _action(context, event);
};
