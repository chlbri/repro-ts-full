import type { MachineOptions } from '~config';
import type { EventObject } from '~events';
import type { Machine } from '~machine';
import type { SingleOrArrayR } from '~types';
import { checkKeys } from '~utils';

export type MachineMap = Record<string, Machine>;

export type ChildMap = {
  id?: string;
  src: string;
  events?: SingleOrArrayR<string>;
};

export type ChildConfig = string | ChildMap;

export type Child = {
  __id: string;
  machine: Machine;
};

export type ChildrenMap = MachineOptions<any, EventObject>['children'];

type ToChildrenParams = {
  child: ChildConfig;
  children?: ChildrenMap;
  strict?: boolean;
};

export function isChildMap(arg: any): arg is ChildMap {
  return checkKeys(arg, 'src');
}

export type ToMachine_F = (params: ToChildrenParams) => Child;
