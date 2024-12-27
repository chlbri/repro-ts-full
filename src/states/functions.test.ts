import { createTests } from '@bemedev/vitest-extended';
import { flatMapState, getStateType } from './functions';
import type { StateNodeConfig } from './types';

describe('getStateType', () => {
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

describe('flatMapMachine', () => {
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
