import { createTests } from '@bemedev/vitest-extended';
import {
  map1,
  toPredicateTest,
  type TC,
  type TE,
} from './functions.fixtures';

const useTest1 = createTests(toPredicateTest<TC, TE>);

useTest1(
  ['Not Existed guard', ['notExists', map1], true],
  ['guard1, but no provided context and event', ['guard1', map1], true],
  [
    'guard1, but val1 not equals to event.type',
    [
      'guard1',
      map1,
      {
        context: {
          val1: 'TIMER2',
        },
        event: {
          type: 'TIMER',
        },
      },
    ],
    false,
  ],
  [
    'guard1, val1 equals to event.type',
    [
      'guard1',
      map1,
      {
        context: {
          val1: 'TIMER',
        },
        event: {
          type: 'TIMER',
        },
      },
    ],
    true,
  ],
  [
    'guard2, val2 not equals 5',
    [
      'guard2',
      map1,
      {
        context: {
          val2: 6,
        },
        event: {
          type: 'TIMER',
        },
      },
    ],
    false,
  ],
  [
    'guard2, val2 equals 5',
    [
      'guard2',
      map1,
      {
        context: {
          val2: 5,
        },
        event: {
          type: 'TIMER2',
        },
      },
    ],
    true,
  ],
  [
    'guard3, val1 equals TIMER',
    [
      'guard3',
      map1,
      {
        context: {
          val1: 'TIMER',
        },
        event: {
          type: 'TIMER2',
        },
      },
    ],
    true,
  ],
  [
    'guard3, val1 not equals TIMER',
    [
      'guard3',
      map1,
      {
        context: {
          val1: 'TIMER2',
        },
        event: {
          type: 'TIMER',
        },
      },
    ],
    false,
  ],
  [
    'guard4, type not equals TIMER2',
    [
      'guard3',
      map1,
      {
        context: {},
        event: {
          type: 'TIMER',
        },
      },
    ],
    false,
  ],
  [
    'guard4, type equals TIMER2',
    [
      'guard3',
      map1,
      {
        context: {},
        event: {
          type: 'TIMER2',
        },
      },
    ],
    false,
  ],
  [
    'mix 1',
    [
      {
        or: ['guard1', 'guard3'],
      },
      map1,
      {
        context: {
          val1: 'TIMER',
        },
        event: {
          type: 'TIMER2',
        },
      },
    ],
    true,
  ],
  [
    'mix 2',
    [
      {
        and: ['guard1', 'guard3'],
      },
      map1,
      {
        context: {
          val1: 'TIMER',
        },
        event: {
          type: 'TIMER',
        },
      },
    ],
    true,
  ],
  [
    'mix 3',
    [
      {
        and: ['guard1', 'guard4'],
      },
      map1,
      {
        context: {
          val1: 'TIMER2',
        },
        event: {
          type: 'TIMER2',
        },
      },
    ],
    true,
  ],
  [
    'mix 4',
    [
      {
        and: ['guard2', 'guard4'],
      },
      map1,
      {
        context: {
          val2: 5,
        },
        event: {
          type: 'TIMER2',
        },
      },
    ],
    true,
  ],
  [
    'mix 5',
    [
      {
        and: ['guard2', 'guard4'],
      },
      map1,
      {
        context: {
          val2: 4,
        },
        event: {
          type: 'TIMER2',
        },
      },
    ],
    false,
  ],
);
