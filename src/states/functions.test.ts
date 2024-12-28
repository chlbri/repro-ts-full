import { createTests } from '@bemedev/vitest-extended';
import { flatMapState, getStateType, toStateMap } from './functions';
import { resolveStateTest } from './functions.fixtures';
import type { StateNodeConfig } from './types';

describe('#1 => getStateType', () => {
  const useTests = createTests(getStateType);

  useTests(
    // #region Atomic
    ['empty stateNode => "atomic"', [{}], 'atomic'],
    [
      'stateNode typed "atomic" => "atomic"',
      [{ type: 'atomic' }],
      'atomic',
    ],
    [
      'stateNode without children => "atomic"',
      [
        {
          after: {
            seconds: { target: 'any' },
          },
        },
      ],
      'atomic',
    ],
    // #endregion

    // #region Compound
    [
      'stateNode with children => "compound"',
      [
        {
          initial: 'a',
          states: { a: {} },
        },
      ],
      'compound',
    ],
    [
      'stateNode typed "compound" => "compound"',
      [
        {
          type: 'compound',
          initial: 'a',
          states: { a: {} },
        },
      ],
      'compound',
    ],
    // #endregion

    // #region Parallel
    [
      'Only stateNode typed "parallel" is "parallel" => "parallel"',
      [
        {
          type: 'parallel',
          states: {
            a: {},
            b: {},
          },
        },
      ],
      'parallel',
    ],
    // #endregion
  );
});

describe('#2 => flatMapMachine', () => {
  const useTests =
    createTests<(config: StateNodeConfig) => any>(flatMapState);

  useTests(
    ['empty machine', [{}], { '/': {} }],
    [
      'simple machine',
      [
        {
          always: 'always',
          description: 'description',
        },
      ],
      {
        '/': {
          always: 'always',
          description: 'description',
        },
      },
    ],
    [
      'Machine with children states',
      [
        {
          always: 'always',
          description: 'description',
          initial: 'state1',
          states: {
            state1: {},
            state2: {},
          },
        },
      ],
      {
        '/': {
          always: 'always',
          description: 'description',
          initial: 'state1',
        },
        '/state1': {},
        '/state2': {},
      },
    ],
    [
      'Complex machine',
      [
        {
          always: 'always',
          description: 'description',
          initial: 'state1',
          states: {
            state1: {
              always: 'always',
              type: 'parallel',
              states: {
                state3: {},
                state4: {},
              },
            },
            state2: {},
          },
        },
      ],
      {
        '/': {
          always: 'always',
          description: 'description',
          initial: 'state1',
        },
        '/state1': {
          always: 'always',
          type: 'parallel',
        },
        '/state1/state3': {},
        '/state1/state4': {},
        '/state2': {},
      },
    ],
  );
});

describe('#3 => resolveState', () => {
  const useTests = createTests(resolveStateTest);

  useTests(
    [
      'Empty',
      [{}],
      {
        tags: [],
        type: 'atomic',
        exit: [],
        entry: [],
        states: [],
        after: [],
        always: [],
        on: [],
        promises: [],
      },
    ],
    [
      'Atomic',
      [
        {
          id: 'id',
          description: 'A state',
          tags: 'busy',
          on: {},
          after: {},
          always: '/state1',
        },
      ],
      {
        tags: ['busy'],
        type: 'atomic',
        exit: [],
        entry: [],
        states: [],
        after: [],
        always: [
          {
            actions: [],
            guards: [],
            in: [],
            target: ['/state1'],
          },
        ],
        on: [],
        promises: [],
        id: 'id',
        description: 'A state',
      },
    ],
    [
      'Compound',
      [
        {
          states: {
            state1: {},
            state2: {},
          },
          initial: '/state1',
        },
      ],
      {
        initial: '/state1',
        tags: [],
        type: 'compound',
        exit: [],
        entry: [],
        states: [
          {
            __id: 'state1',
            after: [],
            always: [],
            entry: [],
            exit: [],
            on: [],
            promises: [],
            states: [],
            tags: [],
            type: 'atomic',
          },
          {
            __id: 'state2',
            after: [],
            always: [],
            entry: [],
            exit: [],
            on: [],
            promises: [],
            states: [],
            tags: [],
            type: 'atomic',
          },
        ],
        after: [],
        always: [],
        on: [],
        promises: [],
      },
    ],
  );
});

describe('#4 => toStateMap', () => {
  const useTests = createTests(toStateMap);

  useTests(
    ['Empty', [{}], { type: 'atomic' }],
    [
      'Complex 1',
      [
        {
          states: {
            state1: {
              type: 'parallel',
              states: {},
            },
            state2: {},
          },
          initial: '',
        },
      ],
      {
        states: {
          state1: { type: 'parallel' },
          state2: { type: 'atomic' },
        },
        type: 'compound',
      },
    ],
    [
      'Atomic complex 1',
      [
        {
          id: 'id',
          description: 'A state',
          tags: 'busy',
          on: {},
          after: {},
          always: '/state1',
        },
      ],
      { type: 'atomic' },
    ],
  );
});
