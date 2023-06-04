import { Result } from "./result";
import { some, Some } from "../optional";

export class Success<T, E> implements Result<T, E> {
  constructor(private readonly value: T) {}

  readonly isSuccess = true;

  readonly isFailure = false;

  get get(): T {
    return this.value;
  }

  get getError(): E {
    throw new Error("success to getError");
  }

  map<U>(f: (value: T) => U): Result<U, E> {
    return success(f(this.value));
  }

  flatMap<U>(f: (value: T) => Result<U, E>): Result<U, E> {
    return f(this.value);
  }

  mapError<U>(_: (error: E) => U): Result<T, U> {
    return this as unknown as Result<T, U>;
  }

  flatMapError<U>(_: (error: E) => Result<T, U>): Result<T, U> {
    return this as unknown as Result<T, U>;
  }

  equals(
    compared: Result<T, E>,
    comparisonFunc?: (a: T, b: T) => boolean,
    _?: (a: E, b: E) => boolean
  ): boolean {
    if (compared.isFailure) return false;
    if (comparisonFunc === undefined) {
      return this.value === compared.get;
    }
    return comparisonFunc(this.value, compared.get);
  }

  get toOptional(): Some<T> {
    return some(this.value);
  }
}

export function success<T, E>(value: T): Success<T, E> {
  return new Success(value);
}
