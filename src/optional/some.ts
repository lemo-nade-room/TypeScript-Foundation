import { Optional } from "./optional";

export class Some<T> implements Optional<T> {
  constructor(readonly value: T) {}

  get get(): T {
    return this.value;
  }

  getOrElse(defaultValue: T): T {
    return this.value;
  }

  orElse(defaultValue: Optional<T>): Optional<T> {
    return this;
  }

  readonly isDefined = true;

  readonly isEmpty = false;

  map<U>(f: (value: T) => U): Optional<U> {
    return new Some(f(this.value));
  }

  flatMap<U>(f: (value: T) => Optional<U>): Optional<U> {
    return f(this.value);
  }

  equals(
    compared: Optional<T>,
    comparisonFunc?: (a: T, b: T) => boolean
  ): boolean {
    if (compared.isEmpty) return false;
    if (comparisonFunc === undefined) {
      return this.value === compared.value;
    }
    return comparisonFunc(this.value, compared.value!);
  }

  fold<U>(left: () => U, right: (value: T) => U): U {
    return right(this.value);
  }

  unwrap(or: Error): T {
    return this.value;
  }
}

export function some<T>(value: T): Some<T> {
  return new Some(value);
}
