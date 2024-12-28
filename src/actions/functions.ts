import { ERRORS } from '~constants';
import { isDescriber } from '~types';
import { defaultReturn, nothing as value } from '~utils';
import type { ReduceAction_F, ToAction_F } from './types';

export const toAction: ToAction_F = ({
  action,
  actions,
  strict = false,
}) => {
  const out = (error: Error, _return?: any) => {
    return defaultReturn({
      config: {
        strict,
        value,
      },
      _return,
      error,
    });
  };

  if (!action) return out(ERRORS.action.notDefined.error);

  if (isDescriber(action)) {
    const func = actions?.[action.name];
    return out(ERRORS.action.notDescribed.error, func);
  }

  const func = actions?.[action];
  return out(ERRORS.action.notProvided.error, func);
};

export const reduceAction: ReduceAction_F = action => {
  if (isDescriber(action)) return action.name;
  return action;
};
