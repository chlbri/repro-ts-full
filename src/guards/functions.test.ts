import { createTests } from '@bemedev/vitest-extended';
import { DEFAULT_ARGS } from '~fixtures';
import { ERRORS } from '~utils';
import { toPredicateTest } from './functions.fixtures';

describe('#1 => To Predicate', () => {
  describe('#1 => Errors', () => {
    test('#1 => Throw : "No params"', () => {
      const action = () => toPredicateTest({});
      expect(action).toThrowError(ERRORS.noParams.string);
    });

    test('#2 => Throw : "Guard is undefined"', () => {
      const action = () => toPredicateTest({ args: DEFAULT_ARGS });
      expect(action).toThrowError('Guard is undefined');
    });

    test('#3 => Throw : "Guard is not described"', () => {
      const action = () =>
        toPredicateTest({
          guard: { name: 'notDescribed', description: 'An action' },
          args: DEFAULT_ARGS,
        });
      expect(action).toThrowError('Guard is not described');
    });

    test('#4 => Throw : "Guard is not provided"', () => {
      const action = () =>
        toPredicateTest({
          guard: 'notProvided',
          args: DEFAULT_ARGS,
        });
      expect(action).toThrowError('Guard is not provided');
    });
  });

  describe('#3 => Running', () => {
    const useTests = createTests(toPredicateTest);

    useTests(
      [
        'guard1, and default args',
        [{ guard: 'guard1', args: DEFAULT_ARGS }],
        false,
      ],
      [
        'guard1, but val1 not equals to event.type',
        [
          {
            guard: 'guard1',
            args: {
              context: {
                val1: 'TIMER2',
              },
              event: {
                type: 'TIMER',
              },
            },
          },
        ],
        false,
      ],
      [
        'guard1, val1 equals to event.type',
        [
          {
            guard: 'guard1',
            args: {
              context: {
                val1: 'TIMER',
              },
              event: {
                type: 'TIMER',
              },
            },
          },
        ],
        true,
      ],
      [
        'guard2, val2 not equals 5',
        [
          {
            guard: 'guard2',
            args: {
              context: {
                val2: 6,
              },
              event: {
                type: 'TIMER',
              },
            },
          },
        ],
        false,
      ],
      [
        'guard2, val2 equals 5',
        [
          {
            guard: 'guard2',
            args: {
              context: {
                val2: 5,
              },
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        true,
      ],
      [
        'guard3, val1 equals TIMER',
        [
          {
            guard: 'guard3',
            args: {
              context: {
                val1: 'TIMER',
              },
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        true,
      ],
      [
        'guard3, val1 not equals TIMER',
        [
          {
            guard: 'guard3',
            args: {
              context: {
                val1: 'TIMER2',
              },
              event: {
                type: 'TIMER',
              },
            },
          },
        ],
        false,
      ],
      [
        'guard4, type not equals TIMER2',
        [
          {
            guard: 'guard3',
            args: {
              context: {},
              event: {
                type: 'TIMER',
              },
            },
          },
        ],
        false,
      ],
      [
        'guard4, type equals TIMER2',
        [
          {
            guard: 'guard3',
            args: {
              context: {},
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        false,
      ],
      [
        'mix 1',
        [
          {
            guard: {
              or: ['guard1', 'guard3'],
            },
            args: {
              context: {
                val1: 'TIMER',
              },
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        true,
      ],
      [
        'mix 2',
        [
          {
            guard: {
              and: ['guard1', 'guard3'],
            },
            args: {
              context: {
                val1: 'TIMER',
              },
              event: {
                type: 'TIMER',
              },
            },
          },
        ],
        true,
      ],
      [
        'mix 3',
        [
          {
            guard: {
              and: ['guard1', 'guard4'],
            },
            args: {
              context: {
                val1: 'TIMER2',
              },
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        true,
      ],
      [
        'mix 4',
        [
          {
            guard: {
              and: ['guard2', 'guard4'],
            },
            args: {
              context: {
                val2: 5,
              },
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        true,
      ],
      [
        'mix 5',
        [
          {
            guard: {
              and: ['guard2', 'guard4'],
            },
            args: {
              context: {
                val2: 4,
              },
              event: {
                type: 'TIMER2',
              },
            },
          },
        ],
        false,
      ],
    );
  });
});
