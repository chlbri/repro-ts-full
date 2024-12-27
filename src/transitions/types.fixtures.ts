import type { TC, TE } from 'src/fixtures';
import type { Transition, TransitionConfig } from './types';

export type ToTransitionTest_F = (
  transition: TransitionConfig,
  strict?: boolean,
) => Transition<TC, TE>;
