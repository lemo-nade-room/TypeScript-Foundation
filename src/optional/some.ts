import { Optional, OptionalAble } from "./optional";
import { Either } from "../";
import { success } from "../";
import { equals } from "../equality";
import { None } from "./none";
import { isClonable } from "../clone";
import { compare } from "../compare";
import { isJSONEncodable } from "../codable";
import { Md5 } from "ts-md5";
import { hash } from "../hash";

export class Some<T> implements OptionalAble<T> {
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

  isDefined: true = true;

  isEmpty: false = false;

  map<U>(f: (value: T) => U): Optional<U> {
    return new Some(f(this.value));
  }

  flatMap<U>(f: (value: T) => Optional<U>): Optional<U> {
    return f(this.value);
  }

  equals(
    compared: Optional<T> | T,
    comparisonFunc?: (a: T, b: T) => boolean
  ): boolean {
    if (compared instanceof None) return false;
    if (!(compared instanceof Some)) {
      return equals(this.value, compared);
    }
    if (comparisonFunc === undefined) {
      return equals(this.value, compared.value);
    }
    return comparisonFunc(this.value, compared.value!);
  }

  fold<U>(left: () => U, right: (value: T) => U): U {
    return right(this.value);
  }

  unwrap(_: Error): T {
    return this.value;
  }

  toEither<E>(_: E): Either<E, T> {
    return success(this.value);
  }

  get clone(): Some<T> {
    if (isClonable(this.value)) {
      return some(this.value.clone as T);
    }
    if (typeof this.value === "object") {
      return some(Object.create(this.value));
    }
    return some(this.value);
  }

  get json(): unknown {
    if (isJSONEncodable(this.value)) {
      return this.value.json;
    }
    return this.value;
  }

  compare(compared: Optional<T>): boolean {
    return compared.map((value) => compare(this.value, value)).getOrElse(true);
  }

  get hashValue(): string {
    return Md5.hashStr("some" + hash(this.value));
  }
}

export function some<T>(value: T): Some<T> {
  return new Some(value);
}
