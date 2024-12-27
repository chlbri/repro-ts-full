import { ERRORS } from '~constants';
import { toTransition, type TransitionConfig } from '~transitions';
import { isDescriber } from '~types';
import { defaultReturn, nothing, toArray } from '~utils';
import type { ToPromise_F, ToPromiseSrc_F } from './types';

export const asyncNothing = async () => {
  return nothing();
};

export const toPromiseSrc: ToPromiseSrc_F = ({
  src,
  promises,
  strict = false,
}) => {
  const out = (error: Error, _return?: any) => {
    return defaultReturn({
      config: {
        strict,
        value: asyncNothing,
      },
      _return,
      error,
    });
  };

  if (isDescriber(src)) {
    const func = promises?.[src.name];
    return out(ERRORS.promise.notDescribed.error, func);
  }

  const func = promises?.[src];
  return out(ERRORS.promise.notProvided.error, func);
};

export const toPromise: ToPromise_F = ({ config, options, strict }) => {
  const src = toPromiseSrc({
    src: config.src,
    promises: options?.promises,
    strict,
  });

  const then = toArray<TransitionConfig>(config.then).map(transition =>
    toTransition(transition, options, strict),
  );

  const _catch = toArray<TransitionConfig>(config.catch).map(transition =>
    toTransition(transition, options, strict),
  );

  const _finally = toArray<TransitionConfig>(config.finally).map(
    transition => toTransition(transition, options, strict),
  );

  const out = { src, then, catch: _catch, finally: _finally } as any;

  const { id, description } = config;
  if (id) out.id = id;
  if (description) out.description = description;

  return out;
};
