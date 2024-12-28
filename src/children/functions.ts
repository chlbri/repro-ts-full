import { t } from '@bemedev/types';
import { reduceAction } from '~actions';
import { ERRORS } from '~constants';
import { DEFAULT_MACHINE } from '~machine';
import { isDescriber } from '~types';
import { defaultReturn } from '~utils';
import { type Child, type ToMachine_F } from './types';

export const toMachine: ToMachine_F = ({
  child,
  children,
  strict = false,
}) => {
  // #region functions

  type Reduce = (name: string, id?: string) => Child;
  const reduce: Reduce = (name, id) => {
    const machine = children?.[name];
    let _child = t.anify<Child>();
    if (machine) {
      _child = {
        machine,
      };
      if (id) _child.id = id;
    }
    return _child;
  };

  const out = (error: Error, id?: string) => {
    const name = reduceAction(child);
    const _return = reduce(name, id);
    const value = {
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

  if (isDescriber(child)) {
    return out(ERRORS.machine.notDescribed.error, child.id);
  }

  return out(ERRORS.machine.notProvided.error);
};
