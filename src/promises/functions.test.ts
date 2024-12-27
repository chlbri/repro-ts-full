import { createTests } from '@bemedev/vitest-extended';
import { ERRORS as MAIN_ERRORS } from '~constants';
import { options } from '~fixtures';
import { ERRORS } from '~utils';
import { asyncNothing } from './functions';
import { toPromiseTest } from './functions.fixtures';

describe('#1 => To Predicate', () => {
  describe('#1 => Errors', () => {
    test('#1 => Throw : "No params"', () => {
      const promise = () => toPromiseTest();
      expect(promise).toThrowError(ERRORS.noParams.string);
    });

    test('#2 => Throw: notProvided', () => {
      const promise = () =>
        toPromiseTest({
          src: 'notDefined',
          catch: '/error',
          then: '/success',
        });
      expect(promise).toThrowError(MAIN_ERRORS.promise.notProvided.string);
    });

    test('#3 => Throw: notDescribed', () => {
      const promise = () =>
        toPromiseTest({
          src: { name: 'notDefined', description: 'A promise' },
          // description: 'A promise',
          // id: 'promise1',
          catch: '/error',
          then: '/success',
        });
      expect(promise).toThrowError(
        MAIN_ERRORS.promise.notDescribed.string,
      );
    });
  });

  describe('#2 => Nothing returned', () => {
    test('#1 => ', () => {
      const promise = toPromiseTest(
        {
          src: { name: 'notDefined', description: 'A promise' },
          description: 'A promise',
          id: 'promise1',
          catch: '/error',
          then: '/success',
        },
        false,
      );

      expect(promise.src).toBe(asyncNothing);
    });

    test('#2 => ', () => {
      const promise = toPromiseTest(
        {
          src: 'notDefined',
          catch: '/error',
          then: '/success',
        },
        false,
      );

      expect(promise.src).toBe(asyncNothing);
    });
  });

  describe('#3 => Running', () => {
    const useTests = createTests(toPromiseTest);

    useTests(
      [
        'Very Simple',
        [
          {
            src: { name: 'notDefined', description: 'A promise' },
            // description: 'A promise',
            // id: 'promise1',
            catch: '/error',
            then: '/success',
          },
          false,
        ],
        {
          catch: [
            {
              actions: [],
              guards: [],
              in: [],
              target: ['/error'],
            },
          ],
          finally: [],
          src: asyncNothing,
          then: [
            { actions: [], guards: [], in: [], target: ['/success'] },
          ],
        },
      ],
      [
        'Complex 1',
        [
          {
            src: { name: 'promise1', description: 'A promise' },
            description: 'A promise',
            id: 'promise1',
            catch: '/error',
            then: '/success',
          },
          false,
        ],
        {
          catch: [
            {
              actions: [],
              guards: [],
              in: [],
              target: ['/error'],
            },
          ],
          id: 'promise1',
          description: 'A promise',
          finally: [],
          src: options.promises.promise1,
          then: [
            { actions: [], guards: [], in: [], target: ['/success'] },
          ],
        },
      ],
    );
  });
});
