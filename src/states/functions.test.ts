import { createTests } from '@bemedev/vitest-extended';
import {
  flatMapState,
  getInitialSimpleState,
  getInitialStateValue,
  getStateType,
  simplifyStateConfig,
  toStateMap,
} from './functions';
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

describe('#5 => simplifyStateConfig', () => {
  const useTests = createTests(simplifyStateConfig);

  const defaults = { entry: [], exit: [], tags: [] };

  useTests(
    ['Empty', [{}], { type: 'atomic', ...defaults }],
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
          state1: {
            type: 'parallel',
            states: {},
            __id: 'state1',
            ...defaults,
          },
          state2: { type: 'atomic', __id: 'state2', ...defaults },
        },
        initial: '',
        type: 'compound',
        ...defaults,
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
      {
        ...defaults,
        type: 'atomic',
        tags: ['busy'],
      },
    ],
  );
});

describe('#6 => getInitialSimpleState', () => {
  const useTests = createTests(getInitialSimpleState);
  const defaults = { entry: [], exit: [], tags: [] };

  useTests(
    ['Empty', [{}], { type: 'atomic', ...defaults }],
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
      {
        ...defaults,
        type: 'atomic',
        tags: ['busy'],
      },
    ],
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
          initial: 'state1',
        },
      ],
      {
        states: {
          state1: {
            type: 'parallel',
            states: {},
            __id: 'state1',
            ...defaults,
          },
        },
        initial: 'state1',
        type: 'compound',
        ...defaults,
      },
    ],
    [
      'Very Complex 1',
      [
        {
          states: {
            state1: {
              type: 'parallel',
              states: {
                state11: {
                  initial: 'state111',
                  states: {
                    state111: {},
                    state112: {},
                    state113: {},
                  },
                },
                state12: {},
                state13: {
                  type: 'parallel',
                  states: {
                    state131: {
                      initial: 'state1311',
                      states: {
                        state1311: {},
                        state1312: {},
                        state1313: {
                          initial: '13131',
                          states: {
                            state13131: {},
                            state13132: {},
                          },
                        },
                      },
                    },
                    state132: {},
                    state133: {},
                  },
                },
              },
            },
            state2: {
              initial: 'state21',
              states: {
                state21: {},
                state22: {},
              },
            },
          },
          initial: 'state1',
        },
      ],
      {
        initial: 'state1',
        type: 'compound',
        ...defaults,

        states: {
          state1: {
            __id: 'state1',
            type: 'parallel',
            ...defaults,

            states: {
              state11: {
                __id: 'state11',
                type: 'compound',
                initial: 'state111',
                ...defaults,

                states: {
                  state111: {
                    __id: 'state111',
                    type: 'atomic',
                    ...defaults,
                  },
                },
              },

              state12: {
                __id: 'state12',
                type: 'atomic',
                ...defaults,
              },

              state13: {
                __id: 'state13',
                type: 'parallel',
                ...defaults,

                states: {
                  state131: {
                    __id: 'state131',
                    type: 'compound',
                    ...defaults,
                    initial: 'state1311',

                    states: {
                      state1311: {
                        __id: 'state1311',
                        type: 'atomic',
                        ...defaults,
                      },
                    },
                  },

                  state132: {
                    __id: 'state132',
                    type: 'atomic',
                    ...defaults,
                  },

                  state133: {
                    __id: 'state133',
                    type: 'atomic',
                    ...defaults,
                  },
                },
              },
            },
          },
        },
      },
    ],
  );
});

describe('#7 => GetInitialStateValue', () => {
  const useTests = createTests(getInitialStateValue);

  useTests(
    ['Empty', [{}], {}],
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
      {},
    ],
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
          initial: 'state1',
        },
      ],
      {
        state1: {},
      },
    ],
    [
      'Compound  1',
      [
        {
          states: {
            state1: {},
            state2: {},
          },
          initial: 'state1',
        },
      ],
      'state1',
    ],
    [
      'Compound deep 1',
      [
        {
          states: {
            state1: {
              initial: 'state11',
              states: {
                state11: {},
                state12: {},
              },
            },
            state2: {},
          },
          initial: 'state1',
        },
      ],
      {
        state1: 'state11',
      },
    ],
    [
      'Very Complex 1',
      [
        {
          states: {
            state1: {
              type: 'parallel',
              states: {
                state11: {
                  initial: 'state111',
                  states: {
                    state111: {},
                    state112: {},
                    state113: {},
                  },
                },
                state12: {},
                state13: {
                  type: 'parallel',
                  states: {
                    state131: {
                      initial: 'state1311',
                      states: {
                        state1311: {},
                        state1312: {},
                        state1313: {
                          initial: '13131',
                          states: {
                            state13131: {},
                            state13132: {},
                          },
                        },
                      },
                    },
                    state132: {},
                    state133: {},
                  },
                },
              },
            },
            state2: {
              initial: 'state21',
              states: {
                state21: {},
                state22: {},
              },
            },
          },
          initial: 'state1',
        },
      ],
      {
        state1: {
          state11: 'state111',
          state12: {},
          state13: {
            state131: 'state1311',
            state132: {},
            state133: {},
          },
        },
      },
    ],
  );
});
