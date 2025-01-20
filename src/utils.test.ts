import { createTests } from '@bemedev/vitest-extended';
import { identify, toArray } from '~utils';
import { recomposeSV } from './utils';

describe('#1 => toArray', () => {
  const useTests = createTests(toArray);

  useTests(
    ['string => string[]', ['fdfd'], ['fdfd']],
    ['number => number[]', [1], [1]],
    ['number[] => number[]', [[1, 2, 3]], [1, 2, 3]],
  );
});

describe('#2 => identify', () => {
  const useTests = createTests(identify);

  useTests(
    ['Empty object', [{}], []],
    [
      'Two children',
      [{ child1: {}, child2: {} }],
      [
        {
          __id: 'child1',
        },
        {
          __id: 'child2',
        },
      ],
    ],
    [
      'Complex',
      [
        {
          arg1: { arg12: 45, ert11: 'string' },
          arg3: {
            arg31: { arg311: 'string' },
          },
        },
      ],
      [
        {
          __id: 'arg1',
          arg12: 45,
          ert11: 'string',
        },
        {
          __id: 'arg3',
          arg31: {
            arg311: 'string',
          },
        },
      ] as any,
    ],
  );
});

describe('#2 => recomposeSV', () => {
  const useTests = createTests(recomposeSV);

  useTests(
    ['undefined', [], {}],
    ['empty', [''], {}],
    ['NO delimiter', ['chlbri'], 'chlbri'],
    [
      'One delimiter',
      ['state1/state11'],
      {
        state1: 'state11',
      },
    ],
    [
      'Many delimiters',
      ['state1/state11/state111/state1111'],
      {
        state1: {
          state11: {
            state111: 'state1111',
          },
        },
      },
    ],
  );
});
