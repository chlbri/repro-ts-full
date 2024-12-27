import { createTests } from '@bemedev/vitest-extended';
import { DEFAULT_ARGS } from 'src/fixtures';
import { DEFAULT_NOTHING } from '~constants';
import { ERRORS } from '~utils';
import { performActionTest } from './functions.fixtures';

describe('#1 => performAction', () => {
  const useTests = createTests(performActionTest);

  describe('#1 => Errors', () => {
    test('#1 => Throw : "No params"', () => {
      const action = () => performActionTest({});
      expect(action).toThrowError(ERRORS.noParams.string);
    });

    test('#2 => Throw : "Action is undefined"', () => {
      const action = () => performActionTest({ args: DEFAULT_ARGS });
      expect(action).toThrowError('Action is undefined');
    });

    test('#3 => Throw : "Action is not described"', () => {
      const action = () =>
        performActionTest({
          action: { name: 'notDescribed', description: 'An action' },
          args: DEFAULT_ARGS,
        });
      expect(action).toThrowError('Action is not described');
    });

    test('#4 => Throw : "Action is not provided"', () => {
      const action = () =>
        performActionTest({
          action: 'notProvided',
          args: DEFAULT_ARGS,
        });
      expect(action).toThrowError('Action is not provided');
    });
  });

  describe('#2 => To nothing', () => {
    test('#1 =>', () => {
      const action = performActionTest({
        args: DEFAULT_ARGS,
        strict: false,
      });
      expect(action).toBe(DEFAULT_NOTHING);
    });

    test('#2 =>', () => {
      const action = performActionTest({
        args: DEFAULT_ARGS,
        action: 'notExisted',
        strict: false,
      });
      expect(action).toBe(DEFAULT_NOTHING);
    });

    test('#3 =>', () => {
      const action = performActionTest({
        args: DEFAULT_ARGS,
        action: { name: 'NotDescribed', description: 'An action' },
        strict: false,
      });
      expect(action).toBe(DEFAULT_NOTHING);
    });
  });

  describe('#3 => Running', () => {
    useTests(
      [
        'action1, true',
        [
          {
            action: 'action1',
            args: {
              context: { val1: 'TIMER' },
              event: { type: 'TIMER' },
            },
          },
        ],
        true,
      ],
      [
        'action1, false',
        [
          {
            action: 'action1',
            args: {
              context: { val1: 'TIMER' },
              event: { type: 'TIMER2' },
            },
          },
        ],
        false,
      ],
      [
        'action2, true',
        [
          {
            action: 'action2',
            args: {
              context: { val2: 5 },
              event: { type: 'TIMER2' },
            },
          },
        ],
        true,
      ],
      [
        'action2, false',
        [
          {
            action: 'action2',
            args: {
              context: { val1: '5' },
              event: { type: 'TIMER2' },
            },
          },
        ],
        false,
      ],
      [
        'action4, true',
        [
          {
            action: { name: 'action4', description: 'An action' },
            args: {
              context: { val1: '5' },
              event: { type: 'TIMER2' },
            },
          },
        ],
        true,
      ],
      [
        'action4, false',
        [
          {
            action: 'action4',
            args: {
              context: { val1: '5' },
              event: { type: 'TIMER' },
            },
          },
        ],
        false,
      ],
    );
  });
});
