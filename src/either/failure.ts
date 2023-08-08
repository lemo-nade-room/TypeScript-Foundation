import { Either } from "./either";
import { none, None } from "../optional";
import { equals } from "../equality";
import { isClonable } from "../clone";

export class Failure<F, S> implements Either<F, S> {
  constructor(private readonly error: F) {}

  readonly isSuccess = false;

  readonly isFailure = true;

  get get(): S {
    throw new Error("failure to get");
  }

  get getError(): F {
    return this.error;
  }

  map<U>(_: (v: S) => U): Either<F, U> {
    return this as unknown as Either<F, U>;
  }

  flatMap<U>(_: (v: S) => Either<F, U>): Either<F, U> {
    return this as unknown as Either<F, U>;
  }

  mapError<U>(f: (error: F) => U): Either<U, S> {
    return failure<U, S>(f(this.error));
  }

  flatMapError<U>(f: (error: F) => Either<U, S>): Either<U, S> {
    return f(this.error);
  }

  equals(
    compared: Either<F, S>,
    _?: (a: S, b: S) => boolean,
    comparisonFunc?: (a: F, b: F) => boolean
  ): boolean {
    if (compared.isSuccess) return false;
    if (comparisonFunc === undefined) {
      return equals(this.error, compared.getError);
    }
    return comparisonFunc(this.error, compared.getError);
  }

  get toOptional(): None<S> {
    return none();
  }

  get clone(): Failure<F, S> {
    if (isClonable(this.error)) {
      return failure(this.error.clone as F);
    }
    if (typeof this.error === "object") {
      return failure(Object.create(this.error) as F);
    }
    return failure(this.error);
  }
}

export function failure<F, S>(error: F): Failure<F, S> {
  return new Failure(error);
}
