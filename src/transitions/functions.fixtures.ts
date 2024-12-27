import { options } from '~fixtures';
import { toTransition } from './functions';
import type { ToTransitionTest_F } from './types.fixtures';

export const toTransitionTest: ToTransitionTest_F = (
  transition,
  strict = true,
) => {
  return toTransition(transition, options, strict);
};
