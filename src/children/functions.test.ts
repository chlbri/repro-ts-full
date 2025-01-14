import { createTests } from '@bemedev/vitest-extended';
import { ERRORS } from '~constants';
import { options } from '~fixtures';
import { DEFAULT_MACHINE } from '~machine';
import { toMachineTest } from './functions.fixtures';

describe('#1 => toMachine', () => {
  describe('#1 => Errors', () => {
    test('#1 => Throw : "No params"', () => {
      const child = () => toMachineTest();
      expect(child).toThrowError(ERRORS.machine.notDefined.error);
    });

    test('#2 => Throw : "Action is not described"', () => {
      const child = () =>
        toMachineTest({ name: 'notDescribed', description: 'A machine' });
      expect(child).toThrowError(ERRORS.machine.notDescribed.error);
    });
  });

  describe('#2 => To nothing', () => {
    const machine = DEFAULT_MACHINE;

    test('#2 =>', () => {
      const child = toMachineTest(
        { name: 'notDescribed', description: 'A machine' },
        false,
      );

      expect(child).toEqual({
        machine,
        name: 'notDescribed',
      });
    });
  });

  describe('#3 => Running', () => {
    const useTests = createTests(toMachineTest);

    useTests(
      [
        'String: child1',
        [{ name: 'child1' }],
        {
          machine: options.children.child1,
          name: 'child1',
        },
      ],
      [
        'String: child3',
        [{ name: 'child3' }],
        {
          machine: options.children.child3,
          name: 'child3',
        },
      ],
      [
        'Object: child4',
        [
          {
            description: 'A machine',
            name: 'child4',
          },
        ],
        {
          machine: options.children.child4,
          name: 'child4',
        },
      ],
      [
        'Object with ID: child2',
        [
          {
            description: 'A machine',
            name: 'child2',
          },
        ],
        {
          machine: options.children.child2,
          name: 'child2',
        },
      ],
    );
  });
});
