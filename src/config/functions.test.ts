import { createTests } from '@bemedev/vitest-extended';
import type { AnifyReturn } from '~types';
import { createConfig, flatMapMachine, resolveConfig } from './functions';

describe('#1 => flatMapMachine', () => {
  type Fn1 = AnifyReturn<typeof flatMapMachine>;
  const { success: useTests } = createTests<Fn1>(flatMapMachine);

  useTests(
    {
      invite: 'Machine with children states',
      parameters: [
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
      expected: {
        '/': {
          always: 'always',
          description: 'description',
          initial: 'state1',
          states: {
            state1: {},
            state2: {},
          },
        },
        '/state1': {},
        '/state2': {},
      },
    },
    {
      invite: 'Complex machine',
      parameters: [
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
      expected: {
        '/': {
          always: 'always',
          description: 'description',
          initial: 'state1',
          states: {
            state1: {
              always: 'always',
              states: {
                state3: {},
                state4: {},
              },
              type: 'parallel',
            },
            state2: {},
          },
        },
        '/state1': {
          always: 'always',
          type: 'parallel',
          states: {
            state3: {},
            state4: {},
          },
        },
        '/state1/state3': {},
        '/state1/state4': {},
        '/state2': {},
      },
    },
  );
});

describe('#2 => resolveConfig', () => {
  const { success: useTests } = createTests(resolveConfig);

  useTests({
    invite: 'Compound',
    parameters: [
      createConfig({
        states: {
          state1: {},
          state2: {},
        },
        initial: '/state1',
      }),
    ],
    expected: {
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
  });
});
