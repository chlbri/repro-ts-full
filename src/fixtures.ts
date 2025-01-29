import { asyncfy } from '@bemedev/basifun';
import { DEFAULT_MACHINE } from 'src/machine/machine';
import type { ChangeProperty } from 'src/types/primitives';
import type { MachineOptions } from '~config';

export type TC = {
  val1?: string;
  val2?: number;
};

export type TE = { type: 'TIMER' | 'TIMER2' };

export const DEFAULT_ARGS = {
  context: {},
  event: { type: 'TIMER' },
} as const;

export type _TestParams<T> = {
  func?: T;
  strict?: boolean;
  args?: {
    context: TC;
    event: TE;
  };
};

export type TestParams<T, name extends string> = ChangeProperty<
  _TestParams<T>,
  'func',
  name
>;

const guards = {
  guard1: ({ val1 }, { type }) => val1 === type,
  guard2: ({ val2 }) => val2 === 5,
  guard3: ({ val1 }) => val1 === 'TIMER',
  guard4: (_, { type }) => type === 'TIMER2',
} satisfies MachineOptions<TC, TE>['guards'];

export const options = {
  actions: {
    action1: guards.guard1,
    action2: guards.guard2,
    action3: guards.guard3,
    action4: guards.guard4,
  },
  guards,
  promises: {
    promise1: asyncfy(guards.guard1),
    promise2: asyncfy(guards.guard2),
    promise3: asyncfy(guards.guard3),
    promise4: asyncfy(guards.guard4),
  },
  children: {
    child1: DEFAULT_MACHINE,
    child2: DEFAULT_MACHINE,
    child3: DEFAULT_MACHINE,
    child4: DEFAULT_MACHINE,
  },
  delays: {
    delay1: 89,
    delay2: 35,
    delay3: ({ val2 }) => val2 ?? 0,
    delay4: 89,
  },
} satisfies MachineOptions<TC, TE>;
