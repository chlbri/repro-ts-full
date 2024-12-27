import { createTests } from '@bemedev/vitest-extended';
import { options } from '~fixtures';
import { toTransitionTest } from './functions.fixtures';

describe('#1 => toTransition', () => {
  const useTests = createTests(toTransitionTest);

  useTests(
    [
      'String',
      ['/state1'],
      { target: ['/state1'], actions: [], guards: [], in: [] },
    ],
    [
      'Simple object 1',
      [{ actions: 'action1' }],
      {
        target: [],
        actions: [options.actions.action1],
        guards: [],
        in: [],
      },
    ],
    [
      'Simple object 2',
      [{ target: '/state3' }],
      {
        target: ['/state3'],
        actions: [],
        guards: [],
        in: [],
      },
    ],
    [
      'Complex object 1',
      [{ target: '/state3', in: '/state2', description: 'An illusion' }],
      {
        target: ['/state3'],
        actions: [],
        guards: [],
        in: ['/state2'],
        description: 'An illusion',
      },
    ],
    [
      'Complex object 2',
      [
        {
          target: ['/state3', '/state5/state1'],
          in: '/state2',
          description: 'An illusion',
          actions: ['action1', 'action2'],
        },
      ],
      {
        target: ['/state3', '/state5/state1'],
        actions: [options.actions.action1, options.actions.action2],
        guards: [],
        in: ['/state2'],
        description: 'An illusion',
      },
    ],
  );
});
