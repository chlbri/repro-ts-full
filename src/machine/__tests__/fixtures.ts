import { t } from '@bemedev/types';
import { Machine } from '~machine';
import { createConfig } from '../create';

export const config1 = createConfig({
  description: 'cdd',
  states: {
    state1: {
      states: {
        state11: {
          states: {
            state111: {},
          },
        },
        state12: {
          activities: {
            DELAY5: 'deal',
            DELAY17: 'deal17',
          },
        },
      },
    },
    state2: {
      after: {
        DELAY: { actions: ['dodo1', 'doré'] },
        DELAY2: '/state2',
        DELAY3: { actions: 'dodo2' },
      },
      on: {
        EVENT: { actions: ['dodo3', 'doré1'] },
        EVENT2: '/state4',
        EVENT3: { actions: 'dodo5' },
      },
      always: [
        { actions: 'dodo6', guards: 'guard2', target: '/state3' },
        {
          actions: ['dodo7', 'doré3', 'doré1'],
          guards: 'guard2',
          target: '/state3',
        },
        '/state1',
      ],
      promises: [
        {
          src: 'promise1',
          then: { actions: 'action1' },
          catch: [{ guards: 'ert', actions: 'action14' }, '/state1'],
          finally: [
            {
              actions: 'action13',
              guards: 'guar34',
            },
            {
              in: '/state4',
              actions: 'action13',
            },
            'action22',
          ],
        },
        {
          src: 'promise2',
          then: [
            { actions: 'action4', guards: 'guard2' },
            { actions: 'action3' },
          ],
          catch: [{ guards: 'ert', actions: 'action15' }, '/state1'],
          finally: [
            {
              in: '/state4',
              actions: 'action12',
            },
            'action20',
          ],
        },
      ],
    },
  },
});

export const machine1 = new Machine(config1)
  .providePrivateContext(t.buildObject({ data: t.string }))
  .provideContext(t.buildObject({ age: t.number }))
  .provideEvents({
    AUTH: t.buildObject({
      password: t.string,
      username: t.string,
    }),
    SEND: t.string,
  })
  .provideActions({})
  .provideGuards({})
  .provideDelays({})
  .providePromises({});

export type Machine1 = typeof machine1;
