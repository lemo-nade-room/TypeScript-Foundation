import { Result } from "./result";
import { none, None } from "../optional";
import { equals } from "../equality";
import { isClonable } from "../clone";

export class Failure<T, E> implements Result<T, E> {
  constructor(private readonly error: E) {}

  readonly isSuccess = false;

  readonly isFailure = true;

  get get(): T {
    throw new Error("failure to get");
  }

  get getError(): E {
    return this.error;
  }

  map<U>(_: (v: T) => U): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  flatMap<U>(_: (v: T) => Result<U, E>): Result<U, E> {
    return this as unknown as Result<U, E>;
  }

  mapError<U>(f: (error: E) => U): Result<T, U> {
    return failure(f(this.error));
  }

  flatMapError<U>(f: (error: E) => Result<T, U>): Result<T, U> {
    return f(this.error);
  }

  equals(
    compared: Result<T, E>,
    _?: (a: T, b: T) => boolean,
    comparisonFunc?: (a: E, b: E) => boolean
  ): boolean {
    if (compared.isSuccess) return false;
    if (comparisonFunc === undefined) {
      return equals(this.error, compared.getError);
    }
    return comparisonFunc(this.error, compared.getError);
  }

  get toOptional(): None<T> {
    return none();
  }

  get clone(): Failure<T, E> {
    if (isClonable(this.error)) {
      return failure(this.error.clone as E);
    }
    if (typeof this.error === "object") {
      return failure(Object.create(this.error) as E);
    }
    return failure(this.error);
  }
}

export function failure<T, E>(error: E): Failure<T, E> {
  return new Failure(error);
}
