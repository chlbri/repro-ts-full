import type { PrimitiveObject } from 'src/types/primitives';
import type { Machine } from '~machine';
import type {
  Config,
  ConfigWithInitials,
  MachineOptions,
  NodeConfigWithInitials,
  SimpleMachineOptions2,
} from './types';

export type _ProvideInitials_F<C extends Config> = (
  initials: MachineOptions<C>['initials'],
) => ConfigWithInitials;

export type ProvideInitials_F<C extends Config> = (
  initials: MachineOptions<C>['initials'],
) => Machine<C>;

export type _ProvideActions_F<T> = (actions: T) => void;

export type Elements<
  C extends Config = Config,
  Pc = any,
  Tc extends PrimitiveObject = PrimitiveObject,
  Mo extends SimpleMachineOptions2 = SimpleMachineOptions2,
> = {
  config: C;
  initials?: Mo['initials'];
  pContext: Pc;
  context: Tc;
  actions?: Mo['actions'];
  guards?: Mo['predicates'];
  delays?: Mo['delays'];
  promises?: Mo['promises'];
  machines?: Mo['machines'];
};

export type GetIO_F = (
  node: NodeConfigWithInitials,
  key: 'exit' | 'entry',
) => string[];

export type GetIO2_F = (node: NodeConfigWithInitials) => string[];
