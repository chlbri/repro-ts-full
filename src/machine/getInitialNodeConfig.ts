import { t } from '@bemedev/types';
import { isAtomic, isCompound, isParallel } from '~states';
import type { GetInitialNodeConfig_F } from './getInitialNodeConfig.types';
import type {
  NodeConfigCompoundWithInitials,
  NodeConfigParallelWithInitials,
} from './types';

export const getInitialNodeConfig: GetInitialNodeConfig_F = body => {
  const check1 = isAtomic(body);
  if (check1) return body;

  const check2 = isParallel(body);

  const reducer = (
    body: NodeConfigCompoundWithInitials | NodeConfigParallelWithInitials,
  ) => {
    const { states: states0, ...config } = body;
    const entries1 = Object.entries(states0);

    const entries2 = entries1.map(([key, state]) => {
      const check1 = isAtomic(state);
      if (check1) return t.tuple(key, state);

      return t.tuple(key, getInitialNodeConfig(state as any));
    });

    const check3 = isCompound(body);

    if (check3) {
      const initial = body.initial;
      const entries3 = entries2.filter(([key]) => key === initial);

      const states = entries3.reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {} as any);
      const out = { ...config, states };

      return out;
    }

    const states = entries2.reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as any);

    const out = { ...config, states };
    return out;
  };

  if (check2) {
    const out = reducer(body);
    return out;
  }

  const __id = body.initial;

  const initial = body.states[__id];
  if (!initial) throw 'Initial is not defined';

  const check4 = isAtomic(initial);
  if (check4) {
    const out = { ...body, states: { [__id]: initial } };
    return out;
  }

  const out = { ...body, states: { [__id]: reducer(initial) } };
  return out;
};
