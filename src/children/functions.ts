import { t } from '@bemedev/types';
import { ERRORS } from '~constants';
import { DEFAULT_MACHINE } from '~machine';
import { isDescriber, type RDR } from '~types';
import { defaultReturn } from '~utils';
import { type Child, type ToMachine_F } from './types';

export const DEFAULT_CHILD: Child = {
  __id: 'machine',
  machine: DEFAULT_MACHINE,
};

export const toMachine: ToMachine_F = ({
  child,
  children,
  strict = false,
}) => {
  // #region functions

  const out: RDR<Child> = (error, _return) => {
    return defaultReturn({
      config: {
        strict,
        value: DEFAULT_CHILD,
      },
      _return,
      error,
    });
  };

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

  // #endregion

  if (!child) return out(ERRORS.machine.notDefined.error);

  if (isDescriber(child)) {
    const _child = reduce(child.name);
    return out(ERRORS.machine.notDescribed.error, _child);
  }

  const _child = reduce(child);
  return out(ERRORS.machine.notProvided.error, _child);
};
