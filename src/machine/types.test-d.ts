import type { Action } from '~actions';
import { createConfig } from './create';
import type { GetInititals, MachineOptions } from './types';

const config1 = createConfig({
  states: {
    state1: {
      states: {
        state11: {
          states: {
            state111: {},
          },
        },
        state12: {},
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

type C1 = typeof config1;

/* // #region TODO
type Fm1 = FlatMapN<C1>;
expectTypeOf<Fm1>().toEqualTypeOf<{
  readonly '/': {
    readonly states: {
      readonly state1: {
        readonly states: {
          readonly state11: {
            readonly states: {
              readonly state111: {};
            };
          };
          readonly state12: {};
        };
      };

      readonly state2: {
        readonly after: {
          readonly DELAY: {
            readonly actions: readonly ['dodo1', 'doré'];
          };
          readonly DELAY2: '/state2';
          readonly DELAY3: { readonly actions: 'dodo2' };
        };
        readonly on: {
          readonly EVENT: {
            readonly actions: readonly ['dodo3', 'doré1'];
          };
          readonly EVENT2: '/state4';
          readonly EVENT3: {
            readonly actions: 'dodo5';
          };
        };
        readonly always: readonly [
          {
            readonly actions: 'dodo6';
            readonly guards: 'guard2';
            readonly target: '/state3';
          },
          {
            readonly actions: readonly ['dodo7', 'doré3', 'doré1'];
            readonly guards: 'guard2';
            readonly target: '/state3';
          },
          '/state1',
        ];
        readonly promises: readonly [
          {
            readonly src: 'promise1';
            readonly then: { readonly actions: 'action1' };
            readonly catch: readonly [
              { readonly guards: 'ert'; readonly actions: 'action14' },
              '/state1',
            ];
            readonly finally: readonly [
              {
                readonly actions: 'action13';
                readonly guards: 'guar34';
              },
              {
                readonly in: '/state4';
                readonly actions: 'action13';
              },
              'action22',
            ];
          },
          {
            readonly src: 'promise2';
            readonly then: readonly [
              { readonly actions: 'action4'; readonly guards: 'guard2' },
              { readonly actions: 'action3' },
            ];
            readonly catch: readonly [
              { readonly guards: 'ert'; readonly actions: 'action15' },
              '/state1',
            ];
            readonly finally: readonly [
              {
                readonly in: '/state4';
                readonly actions: 'action12';
              },
              'action20',
            ];
          },
        ];
      };
    };
  };

  readonly '/state1': {
    readonly states: {
      readonly state11: {
        readonly states: {
          readonly state111: {};
        };
      };
      readonly state12: {};
    };
  };

  readonly '/state1/state11': {
    readonly states: {
      readonly state111: {};
    };
  };

  readonly '/state1/state12': {};

  readonly '/state2': {
    readonly after: {
      readonly DELAY: {
        readonly actions: readonly ['dodo1', 'doré'];
      };
      readonly DELAY2: '/state2';
      readonly DELAY3: { readonly actions: 'dodo2' };
    };
    readonly on: {
      readonly EVENT: {
        readonly actions: readonly ['dodo3', 'doré1'];
      };
      readonly EVENT2: '/state4';
      readonly EVENT3: {
        readonly actions: 'dodo5';
      };
    };
    readonly always: readonly [
      {
        readonly actions: 'dodo6';
        readonly guards: 'guard2';
        readonly target: '/state3';
      },
      {
        readonly actions: readonly ['dodo7', 'doré3', 'doré1'];
        readonly guards: 'guard2';
        readonly target: '/state3';
      },
      '/state1',
    ];
    readonly promises: readonly [
      {
        readonly src: 'promise1';
        readonly then: { readonly actions: 'action1' };
        readonly catch: readonly [
          { readonly guards: 'ert'; readonly actions: 'action14' },
          '/state1',
        ];
        readonly finally: readonly [
          {
            readonly actions: 'action13';
            readonly guards: 'guar34';
          },
          {
            readonly in: '/state4';
            readonly actions: 'action13';
          },
          'action22',
        ];
      },
      {
        readonly src: 'promise2';
        readonly then: readonly [
          { readonly actions: 'action4'; readonly guards: 'guard2' },
          { readonly actions: 'action3' },
        ];
        readonly catch: readonly [
          { readonly guards: 'ert'; readonly actions: 'action15' },
          '/state1',
        ];
        readonly finally: readonly [
          {
            readonly in: '/state4';
            readonly actions: 'action12';
          },
          'action20',
        ];
      },
    ];
  };

  readonly '/state1/state11/state111': {};
}>;
// #endregion */

type Gi1 = GetInititals<C1>;

expectTypeOf<Gi1>().toEqualTypeOf<{
  readonly '/': 'state1' | 'state2';
  readonly '/state1': 'state11' | 'state12';
  readonly '/state1/state11': 'state111';
}>;

type Mo1 = MachineOptions<C1>;

expectTypeOf<Mo1>().toEqualTypeOf<{
  initials?: Partial<Gi1>;
  actions?: Record<
    | 'action12'
    | 'action13'
    | 'action14'
    | 'action15'
    | 'dodo1'
    | 'dodo2'
    | 'dodo3'
    | 'dodo5'
    | 'dodo6'
    | 'dodo7'
    | 'doré'
    | 'doré1'
    | 'doré3',
    Action
  >;
}>();
