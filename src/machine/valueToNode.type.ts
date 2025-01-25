import type { StateValue } from '~states';
import type { NodeConfigWithInitials } from './types';

export type ValueToNode_F = <T extends StateValue>(
  body: NodeConfigWithInitials,
  from: T,
) => NodeConfigWithInitials;
