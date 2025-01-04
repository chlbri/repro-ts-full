import { createTests } from '@bemedev/vitest-extended';
import type { AnifyReturn } from '~types';
import { createConfig, flatMapMachine, resolveConfig } from './functions';

describe('#1 => flatMapMachine', () => {
  type Fn1 = AnifyReturn<typeof flatMapMachine>;
  const useTests = createTests<Fn1>(flatMapMachine);

  useTests(
    [
      'Machine with children states',
      [
        createConfig({
          always: 'always',
          description: 'description',
          initial: 'state1',
          states: {
            state1: {},
            state2: {},
          },
        }),
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

  useTests([
    'Compound',
    [
      createConfig({
        states: {
          state1: {},
          state2: {},
        },
        initial: '/state1',
      }),
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
  ]);
});
