import { options, type TestParams } from '~fixtures';
import { ERRORS } from '~utils';
import { toPredicate } from './functions';
import type { GuardConfig } from './types';

type toPredicateTestF = (
  params: TestParams<GuardConfig, 'guard'>,
) => boolean;

export const toPredicateTest: toPredicateTestF = ({
  guard,
  args,
  strict = true,
}) => {
  if (!args) throw ERRORS.noParams.error;

  const out = toPredicate({
    guard,
    predicates: options.guards,
    strict,
  });
  const { context, event } = args;

  return out(context, event);
};
