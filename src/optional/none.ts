import { Optional } from "./optional";
import { Failure, failure } from "../result";
import { IEncodable, IDecodable } from "../codable";
import { Md5 } from "ts-md5";

export class None<T>
  implements Optional<T>, IEncodable, IDecodable<Optional<T>>
{
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  static readonly instance = new None();

  get get(): T {
    throw new Error("none to get");
  }

  readonly value: T | null = null;

  readonly clone: None<T> = this;

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

  equals(compared: Optional<T> | T, _?: (a: T, b: T) => boolean): boolean {
    return compared === None.instance;
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

  get encode(): unknown {
    return null;
  }

  decode(object: unknown): Optional<T> {
    return none();
  }

  compare(_: Optional<T>): boolean {
    return true;
  }

  get hashValue(): string {
    return Md5.hashStr("none");
  }
}

export function none<T>(): None<T> {
  return None.instance as None<T>;
}
