import { ERRORS } from '~constants';
import { DEFAULT_MACHINE } from '~machine';
import { defaultReturn } from '~utils';
import { type ToMachine_F } from './types';

export const toMachine: ToMachine_F = ({
  child: { name, events },
  children,
  strict = false,
}) => {
  const machine = children?.[name];

  const value = {
    name,
    machine: DEFAULT_MACHINE,
  };

  const _return = machine
    ? events
      ? { machine, name, events }
      : { machine, name }
    : undefined;

  const error = ERRORS.machine.notDescribed.error;

  return defaultReturn({
    config: { strict, value },
    error,
    _return,
  });
};
