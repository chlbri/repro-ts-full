import type { Config, ConfigWithInitials, MachineOptions } from './types';

export type ProvideInitials_F<C extends Config> = (
  initials: MachineOptions<C>['initials'],
) => ConfigWithInitials;
