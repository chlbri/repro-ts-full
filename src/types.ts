import type { SingleOrArray } from '@bemedev/boolean-recursive';
import type {
  Fn,
  NotUndefined,
  Primitive,
  TuplifyUnion,
  ValuesOf,
} from '@bemedev/types';
import type { EventObject } from './config/events';
import { checkKeys } from './utils';

export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value);
}

export type SingleOrArrayR<T> = T | readonly T[];
export type SingleOrArrayL<T> = T | readonly [...(readonly T[]), T];

const DESCRIBER_KEYS = ['name', 'description'] as const;

export type Describer = Readonly<
  Record<(typeof DESCRIBER_KEYS)[number], string>
>;

export function isFunction(value: any): value is (...args: any) => any {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function isDescriber(arg: any): arg is Describer {
  const out = checkKeys(arg, ...DESCRIBER_KEYS);
  return out;
}

export type ExtractLargeKeys<T> = string extends T
  ? never
  : number extends T
    ? never
    : symbol extends T
      ? never
      : T;

type _Simplify<T> = T extends { new: any }
  ? T
  : T extends Fn
    ? Fn<SimplifyArray<Parameters<T>>, ReturnType<T>>
    : T extends object
      ? {
          [P in keyof T as ExtractLargeKeys<P>]: T[P] extends object
            ? Simplify<T[P]>
            : T[P];
        }
      : T;

export type Simplify<T, S = unknown> = Extract<_Simplify<T>, S>;

export type IdxOf<T extends any[]> = Exclude<keyof T, keyof any[]>;

export type _SimplifyArray<T extends any[]> = {
  [K in IdxOf<T>]: Simplify<T[K]>;
};

export type SimplifyArray<T extends any[]> = TuplifyUnion<
  ValuesOf<_SimplifyArray<T>>
>;

export type NotReadonly<T> = {
  -readonly [P in keyof T]: T[P];
};

export type NotR<T> = NotReadonly<T>;

export type Expr<
  TContext extends object = object,
  TEvents extends EventObject = EventObject,
  T = any,
> = Fn<[TContext, TEvents], T>;

export type Define<T, U> = T extends undefined
  ? U
  : undefined extends T
    ? NotUndefined<T>
    : T;

interface PrimitiveObjectMap {
  [key: string]: SingleOrArray<PrimitiveObject>;
}

export type PrimitiveObject = Primitive | PrimitiveObjectMap;
