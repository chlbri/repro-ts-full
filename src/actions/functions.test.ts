import { createTests } from '@bemedev/vitest-extended';
import { DEFAULT_ARGS } from 'src/fixtures';
import { DEFAULT_NOTHING } from '~constants';
import { ERRORS } from '~utils';
import { performActionTest } from './functions.fixtures';

describe('#1 => performAction', () => {
  const { acceptation, success, fails } = createTests(performActionTest);

  describe('#0 => Acceptation', acceptation);

  describe(
    '#1 => Errors',
    fails(
      {
        invite: '#1 => Throw : "No params"',
        parameters: {},
        error: ERRORS.noParams.string,
      },
      {
        invite: '#2 => Throw : "Action is undefined"',
        parameters: { args: DEFAULT_ARGS },
        error: 'Action is undefined',
      },
      {
        invite: '#3 => Throw : "Action is not described"',
        parameters: {
          action: { name: 'notDescribed', description: 'An action' },
          args: DEFAULT_ARGS,
        },
        error: 'Action is not described',
      },
      {
        invite: '#4 => Throw : "Action is not provided"',
        parameters: {
          action: 'notProvided',
          args: DEFAULT_ARGS,
        },
        error: 'Action is not provided',
      },
    ),
  );

  describe(
    '#2 => No strict',
    success(
      {
        invite: '#1 => No strict, returns DEFAULT_NOTHING',
        parameters: {
          args: DEFAULT_ARGS,
          strict: false,
        },
        expected: DEFAULT_NOTHING,
      },
      {
        invite:
          '#2 => No strict, action not existed, returns DEFAULT_NOTHING',
        parameters: {
          args: DEFAULT_ARGS,
          action: 'notExisted',
          strict: false,
        },
        expected: DEFAULT_NOTHING,
      },
      {
        invite:
          '#3 => No strict, action not described, returns DEFAULT_NOTHING',
        parameters: {
          args: DEFAULT_ARGS,
          action: { name: 'NotDescribed', description: 'An action' },
          strict: false,
        },
        expected: DEFAULT_NOTHING,
      },
    ),
  );

  describe(
    '#3 => Running',
    success(
      {
        invite: '#1 => action1, true',
        parameters: {
          action: 'action1',
          args: {
            context: { val1: 'TIMER' },
            event: { type: 'TIMER' },
          },
        },
        expected: true,
      },
      {
        invite: '#2 => action1, false',
        parameters: {
          action: 'action1',
          args: {
            context: { val1: 'TIMER' },
            event: { type: 'TIMER2' },
          },
        },
        expected: false,
      },
      {
        invite: '#3 => action2, true',
        parameters: {
          action: 'action2',
          args: {
            context: { val2: 5 },
            event: { type: 'TIMER2' },
          },
        },
        expected: true,
      },
      {
        invite: '#4 => action2, false',
        parameters: {
          action: 'action2',
          args: {
            context: { val1: '5' },
            event: { type: 'TIMER2' },
          },
        },
        expected: false,
      },
      {
        invite: '#5 => action4, true',
        parameters: {
          action: { name: 'action4', description: 'An action' },
          args: {
            context: { val1: '5' },
            event: { type: 'TIMER2' },
          },
        },
        expected: true,
      },
      {
        invite: '#6 => action4, false',
        parameters: {
          action: 'action4',
          args: {
            context: { val1: '5' },
            event: { type: 'TIMER' },
          },
        },
        expected: false,
      },
    ),
  );
});
