import type { Machine } from 'src/machine/machine';
import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import { type SingleOrArrayR } from '~types';

export type MachineMap = Record<string, Machine>;

export type ChildConfig = {
  name: string;
  description?: string;
  events?: SingleOrArrayR<string>;
};

export type Child = {
  name: string;
  machine: Machine;
  events?: SingleOrArrayR<string>;
};

export type ChildrenMap = MachineOptions<any, EventObject>['children'];

type ToChildrenParams = {
  child: ChildConfig;
  children?: ChildrenMap;
  strict?: boolean;
};

export type ToMachine_F = (params: ToChildrenParams) => Child;
