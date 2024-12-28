import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import type { Machine } from '~machine';
import { isDescriber, type Describer, type SingleOrArrayR } from '~types';

export type MachineMap = Record<string, Machine>;

export type ChildMap = Describer & {
  events?: SingleOrArrayR<string>;
  id?: string;
};

export type ChildConfig = string | ChildMap;

export type Child = {
  id?: string;
  machine: Machine;
};

export type ChildrenMap = MachineOptions<any, EventObject>['children'];

type ToChildrenParams = {
  child: ChildConfig;
  children?: ChildrenMap;
  strict?: boolean;
};

export function isChildMap(arg: any): arg is ChildMap {
  return isDescriber(arg);
}

export type ToMachine_F = (params: ToChildrenParams) => Child;
