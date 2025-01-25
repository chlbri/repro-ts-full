import type { StateValue } from '~states';
import type { NodeConfigWithInitials } from './types';

export type NodeToValue_F = (body: NodeConfigWithInitials) => StateValue;
