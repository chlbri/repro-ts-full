import type { NotUndefined } from '@bemedev/types';
import type {
  ActionKeysFrom,
  ConfigFrom,
  ContextFrom,
  DelayKeysFrom,
  EventsFrom,
  EventsMapFrom,
  GuardKeysFrom,
  MachineKeysFrom,
  MachineOptions,
  PrivateContextFrom,
  PromiseKeysFrom,
} from '../types';
import { config1, Machine1 } from './fixtures';

type TTConfig = ConfigFrom<Machine1>;
expectTypeOf<TTConfig>().toEqualTypeOf(config1);

type TTPrivate = PrivateContextFrom<Machine1>;
expectTypeOf<TTPrivate>().toEqualTypeOf<{
  readonly data: string;
}>();

type TTC = ContextFrom<Machine1>;
expectTypeOf<TTC>().toEqualTypeOf<{
  readonly age: number;
}>();

type TTEm = EventsMapFrom<Machine1>;
expectTypeOf<TTEm>().toEqualTypeOf<{
  AUTH: {
    password: string;
    username: string;
  };
  SEND: string;
}>();

type TTE = EventsFrom<Machine1>;
expectTypeOf<TTE>().toEqualTypeOf<
  | {
      type: 'AUTH';
      payload: {
        password: string;
        username: string;
      };
    }
  | {
      type: 'SEND';
      payload: string;
    }
>();

type ActionKeys = ActionKeysFrom<Machine1>;
expectTypeOf<ActionKeys>().toEqualTypeOf<
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
  | 'deal'
  | 'deal17'
  | 'doré'
  | 'doré1'
  | 'doré3'
>();

type GuardKeys = GuardKeysFrom<Machine1>;
expectTypeOf<GuardKeys>().toEqualTypeOf<'ert' | 'guar34' | 'guard2'>();

type DelayKeys = DelayKeysFrom<Machine1>;
expectTypeOf<DelayKeys>().toEqualTypeOf<
  'DELAY' | 'DELAY2' | 'DELAY3' | 'DELAY5' | 'DELAY17'
>();

type PromiseKeys = PromiseKeysFrom<Machine1>;
expectTypeOf<PromiseKeys>().toEqualTypeOf<'promise1' | 'promise2'>();

type MachineKeys = MachineKeysFrom<Machine1>;
expectTypeOf<MachineKeys>().toEqualTypeOf<'machine1'>();

type Mo1 = Required<
  NotUndefined<MachineOptions<TTConfig, TTPrivate, TTC, TTE>>
>;

type MoActionKeys1 = keyof Mo1['actions'];
expectTypeOf<MoActionKeys1>().toEqualTypeOf<ActionKeys>();

type MoGuardKeys1 = keyof Mo1['guards'];
expectTypeOf<MoGuardKeys1>().toEqualTypeOf<GuardKeys>();

type MoDelayKeys1 = keyof Mo1['delays'];
expectTypeOf<MoDelayKeys1>().toEqualTypeOf<DelayKeys>();

type MoPromiseKeys1 = keyof Mo1['promises'];
expectTypeOf<MoPromiseKeys1>().toEqualTypeOf<PromiseKeys>();

type MoMachineKeys1 = keyof Mo1['machines'];
expectTypeOf<MoMachineKeys1>().toEqualTypeOf<MachineKeys>();
