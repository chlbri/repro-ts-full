import { isDescriber } from '~types';
import type { ReduceAction_F } from './types';

export const reduceAction: ReduceAction_F = action => {
  if (isDescriber(action)) return action.name;
  return action;
};
