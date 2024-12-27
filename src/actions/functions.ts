import { ERRORS } from '~constants';
import { isDescriber } from '~types';
import { defaultReturn, nothing as value } from '~utils';
import type { ToActionFunction } from './types';

export const toAction: ToActionFunction = ({
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
