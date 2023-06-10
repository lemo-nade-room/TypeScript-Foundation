import { Result } from "../result";

export class ResultForResult<T, E> {
  constructor(readonly value: Result<T, E>) {}

  yield<U>(f: (value: T) => U): Result<U, E> {
    return this.value.map(f);
  }
}
