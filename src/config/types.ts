import type { SingleOrArrayR } from '~types';
import type {
  ChildrenM,
  StateNodeConfigAtomic,
  StateNodeConfigCompound,
  StateNodeConfigParallel,
} from '../states/types';

export type Config = (
  | StateNodeConfigCompound
  | StateNodeConfigParallel
  | StateNodeConfigAtomic
) & {
  machines?: SingleOrArrayR<ChildrenM>;
};
