import { none } from "./none";
import { some } from "./some";

export interface Optional<T> {
  /** 値が存在しない場合はErrorを投げる */
  get get(): T;

  /** 値を返す */
  get value(): T | null;

  /** 値が存在しない場合は引数の値を返す */
  getOrElse(defaultValue: T): T;

  /** 値が存在しない場合は引数の値を返す */
  orElse(defaultValue: Optional<T>): Optional<T>;

  /** 値が存在するかどうか */
  get isDefined(): boolean;

  /** 値が存在しないかどうか */
  get isEmpty(): boolean;

  map<U>(f: (value: T) => U): Optional<U>;

  flatMap<U>(f: (value: T) => Optional<U>): Optional<U>;

  equals(compared: Optional<T>): boolean;

  fold<U>(left: () => U, right: (value: T) => U): U;

  unwrap(or: Error): T;
}

export function optional<T>(value: T | null | undefined): Optional<T> {
  if (value == null) return none();
  return some(value);
}
