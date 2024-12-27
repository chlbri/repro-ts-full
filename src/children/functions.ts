import { ERRORS } from '~constants';
import { DEFAULT_MACHINE } from '~machine';
import { defaultReturn } from '~utils';
import { isChildMap, type ToMachine_F } from './types';

export const toMachine: ToMachine_F = ({
  child,
  children,
  strict = false,
}) => {
  const out = (error: Error, _return?: any) => {
    return defaultReturn({
      config: {
        strict,
        value: DEFAULT_MACHINE,
      },
      _return,
      error,
    });
  };

  if (!child) return out(ERRORS.machine.notDefined.error);

  if (isChildMap(child)) {
    const func = children?.[child.src];
    return out(ERRORS.machine.notDescribed.error, func);
  }

  const func = children?.[child];
  return out(ERRORS.machine.notProvided.error, func);
};
