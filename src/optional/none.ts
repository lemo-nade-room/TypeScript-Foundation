import { Optional } from "./optional";
import { Failure, failure } from "../result/failure";

export class None<T> implements Optional<T> {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static readonly instance = new None();

  get get(): T {
    throw new Error("none to get");
  }

  readonly value: T | null = null;

  getOrElse(defaultValue: T): T {
    return defaultValue;
  }

  orElse(defaultValue: Optional<T>): Optional<T> {
    return defaultValue;
  }

  readonly isDefined = false;

  readonly isEmpty = true;

  map<U>(f: (value: T) => U): Optional<U> {
    return none();
  }

  flatMap<U>(f: (value: T) => Optional<U>): Optional<U> {
    return none();
  }

  equals(compared: Optional<T>): boolean {
    return compared.isEmpty;
  }

  fold<U>(left: () => U, right: (value: T) => U): U {
    return left();
  }

  unwrap(or: Error): T {
    throw or;
  }

  toResult<E>(error: E): Failure<T, E> {
    return failure(error);
  }
}

export function none<T>(): None<T> {
  return None.instance as None<T>;
}
