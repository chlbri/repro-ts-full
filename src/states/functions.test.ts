import { createTests } from '@bemedev/vitest-extended';
import {
  flatMapState,
  getInitialSimpleState,
  getInitialStateValue,
  getNextSimple,
  getNextStateValue,
  getStateType,
  nodeToValue,
  toSimple,
  toStateMap,
} from './functions';
import {
  body1,
  resolveStateTest,
  stateValue1,
} from './functions.fixtures';
import { restSimpleState, type StateNodeConfig } from './types';

describe('#01 => getStateType', () => {
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

describe('#02 => flatMapMachine', () => {
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
          states: {
            state1: {},
            state2: {},
          },
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
    ],
  );
});

describe('#03 => resolveState', () => {
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

describe('#04 => toStateMap', () => {
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

describe('#05 => toSimple', () => {
  const useTests = createTests(toSimple);

  useTests(
    ['Empty', [{}], { type: 'atomic', ...restSimpleState }],
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
        ...restSimpleState,
        states: [
          {
            type: 'parallel',
            __id: 'state1',
            ...restSimpleState,
          },
          { type: 'atomic', __id: 'state2', ...restSimpleState },
        ],
        initial: '',
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
      {
        ...restSimpleState,
        type: 'atomic',
        tags: ['busy'],
      },
    ],
  );
});

describe('#06 => getInitialSimpleState', () => {
  const useTests = createTests(getInitialSimpleState);

  useTests(
    ['Empty', [{}], { type: 'atomic', ...restSimpleState }],
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
        ...restSimpleState,
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
        ...restSimpleState,
        states: [
          {
            type: 'parallel',
            ...restSimpleState,
            __id: 'state1',
          },
        ],
        initial: 'state1',
        type: 'compound',
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
                          initial: 'state13131',
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
        ...restSimpleState,

        states: [
          {
            __id: 'state1',
            type: 'parallel',
            ...restSimpleState,

            states: [
              {
                __id: 'state11',
                type: 'compound',
                initial: 'state111',
                ...restSimpleState,

                states: [
                  { ...restSimpleState, __id: 'state111', type: 'atomic' },
                ],
              },

              {
                ...restSimpleState,
                __id: 'state12',
                type: 'atomic',
              },

              {
                __id: 'state13',
                type: 'parallel',
                ...restSimpleState,

                states: [
                  {
                    __id: 'state131',
                    type: 'compound',
                    ...restSimpleState,
                    initial: 'state1311',

                    states: [
                      {
                        ...restSimpleState,
                        __id: 'state1311',
                        type: 'atomic',
                      },
                    ],
                  },

                  {
                    ...restSimpleState,
                    __id: 'state132',
                    type: 'atomic',
                  },

                  {
                    ...restSimpleState,
                    __id: 'state133',
                    type: 'atomic',
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  );
});

describe('07 => nodeToValue', () => {
  const useTests = createTests(nodeToValue);

  useTests(
    ['Empty', [{}], {}],
    ['Simple', [body1], { state1: {}, state2: {} }],
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
        state2: {},
      },
    ],
    [
      'Compound  1',
      [
        {
          states: {
            state1: {},
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
              },
            },
            state2: {},
          },
          initial: 'state1',
        },
      ],
      {
        state1: 'state11',
        state2: {},
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
                          initial: 'state13131',
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
              },
            },
          },
          initial: 'state1',
        },
      ],
      {
        state1: {
          state11: {
            state111: {},
            state112: {},
            state113: {},
          },
          state12: {},
          state13: {
            state131: {
              state1311: {},
              state1312: {},
              state1313: {
                state13131: {},
                state13132: {},
              },
            },
            state132: {},
            state133: {},
          },
        },
        state2: 'state21',
      },
    ],
  );
});

describe('#07 => GetInitialStateValue', () => {
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
            state1: {},
            state2: {},
          },
          initial: 'state1',
        },
      ],
      'state1',
    ],
    [
      'Complex 2',
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
      { state1: {} },
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
          initial: 'state1',
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

describe('#08 => getNextStateValue', () => {
  const useTests = createTests(getNextStateValue);

  useTests(
    ['From is empty', [''], {}],
    ['From is simple string, no targets #1', ['state'], 'state'],
    ['From is simple string, no targets #2', ['/state'], '/state'],
    [
      'From is simple string, with target #1',
      ['/state', '/state4'],
      '/state4',
    ],
    [
      'From is simple string, with target #2',
      ['/state', '/state/state4'],
      {
        state: 'state4',
      },
    ],
    ['Empty StateValueMap and target', [{}, '/state4'], '/state4'],
    [
      'StateValueMap and target #1',
      [{ state1: 'state11' }, '/state4'],
      '/state4',
    ],
    [
      'StateValueMap and target #2',
      [{ state1: 'state11' }, '/state1/state12'],
      {
        state1: '/state12',
      },
    ],
    [
      'StateValueMap and target #2',
      [{ state1: { state11: 'state111' } }, '/state1/state12'],
      {
        state1: '/state12',
      },
    ],
    [
      'StateValueMap and target #3',
      [
        { state1: { state11: { state111: 'state1111' } } },
        '/state1/state11/state112',
      ],
      {
        state1: {
          state11: '/state112',
        },
      },
    ],
    [
      'StateValueMap and target #4',
      [
        { state1: { state11: { state111: 'state1111' } } },
        '/state1/state11/state111/state1112',
      ],
      {
        state1: {
          state11: {
            state111: '/state1112',
          },
        },
      },
    ],
  );
});

describe('#09 => getNextSimpleState', () => {
  describe('#1 => Errors', () => {
    test('#1 => From is empty and body is empty', () => {
      const to = 'notExists';
      const toError = () => getNextSimple({ from: {}, body: {}, to });

      expect(toError).toThrowError(`${to} is not inside the config`);
    });
  });

  describe('#2 => No errors - Running', () => {
    describe('#1 => No errors', () => {
      test('#1 => not error with target inside body', () => {
        const actual = () =>
          getNextSimple({
            from: stateValue1,
            body: body1,
            to: stateValue1,
          });

        expect(actual).not.toThrowError();
      });

      test('#1 => not error with target inside body', () => {
        const actual = () =>
          getNextSimple({
            from: stateValue1,
            body: body1,
            to: stateValue1,
          });

        expect(actual).not.toThrowError();
      });
    });

    describe('#2 => Running', () => {
      const useTests = createTests(getNextSimple);

      useTests(
        // #region Todo
        [
          'Simple body #1',
          [{ body: body1, from: '/state1', to: '/state2' }],
          {
            initial: 'state1',
            type: 'compound',
            ...restSimpleState,
            states: [
              {
                type: 'atomic',
                __id: 'state2',
                ...restSimpleState,
                entry: [{ name: 'start2' }],
              },
            ],
          },
        ],
        [
          'Simple body #2',
          [{ body: body1, from: '/state2', to: '/state1' }],
          {
            initial: 'state1',
            type: 'compound',
            ...restSimpleState,
            states: [
              {
                __id: 'state1',
                type: 'atomic',
                ...restSimpleState,
                exit: [{ name: 'end1' }],
              },
            ],
          },
        ],
        [
          'Simple body #3',
          [{ body: body1, from: '/', to: '/state2' }],
          {
            initial: 'state1',
            type: 'compound',
            ...restSimpleState,
            states: [
              {
                __id: 'state2',
                type: 'atomic',
                ...restSimpleState,
                entry: [{ name: 'start2' }],
              },
            ],
          },
        ],
        [
          'Simple body #4',
          [{ body: body1, from: '/state2', to: '/state2' }],
          {
            initial: 'state1',
            type: 'compound',
            ...restSimpleState,
            states: [
              {
                __id: 'state2',
                type: 'atomic',
                ...restSimpleState,
                entry: [{ name: 'start2' }],
              },
            ],
          },
        ],
        [
          'Parallel body #1',
          [
            {
              body: {
                type: 'parallel',
                states: {
                  state1: {
                    initial: 'state11',
                    states: {
                      state11: {},
                      state12: {},
                    },
                  },
                  state2: {
                    entry: 'start2',
                    initial: 'state21',
                    states: {
                      state21: {},
                      state22: {},
                    },
                  },
                },
              },
              from: '/state1',
              to: '/state2',
            },
          ],
          {
            ...restSimpleState,
            type: 'parallel',
            states: [
              {
                __id: 'state2',
                ...restSimpleState,
                type: 'compound',
                entry: [{ name: 'start2' }],
                initial: 'state21',
                states: [
                  {
                    __id: 'state21',
                    type: 'atomic',
                    ...restSimpleState,
                  },
                  {
                    __id: 'state22',
                    type: 'atomic',
                    ...restSimpleState,
                  },
                ],
              },
            ],
          },
        ],
        // #endregion

        [
          'Parallel body #2',
          [
            {
              body: {
                type: 'parallel',
                states: {
                  state1: {
                    initial: 'state11',
                    states: {
                      state11: {},
                      state12: {},
                    },
                  },
                  state2: {
                    entry: 'start2',
                    initial: 'state21',
                    states: {
                      state21: {},
                      state22: {},
                    },
                  },
                },
              },
              from: '/state1/state11',
              to: '/state1/state12',
            },
          ],
          {
            ...restSimpleState,
            type: 'parallel',
            states: [
              {
                __id: 'state1',
                ...restSimpleState,
                type: 'compound',
                initial: 'state11',
                states: [
                  {
                    __id: 'state12',
                    type: 'atomic',
                    ...restSimpleState,
                  },
                ],
              },
            ],
          },
        ],
      );
    });
  });
});
