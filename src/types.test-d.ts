import type { PrimitiveObject } from '~types';

const ttString = 'str';
const ttNumber = 55;
const ttBoolean = true;
const ttArra1 = [1, 2, 3] as const;
const ttArray2 = [1, 2, 3];
const ttObject = { a: 1, b: 2, c: 3 } as const;
const ttFunction = () => {};
const ttArrowFunction = () => {};
const ttClass = class {};

const complexObject1 = {
  a: 1,
  b: 'str',
  c: true,
  d: [1, 2, 3, { a: 1, b: 2, c: 'str' }],
  e: { a: 1, b: 2, c: [3] },
};

class TC {}
const complexObject2 = {
  a: 1,
  b: 'str',
  c: true,
  d: [1, 2, 3, { a: 1, b: 2, c: 'str' }],
  e: { a: 1, b: 2, c: [3] },
  f: new TC(),
};

assertType<PrimitiveObject>(ttString);
assertType<PrimitiveObject>(ttNumber);
assertType<PrimitiveObject>(ttBoolean);
expectTypeOf(ttArra1).not.toMatchTypeOf<PrimitiveObject>();
expectTypeOf(ttArray2).not.toMatchTypeOf<PrimitiveObject>();
assertType<PrimitiveObject>(ttObject);
expectTypeOf(ttFunction).not.toMatchTypeOf<PrimitiveObject>();
expectTypeOf(ttArrowFunction).not.toMatchTypeOf<PrimitiveObject>();
expectTypeOf(ttClass).not.toMatchTypeOf<PrimitiveObject>();
assertType<PrimitiveObject>(complexObject1);
expectTypeOf(complexObject2).not.toMatchTypeOf<PrimitiveObject>();
