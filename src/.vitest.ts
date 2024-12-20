import { aliasTs } from '@bemedev/vitest-alias';
import { exclude } from '@bemedev/vitest-exclude';
import { defineConfig } from 'vitest/config';
import tsconfig from '../tsconfig.json';

const plugins = [
  aliasTs(tsconfig as any),
  exclude({
    ignoreCoverageFiles: [
      '**/index.ts',
      '**/*/types.ts',
      '**/*.typegen.ts',
    ],
  }),
];

const commonTest = {
  bail: 10,
  maxConcurrency: 10,
  passWithNoTests: true,
  slowTestThreshold: 3000,
  globals: true,
  logHeapUsage: true,
  coverage: {
    enabled: true,
    extension: 'ts',
    reportsDirectory: '.coverage',
    all: true,
    provider: 'v8',
  },
} as const;

type ConfigType = 'typecheck' | 'typecheckOnly' | 'noTypeCheck';

export const addConfig = (type: ConfigType) => {
  let typecheck = undefined;
  switch (type) {
    case 'typecheck':
      typecheck = {
        enabled: true,
        only: false,
        ignoreSourceErrors: true,
      };
      break;
    case 'typecheckOnly':
      typecheck = {
        enabled: true,
        only: true,
        ignoreSourceErrors: true,
      };
      break;
  }

  return defineConfig({
    plugins,
    test: {
      ...commonTest,
      typecheck,
    },
  });
};
