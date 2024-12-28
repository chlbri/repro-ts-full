import { createTests } from '@bemedev/vitest-extended';
import { DEFAULT_MACHINE } from '~machine';
import type { AnifyReturn } from '~types';
import { flatMapMachine, resolveConfig } from './functions';

describe('#1 => flatMapMachine', () => {
  type Fn1 = AnifyReturn<typeof flatMapMachine>;
  const useTests = createTests<Fn1>(flatMapMachine);

  useTests(
    [
      'empty machine',
      [
        {
          machines: 'machine1',
        },
      ],
      { '/': { machines: 'machine1' } },
    ],
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

describe('#2 => resolveConfig', () => {
  const useTests = createTests(resolveConfig);

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
        machines: [],
        strict: false,
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
          strict: false,
          machines: ['machine1', 'machine3'],
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
        machines: [
          { __id: 'machine1', machine: DEFAULT_MACHINE },
          { __id: 'machine3', machine: DEFAULT_MACHINE },
        ],
        strict: false,
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
        machines: [],
        strict: false,
      },
    ],
  );
});
