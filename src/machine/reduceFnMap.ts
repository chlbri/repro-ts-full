import { isFunction, type ReduceFnMap_F } from '~types';

export const reduceFnMap: ReduceFnMap_F = ({
  events,
  fn,
  mode,
  _default,
}) => {
  const check1 = isFunction(fn);
  if (check1) return fn;

  const keys = Object.keys(events);

  return (pContext, context, { payload, type }) => {
    const _else = fn.else;

    for (const key of keys) {
      const check2 = type === key;
      const func = fn[key];
      const check3 = !!func;

      const check4 = check2 && check3;
      if (check4) return func(pContext, context, payload);
    }

    if (_else) return _else(pContext, context, { type, payload } as any);

    if (mode === 'normal') return _default();
    throw 'not';
  };
};
