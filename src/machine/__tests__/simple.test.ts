import { t } from '@bemedev/types';
import { createMachine } from '~machine';
import { config1 } from './fixtures';

describe('simple', () => {
  const machine = createMachine(config1, {
    context: t.buildObject({
      data: t.string,
    }),
    pContext: t.object,
    eventsMap: t.object,
  });
  test('#0 => Initialize machine', () => {});

  test('#1 => Before all, simple is empty', () => {
    expect(machine.simple).toBeUndefined();
  });

  test('#2 => ProbideInitials', () => {
    machine._provideInitials({
      '/': 'state1',
      '/state1': 'state11',
      '/state1/state11': 'state111',
    } as any);
  });

  test.todo('Console.log', () => {
    console.log(JSON.stringify(machine.simple, null, 2));
  });

  test('#3 => simple is defined, check it !', () => {
    const expected = {
      type: 'compound',
      entry: [],
      exit: [],
      tags: [],
      initial: 'state1',
      states: [
        {
          type: 'compound',
          entry: [],
          exit: [],
          tags: [],
          initial: 'state11',
          states: [
            {
              type: 'compound',
              entry: [],
              exit: [],
              tags: [],
              initial: 'state111',
              states: [
                {
                  type: 'atomic',
                  entry: [],
                  exit: [],
                  tags: [],
                  states: [],
                  __id: 'state111',
                },
              ],
              __id: 'state11',
            },
            {
              type: 'atomic',
              entry: [],
              exit: [],
              tags: [],
              states: [],
              __id: 'state12',
            },
          ],
          __id: 'state1',
        },
        {
          type: 'atomic',
          entry: [],
          exit: [],
          tags: [],
          states: [],
          __id: 'state2',
        },
      ],
    };

    expect(machine.simple).toStrictEqual(expected);
  });
});
