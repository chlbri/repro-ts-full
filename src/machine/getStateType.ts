import type { StateType_F } from './types';

export const stateType: StateType_F = config => {
  const type = config.type;
  if (type) return type;
  const states = (config as any).states;
  if (states) {
    const len = Object.keys(states).length;
    if (len > 0) {
      return 'compound';
    }
  }

  return 'atomic';
};
