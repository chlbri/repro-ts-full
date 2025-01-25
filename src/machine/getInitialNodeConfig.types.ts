import type { Fn } from '@bemedev/types';
import type { NodeConfigWithInitials } from './types';

export type GetInitialNodeConfig_F = Fn<
  [body: NodeConfigWithInitials],
  NodeConfigWithInitials
>;
