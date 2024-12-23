import type { Finally, SingleOrArrayT, TransitionsConfig } from './types';

// #region SingleOrArrayT

expectTypeOf('57').toMatchTypeOf<SingleOrArrayT>();

expectTypeOf([
  { guards: 'ere', target: 'ere' },
  'fddfd',
] as const).toMatchTypeOf<SingleOrArrayT>();

expectTypeOf([
  { guards: 'ere', target: 'ere' },
  { guards: 'eee' },
] as const).not.toMatchTypeOf<SingleOrArrayT>();

expectTypeOf([
  { guards: 'ere', target: 'ere' },
  {},
] as const).not.toMatchTypeOf<SingleOrArrayT>();

expectTypeOf([
  { guards: 'ere', target: 'ere' },
  56,
] as const).not.toMatchTypeOf<SingleOrArrayT>();

expectTypeOf([
  { guards: 'ere', target: 'ere' },
  { guards: 'ere', target: 'ere' },
] as const).toMatchTypeOf<SingleOrArrayT>();

expectTypeOf([
  { guards: 'ere', target: 'ere' },
  { target: 'ere' },
] as const).toMatchTypeOf<SingleOrArrayT>();

// #endregion

// #region Finally

expectTypeOf<object>().toMatchTypeOf<Finally>();
expectTypeOf<{ not: 'not' }>().not.toMatchTypeOf<Finally>();
expectTypeOf<{ description: 'description' }>().toMatchTypeOf<Finally>();
expectTypeOf<'actions'>().toMatchTypeOf<Finally>();

// #endregion

// #region Transitions

expectTypeOf({}).toMatchTypeOf<TransitionsConfig>();

// #region on
expectTypeOf({ on: {} }).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  on: {
    EVENT: {},
  },
}).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  on: {
    EVENT1: {
      not: 'not',
    },
    EVENT2: {
      actions: [],
    },
  },
}).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  on: {
    EVENT1: {
      target: '/state1',
    },
    EVENT2: {
      actions: [],
      in: '/state1',
    },
    EVENT3: '/state1',
  },
}).toMatchTypeOf<TransitionsConfig>();
// #endregion

// #region after
expectTypeOf({ after: {} }).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  after: {
    TIME: {},
  },
}).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  after: {
    TIME1: {
      not: 'not',
    },
    TIME2: {
      actions: [],
    },
  },
}).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  after: {
    TIME1: {
      target: '/state1',
    },
    TIME2: {
      actions: [],
      in: '/state1',
    },
    TIME3: '/state1',
  },
}).toMatchTypeOf<TransitionsConfig>();
// #endregion

// #region always
expectTypeOf({ always: [] }).not.toMatchTypeOf<TransitionsConfig>();
expectTypeOf({ always: 'ere' }).toMatchTypeOf<TransitionsConfig>();
expectTypeOf({
  always: ['/state1'],
} as const).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  always: ['/state2', '/state1'],
} as const).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  always: [{ guards: 'ert' }, '/state1'],
} as const).toMatchTypeOf<TransitionsConfig>();
// #endregion

// #region promise
expectTypeOf({ promise: [] }).toMatchTypeOf<TransitionsConfig>();
expectTypeOf({ promise: {} }).not.toMatchTypeOf<TransitionsConfig>();
expectTypeOf({
  promise: { src: 'promise1' },
}).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: { src: 'promise1', then: {}, catch: ['/state1'] },
} as const).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: { src: 'promise1', then: {}, catch: [{}, '/state1'] },
} as const).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
  },
} as const).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
    finally: [],
  },
} as const).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
    finally: {},
  },
} as const).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
    finally: [{}],
  },
} as const).toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
    finally: [{}, 'actions'],
  },
} as const).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
    finally: [{ target: 'ert' }, {}],
  },
} as const).not.toMatchTypeOf<TransitionsConfig>();

expectTypeOf({
  promise: {
    src: 'promise1',
    then: {},
    catch: [{ guards: 'ert' }, '/state1'],
    finally: [{ guards: 'ert' }, {}],
  },
} as const).toMatchTypeOf<TransitionsConfig>();
// #endregion

// #endregion
