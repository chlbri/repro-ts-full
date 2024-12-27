import { toArray } from '~utils';

expectTypeOf(toArray<string>('fdfd')).toEqualTypeOf<string[]>();
expectTypeOf(toArray<string>('fdfd')).not.toEqualTypeOf<string>();

expectTypeOf(toArray<number>(1)).toEqualTypeOf<number[]>();
expectTypeOf(toArray<number>(1)).not.toEqualTypeOf<number>();

expectTypeOf(toArray<number>([1, 2, 3])).toEqualTypeOf<number[]>();
