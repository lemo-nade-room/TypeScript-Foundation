import { IEquatableObject, equals } from "../equality";
import { clone, IClonable } from "../clone";
import { isOptional, none, Optional, optional } from "../optional";
import * as crypto from "crypto";
import { ClosedRange, OpenRange, Range } from "../range";
import { compare } from "../compare";
import { encode, IDecodable, IEncodable, isDecodable } from "../codable";

export class Sequence<T>
  implements
    IEquatableObject<Sequence<T>>,
    IClonable<Sequence<T>>,
    IterableIterator<T>,
    IEncodable,
    IDecodable<Sequence<T>>
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

  remove(at: number): Sequence<T> {
    return new Sequence([
      ...this.values.slice(0, at),
      ...this.values.slice(at + 1),
    ]);
  }

  /** 文字列の配列を結合する */
  join(separator: string): string {
    return this.values.join(separator);
  }

  /** 要素を変換する */
  map<U>(
    f: (value: T, index: number, sequence: Sequence<T>) => U
  ): Sequence<U> {
    return new Sequence(this.values.map((v, i, arr) => f(v, i, seq(arr))));
  }

  /** 要素をフラットに変換する */
  flatMap<U>(
    f: (value: T, index: number, sequence: Sequence<T>) => Sequence<U>
  ): Sequence<U> {
    return new Sequence(
      this.values.flatMap((v, i, arr) => f(v, i, seq(arr)).toArray)
    );
  }

  /** unwrapしてsomeのみでmapを行う */
  compactMap<Option, TO>(
    f: (value: Option, index: number, sequence: Sequence<Option>) => TO
  ): Sequence<TO> {
    return this.filter((option) => isOptional<TO>(option) && option.isDefined)
      .map((option) => (option as Optional<Option>).get)
      .map((v, i, sequence) => f(v, i, sequence));
  }

  /** 要素をフィルタリングする */
  filter(
    f: (value: T, index: number, sequence: Sequence<T>) => boolean
  ): Sequence<T> {
    return new Sequence(this.values.filter((v, i, arr) => f(v, i, seq(arr))));
  }

  /** 連結する */
  concat(elements: Sequence<T>): Sequence<T> {
    return new Sequence(this.values.concat(elements.values));
  }

  /** 全ての要素が条件を満たす際にtrueを返す */
  every(f: (value: T, index: number, array: Sequence<T>) => boolean): boolean {
    return this.values.every((value, index, array) =>
      f(value, index, seq(array))
    );
  }

  /** どれかの要素が条件を満たす際にtrueを返す */
  some(f: (value: T, index: number, array: Sequence<T>) => boolean): boolean {
    return this.values.some((value, index, array) =>
      f(value, index, seq(array))
    );
  }

  /** ソートする。元のSequenceに影響はない */
  sorted(sorter?: (a: T, b: T) => boolean): Sequence<T> {
    const result = this.clone.values.slice().sort((a, b) => {
      if (sorter == null) {
        if (equals(a, b)) return 0;
        return compare(a, b) ? -1 : 1;
      }
      return sorter(a, b) ? -1 : 1;
    });
    return new Sequence(result);
  }

  /** 最大値を取得する */
  max(sorter?: (a: T, b: T) => boolean): Optional<T> {
    return this.sorted(sorter).last;
  }

  /** 最小値を取得する */
  min(sorter?: (a: T, b: T) => boolean): Optional<T> {
    return this.sorted(sorter).first;
  }

  /** 検索する */
  find(
    f: (value: T, index: number, array: Sequence<T>) => boolean
  ): Optional<T> {
    return optional(
      this.values.find((value, index, array) => f(value, index, seq(array)))
    );
  }

  /** index付きのSequenceを返す */
  get enumerated(): Sequence<{ index: number; value: T }> {
    return this.map((value, index) => ({ index, value }));
  }

  /** 要素を逆順に並び替えたものを返す */
  get reversed(): Sequence<T> {
    return this.reduce(seq(), (reverse, element) => {
      return reverse.insert(element, 0);
    });
  }

  /** 要素が存在するか判別する */
  contains(element: T): boolean {
    return this.some((value) => equals(value, element));
  }

  firstIndex(of: T): Optional<number> {
    return this.enumerated
      .find(({ value }) => equals(value, of))
      .map((value) => value.index);
  }

  /** 要素をランダムに並び替えたものを返す */
  get shuffled(): Sequence<T> {
    let result = seq<T>();
    let sequence = this.clone;
    while (sequence.nonEmpty) {
      const random = sequence.enumerated.randomElement().get;
      sequence = sequence.remove(random.index);
      result = result.append(random.value);
    }
    return result;
  }

  /** 範囲の要素を置き換える */
  replaceSubrange(
    subrange: Range<number> | ClosedRange<number> | OpenRange<number>,
    withNewElements: readonly T[] | Sequence<T>
  ): Sequence<T> {
    const elements = seq(withNewElements);
    if (subrange instanceof OpenRange) {
      return new Sequence([
        ...this.values.slice(0, subrange.minimum),
        ...elements.values,
        ...this.values.slice(subrange.minimum + elements.count),
      ]);
    }
    if (subrange instanceof Range) {
      return new Sequence([
        ...this.values.slice(0, subrange.minimum),
        ...elements.values,
        ...this.values.slice(subrange.maximum),
      ]);
    }
    if (subrange instanceof ClosedRange) {
      return new Sequence([
        ...this.values.slice(0, subrange.minimum),
        ...elements.values,
        ...this.values.slice(subrange.maximum + 1),
      ]);
    }
    return this;
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

  get distinct(): Sequence<T> {
    return this.reduce(seq(), (result, element) => {
      if (result.contains(element)) return result;
      return result.append(element);
    });
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this.values[Symbol.iterator]();
  }

  next(): IteratorResult<T> {
    return this.values[Symbol.iterator]().next();
  }

  get encode(): unknown {
    return this.values.map(encode);
  }

  decode(object: unknown): Sequence<T> {
    if (this.isEmpty) {
      throw new Error("empty sequence cannot decode");
    }
    if (!Array.isArray(object)) {
      throw new Error("not array");
    }
    if (!isDecodable(this.get(0))) {
      return seq(object as readonly T[]);
    }
    return seq(object).reduce(seq(), (result, element) => {
      return result.append((this.get(0) as IDecodable<T>).decode(element));
    });
  }

  get toArray(): readonly T[] {
    return this.values;
  }
}

export function seq<T>(array: readonly T[] | Sequence<T>): Sequence<T>;
export function seq<T>(...elements: readonly T[]): Sequence<T>;
export function seq<T>(
  ...elements: readonly T[] | readonly T[][] | readonly Sequence<T>[]
): Sequence<T> {
  if (elements.length === 1) {
    if (Array.isArray(elements[0])) {
      // array: readonly T[]
      return new Sequence<T>(elements[0] as readonly T[]);
    }
    if (elements[0] instanceof Sequence) {
      // sequence: Sequence<T>
      return elements[0] as Sequence<T>;
    }
  }
  return new Sequence<T>(elements as readonly T[]);
}
