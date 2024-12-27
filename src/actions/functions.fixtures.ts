import { options, type TestParams } from 'src/fixtures';
import { ERRORS } from '~utils';
import { toAction } from './functions';
import type { ActionConfig } from './types';

type performActionTestF = (
  params: TestParams<ActionConfig, 'action'>,
) => any;

export const performActionTest: performActionTestF = ({
  action,
  args,
  strict = true,
}) => {
  if (!args) throw ERRORS.noParams.error;

  const out = toAction({
    action,
    actions: options.actions,
    strict,
  });
  const { context, event } = args;

  return out(context, event);
};
