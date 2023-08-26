import { None, none } from "./none";
import { Some, some } from "./some";
import { Either } from "../";
import { IEquatableObject } from "../equality";
import { IClonable } from "../clone";
import { IJSONEncodable } from "../codable";
import { Comparable } from "../compare";
import { IHashableObject } from "../hash";

export interface OptionalAble<T>
  extends IEquatableObject<Optional<T> | T>,
    IHashableObject<Optional<T>>,
    IClonable<Optional<T>>,
    Comparable<Optional<T>>,
    IJSONEncodable {
  /** 値が存在しない場合はErrorを投げる */
  get get(): T;

  /** 値を返す */
  get value(): T | null;

  /** 値が存在しない場合は引数の値を返す */
  getOrElse(defaultValue: T): T;

  /** 値が存在しない場合は引数の値を返す */
  orElse(defaultValue: Optional<T>): Optional<T>;

  /** 値が存在するかどうか */
  isDefined: boolean;

  /** 値が存在しないかどうか */
  isEmpty: boolean;

  map<U>(f: (value: T) => U): Optional<U>;

  flatMap<U>(f: (value: T) => Optional<U>): Optional<U>;

  equals(
    compared: Optional<T> | T,
    comparisonFunc?: (a: T, b: T) => boolean
  ): boolean;

  fold<U>(left: () => U, right: (value: T) => U): U;

  unwrap(or: Error): T;

  toEither<E>(err: E): Either<E, T>;
}

export type Optional<T> = Some<T> | None<T>;

export function optional<T>(
  value: T | null | undefined | None<T>
): Optional<T> {
  if (value == null || value instanceof None) return none();
  return some(value);
}

export function isOptional<T>(value: unknown): value is Optional<T> {
  if (typeof value !== "object") return false;
  if (value == null) return false;
  if (value === none()) return true;
  return value instanceof Some;
}
