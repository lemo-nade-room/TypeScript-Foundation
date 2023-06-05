import { IEquatableObject, equals } from "../equality";
import { clone, IClonable } from "../clone";
import { none, Optional, optional } from "../optional";
import * as crypto from "crypto";
import { ClosedRange, OpenRange, Range } from "../range";

export class Sequence<T>
  implements
    IEquatableObject<Sequence<T>>,
    IClonable<Sequence<T>>,
    IterableIterator<T>
{
  constructor(private readonly values: readonly T[]) {}

  /** 要素が空の場合のみtrueを返す */
  get isEmpty(): boolean {
    return this.count === 0;
  }

  /** 要素が空の場合のみfalseを返す */
  get nonEmpty(): boolean {
    return !this.isEmpty;
  }

  /** 最初の要素を取得する */
  get first(): Optional<T> {
    return optional(this.values[0]);
  }

  /** 最後の要素を取得する */
  get last(): Optional<T> {
    return this.at(-1);
  }

  /** 要素を取り出す */
  get(index: number): T {
    return this.values[index];
  }

  /** 要素を取り出す */
  at(index: number): Optional<T> {
    return optional(this.values.at(index));
  }

  /** 最後尾に値を追加する */
  append(value: T): Sequence<T> {
    return new Sequence([...this.values, value]);
  }

  /** 間に値を挿入する */
  insert(element: T, at: number) {
    return new Sequence([
      ...this.values.slice(0, at),
      element,
      ...this.values.slice(at),
    ]);
  }

  /** 文字列の配列を結合する */
  join(separator: string): string {
    return this.values.join(separator);
  }

  /** 要素を変換する */
  map<U>(f: (value: T) => U): Sequence<U> {
    return new Sequence(this.values.map(f));
  }

  /** 要素をフラットに変換する */
  flatMap<U>(f: (value: T) => Sequence<U>): Sequence<U> {
    return new Sequence(this.values.flatMap((value) => f(value).values));
  }

  /** 要素をフィルタリングする */
  filter(f: (value: T) => boolean): Sequence<T> {
    return new Sequence(this.values.filter(f));
  }

  /** 要素を集約する */
  reduce<U>(
    init: U,
    f: (
      previousValue: U,
      currentValue: T,
      currentIndex: number,
      array: readonly T[]
    ) => U
  ): U {
    return this.values.reduce(f, init);
  }

  /** 指定した範囲を取得する */
  slice(
    range: ClosedRange<number> | Range<number> | OpenRange<number>
  ): Sequence<T> {
    if (range instanceof OpenRange) {
      return new Sequence(this.values.slice(range.minimum));
    }
    if (range instanceof Range) {
      return new Sequence(this.values.slice(range.minimum, range.maximum));
    }
    if (range instanceof ClosedRange) {
      return new Sequence(this.values.slice(range.minimum, range.maximum + 1));
    }
    throw new Error("not Range");
  }

  /** ランダムな要素を取得する。cryptoを使用 */
  randomElement(): Optional<T> {
    if (this.isEmpty) return none();
    return this.at(crypto.randomInt(this.count));
  }

  equals(other: Sequence<T>): boolean {
    if (this.count !== other.count) return false;
    return this.values.every((value, index) =>
      equals(value, other.values[index])
    );
  }

  get clone(): Sequence<T> {
    return new Sequence<T>(this.values.map(clone));
  }

  /** 要素数を返す */
  get count(): number {
    return this.values.length;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values[Symbol.iterator]();
  }

  next(): IteratorResult<T> {
    return this.values[Symbol.iterator]().next();
  }
}

export function seq<T>(array: readonly T[] = []): Sequence<T> {
  return new Sequence<T>(array);
}
