import { Either } from "./either";
import { some, Some } from "../optional";
import { equals } from "../equality";
import { isClonable } from "../clone";

export class Success<F, S> implements Either<F, S> {
  constructor(private readonly value: S) {}

  readonly isSuccess = true;

  readonly isFailure = false;

  get get(): S {
    return this.value;
  }

  get getError(): F {
    throw new Error("success to getError");
  }

  map<U>(f: (value: S) => U): Either<F, U> {
    return success(f(this.value));
  }

  flatMap<U>(f: (value: S) => Either<F, U>): Either<F, U> {
    return f(this.value);
  }

  mapError<U>(_: (error: F) => U): Either<U, S> {
    return this as unknown as Either<U, S>;
  }

  flatMapError<U>(_: (error: F) => Either<U, S>): Either<U, S> {
    return this as unknown as Either<U, S>;
  }

  equals(
    compared: Either<F, S>,
    comparisonFunc?: (a: S, b: S) => boolean,
    _?: (a: F, b: F) => boolean
  ): boolean {
    if (compared.isFailure) return false;
    if (comparisonFunc === undefined) {
      return equals(this.value, compared.get);
    }
    return comparisonFunc(this.value, compared.get);
  }

  get toOptional(): Some<S> {
    return some(this.value);
  }

  get clone(): Either<F, S> {
    if (isClonable(this.value)) {
      return success(this.value.clone as S);
    }
    if (typeof this.value === "object") {
      return success(Object.create(this.value) as S);
    }
    return success(this.value);
  }
}

export function success<F, S>(value: S): Success<F, S> {
  return new Success(value);
}
