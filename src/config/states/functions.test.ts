import { createTests } from '@bemedev/vitest-extended';
import { getStateType } from './functions';

describe('getStateType', () => {
  const useTests = createTests(getStateType);

  useTests(
    // #region Atomic
    ['empty stateNode => "atomic"', [{}], 'atomic'],
    [
      'stateNode typed "atomic" => "atomic"',
      [{ type: 'atomic' }],
      'atomic',
    ],
    [
      'stateNode without children => "atomic"',
      [
        {
          after: {
            seconds: { target: 'any' },
          },
        },
      ],
      'atomic',
    ],
    // #endregion

    // #region Compound
    [
      'stateNode with children => "compound"',
      [
        {
          initial: 'a',
          states: { a: {} },
        },
      ],
      'compound',
    ],
    [
      'stateNode typed "compound" => "compound"',
      [
        {
          type: 'compound',
          initial: 'a',
          states: { a: {} },
        },
      ],
      'compound',
    ],
    // #endregion

    // #region Parallel
    [
      'Only stateNode typed "parallel" is "parallel" => "parallel"',
      [
        {
          type: 'parallel',
          states: {
            a: {},
            b: {},
          },
        },
      ],
      'parallel',
    ],
    // #endregion

    // #region Final
    [
      'Only stateNode typed "final" is "final" => "final"',
      [
        {
          type: 'final',
        },
      ],
      'final',
    ],

    // #endregion
  );
});
