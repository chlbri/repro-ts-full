import { createTests } from '@bemedev/vitest-extended';
import { toArray } from '~utils';

describe('toArray', () => {
  const useTests = createTests(toArray);

  useTests(
    ['string => string[]', ['fdfd'], ['fdfd']],
    ['number => number[]', [1], [1]],
    ['number[] => number[]', [[1, 2, 3]], [1, 2, 3]],
  );
});
