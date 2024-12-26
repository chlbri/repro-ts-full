import type { SingleOrArray } from '@bemedev/boolean-recursive';
import type {
  DeepPartial,
  Fn,
  NOmit,
  NotUndefined,
  Primitive,
  TuplifyUnion,
  UnionToIntersection,
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

export type DeUnionize<T> = T extends any ? T : never;

type DefaultReturnPrams<T> = {
  _return?: T;
  error: Error;
  _default: {
    bool?: boolean;
    value: T;
  };
};

export type DefaultReturn = <T>(params: DefaultReturnPrams<T>) => T;

type PropertyToChange<T extends object> = [keyof T, string];
type PtC<T extends object> = PropertyToChange<T>;

type ChangePropertyOption =
  | 'readonly'
  | 'readonly_undefined'
  | 'normal'
  | 'undefined';

export type ChangeProperty<
  T extends object,
  U extends PtC<T>,
  option extends ChangePropertyOption = 'undefined',
> = U[0] extends infer K1 extends keyof T
  ? NOmit<T, K1> &
      (K1 extends any
        ? U[1] extends infer K2 extends string
          ? option extends 'readonly'
            ? { +readonly [key in K2]: T[K1] }
            : option extends 'readonly_undefined'
              ? { +readonly [key in K2]+?: T[K1] }
              : option extends 'undefined'
                ? { [key in K2]+?: T[K1] }
                : { [key in K2]: T[K1] }
          : never
        : never)
  : never;

export interface StringMap {
  [key: string]: _StringMap;
}

type _StringMap = string | StringMap;

type _KeyStrings<
  T extends object,
  AddObjectKey extends boolean = true,
  Key extends keyof T = keyof T,
> = Key extends string
  ? NotUndefined<T[Key]> extends object
    ? {
        [key in keyof T]: (T[key] extends infer T2 extends object
          ? UnionToIntersection<_KeyStrings<T2, AddObjectKey>>
          : never) &
          (AddObjectKey extends true
            ? { '@my': string }
            : NonNullable<object>);
      }
    : { [key in Key]: string }
  : never;

export type KeyStrings<
  T extends object,
  AddObjectKey extends boolean = true,
  Key extends keyof T = keyof T,
> = UnionToIntersection<_KeyStrings<T, AddObjectKey, Key>>;

export type HighMy = '@my';

export type ChangeProperties<
  T extends object,
  U extends DeepPartial<KeyStrings<T>> = DeepPartial<KeyStrings<T>>,
> =
  DeepPartial<KeyStrings<T>> extends U
    ? T
    : Omit<T, keyof U> & {
        [key in keyof T as key extends keyof U
          ? U[key] extends infer U1
            ? U1 extends { [key in HighMy]: string }
              ? U1[HighMy]
              : U1 extends string
                ? U1
                : key
            : never
          : key]: key extends keyof U
          ? T[key] extends infer T1 extends object
            ? Omit<U[key], HighMy> extends infer U1 extends DeepPartial<
                KeyStrings<T1, true>
              >
              ? ChangeProperties<T1, U1>
              : never
            : T[key]
          : T[key];
      };
