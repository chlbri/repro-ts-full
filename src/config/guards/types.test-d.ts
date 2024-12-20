import { GuardConfig } from './types';

type TT1 = 'exists';

type TT2 = 4;

type TT3 = {
  and: TT1;
};

type TT4 = 'check';

type TT5 = {
  or: [];
};

type TT6 = {
  or: [TT1, TT4];
};

type TT7 = {
  and: [TT6, TT2];
};

type TT8 = {
  or: [TT6, TT3, TT5];
};

expectTypeOf<TT1>().toMatchTypeOf<GuardConfig>();
expectTypeOf<TT2>().not.toMatchTypeOf<GuardConfig>();
expectTypeOf<TT3>().not.toMatchTypeOf<GuardConfig>();
expectTypeOf<TT4>().toMatchTypeOf<GuardConfig>();
expectTypeOf<TT5>().toMatchTypeOf<GuardConfig>();
expectTypeOf<TT6>().toMatchTypeOf<GuardConfig>();
expectTypeOf<TT7>().not.toMatchTypeOf<GuardConfig>();
expectTypeOf<TT8>().not.toMatchTypeOf<GuardConfig>();
