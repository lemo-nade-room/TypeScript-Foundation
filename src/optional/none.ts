import { Optional } from "./optional";
import { Failure, failure } from "../";
import { IJSONEncodable } from "../codable";
import { Md5 } from "ts-md5";

export class None<T> implements Optional<T>, IJSONEncodable {
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
    return none<U>();
  }

  flatMap<U>(f: (value: T) => Optional<U>): Optional<U> {
    return none<U>();
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

  toEither<E>(error: E): Failure<E, T> {
    return failure(error);
  }

  get json(): unknown {
    return null;
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
