import { Optional } from "../optional";

export class OptionalForResult<T> {
  constructor(readonly value: Optional<T>) {}

  yield<U>(f: (value: T) => U): Optional<U> {
    return this.value.map(f);
  }
}
