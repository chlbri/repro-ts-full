import { t } from '@bemedev/types';
import { reduceAction } from '~actions';
import { ERRORS } from '~constants';
import { DEFAULT_MACHINE } from '~machine';
import { isDescriber, type RDR } from '~types';
import { defaultReturn } from '~utils';
import { type Child, type ToMachine_F } from './types';

export const toMachine: ToMachine_F = ({
  child,
  children,
  strict = false,
}) => {
  // #region functions

  type Reduce = (__id: string) => Child;
  const reduce: Reduce = __id => {
    const machine = children?.[__id];
    let _child = t.anify<Child>();
    if (machine) {
      _child = {
        __id,
        machine,
      };
    }
    return _child;
  };

  const out: RDR<Child> = error => {
    const __id = reduceAction(child) ?? '(machine)';
    const _return = reduce(__id);
    const value = {
      __id,
      machine: DEFAULT_MACHINE,
    };

    return defaultReturn({
      config: {
        strict,
        value,
      },
      _return,
      error,
    });
  };

  // #endregion

  if (!child) return out(ERRORS.machine.notDefined.error);

  if (isDescriber(child)) {
    return out(ERRORS.machine.notDescribed.error);
  }

  return out(ERRORS.machine.notProvided.error);
};
