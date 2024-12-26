import type { TC, TE, TestParams } from 'src/types.fixtures';
import { ERRORS } from 'src/utils';
import { performAction } from './functions';
import type { ActionConfig, ActionMap } from './types';

export const actions: ActionMap<TC, TE> = {
  action1: ({ val1 }, { type }) => val1 === type,
  action2: ({ val2 }) => val2 === 5,
  action3: ({ val1 }) => val1 === 'TIMER',
  action4: (_, { type }) => type === 'TIMER2',
};

type performActionTestF = (
  params: TestParams<ActionConfig, 'action'>,
) => any;

export const performActionTest: performActionTestF = ({
  action,
  args,
  _default = false,
}) => {
  if (!args) throw ERRORS.noParams.error;
  return performAction({
    action,
    actions,
    args,
    _default,
  });
};
