import { ERRORS } from '~constants';
import { options } from '~fixtures';
import { toMachine } from './functions';
import type { Child, ChildConfig } from './types';

type ToMachineTest_F = (child?: ChildConfig, strict?: boolean) => Child;

export const toMachineTest: ToMachineTest_F = (child, strict = true) => {
  if (!child) throw ERRORS.machine.notDefined.error;
  const out = toMachine({
    child,
    children: options.children,
    strict,
  });

  return out;
};
