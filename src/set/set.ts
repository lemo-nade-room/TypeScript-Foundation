import { IEquatableObject, IEquatable } from "../equality";
import { IDecodable, IEncodable } from "../codable";
import { IClonable } from "../clone";
import { seq, Sequence } from "../sequence";
import { Optional } from "../optional";
import { IComparable } from "../compare";

export class Set<Element extends IEquatable & IComparable>
  implements
    IEquatableObject<Set<Element>>,
    IClonable<Set<Element>>,
    IEncodable,
    IDecodable<Set<Element>>,
    IterableIterator<Element>
{
  private readonly seq: Sequence<Element>;

  constructor(seq: Sequence<Element>) {
    this.seq = seq.distinct.sorted();
  }

  /** 引数と集合の要素の積集合を返す */
  intersection(
    other: readonly Element[] | Sequence<Element> | Set<Element>
  ): Set<Element> {
    return set(other).filter((v) => this.contains(v));
  }

  /** 引数と集合の要素の和集合を返す */
  union(
    other: readonly Element[] | Sequence<Element> | Set<Element>
  ): Set<Element> {
    return set(this.seq.concat(set(other).seq).distinct);
  }

  /** 引数がこの集合の部分集合であればtrueを返す */
  isSubset(
    other: readonly Element[] | Sequence<Element> | Set<Element>
  ): boolean {
    return set(other).every((v) => this.contains(v));
  }

  except(
    other: readonly Element[] | Sequence<Element> | Set<Element>
  ): Set<Element> {
    return set(this.seq.filter((v) => !set(other).contains(v)));
  }

  /** 集合が空であればtrueを返す */
  get isEmpty(): boolean {
    return this.seq.isEmpty;
  }

  /** 集合が空でなければtrueを返す */
  get nonEmpty(): boolean {
    return this.seq.nonEmpty;
  }

  get clone(): Set<Element> {
    return new Set(this.seq.clone);
  }

  /** 集合の要素数を返す */
  get count(): number {
    return this.seq.count;
  }

  get toSeq(): Sequence<Element> {
    return this.seq;
  }

  /** 集合に加える */
  insert(element: Element): Set<Element> {
    return new Set(this.seq.append(element));
  }

  map<U extends IEquatable & IComparable>(
    f: (v: Element, i: number, set: Set<Element>) => U
  ): Set<U> {
    return new Set(this.seq.map((v, i, seq) => f(v, i, set(seq))));
  }

  flatMap<U extends IEquatable & IComparable>(
    f: (v: Element, i: number, set: Set<Element>) => Set<U>
  ): Set<U> {
    return set(this.seq.flatMap((v, i, seq) => f(v, i, set(seq)).toSeq));
  }

  compactMap<
    OPTION extends IComparable & IEquatable,
    TO extends IEquatable & IComparable
  >(f: (v: OPTION, i: number, set: Set<OPTION>) => TO): Set<TO> {
    return set(
      this.seq.compactMap<OPTION, TO>((v, i, seq) => f(v, i, set(seq)))
    );
  }

  filter(
    f: (v: Element, i: number, set: Set<Element>) => boolean
  ): Set<Element> {
    return new Set(this.seq.filter((v, i, seq) => f(v, i, set(seq))));
  }

  reduce<U>(
    init: U,
    f: (acc: U, v: Element, i: number, set: Set<Element>) => U
  ): U {
    return this.seq.reduce(init, (acc, v, i, seq) => f(acc, v, i, set(seq)));
  }

  every(f: (v: Element, i: number, set: Set<Element>) => boolean): boolean {
    return this.seq.every((v, i, seq) => f(v, i, set(seq)));
  }

  some(f: (v: Element, i: number, set: Set<Element>) => boolean): boolean {
    return this.seq.some((v, i, seq) => f(v, i, set(seq)));
  }

  sorted(comparator?: (a: Element, b: Element) => boolean): Sequence<Element> {
    return this.seq.sorted(comparator);
  }

  max(comparator?: (a: Element, b: Element) => boolean): Optional<Element> {
    return this.seq.max(comparator);
  }

  min(comparator?: (a: Element, b: Element) => boolean): Optional<Element> {
    return this.seq.min(comparator);
  }

  contains(element: Element): boolean {
    return this.seq.contains(element);
  }

  find(
    f: (v: Element, i: number, set: Set<Element>) => boolean
  ): Optional<Element> {
    return this.seq.find((v, i, seq) => f(v, i, set(seq)));
  }

  [Symbol.iterator](): IterableIterator<Element> {
    return this.seq[Symbol.iterator]();
  }

  next(): IteratorResult<Element> {
    return this.seq[Symbol.iterator]().next();
  }

  get encode(): unknown {
    return this.seq.encode;
  }

  decode(object: unknown): Set<Element> {
    return set(this.seq.decode(object));
  }

  equals(other: Set<Element>): boolean {
    return this.seq.equals(other.seq);
  }
}

export function set<Element extends IEquatable & IComparable>(
  sequence: readonly Element[] | Sequence<Element> | Set<Element>
): Set<Element>;
export function set<Element extends IEquatable & IComparable>(
  ...elements: readonly Element[]
): Set<Element>;
export function set<Element extends IEquatable & IComparable>(): Set<Element>;
export function set<Element extends IEquatable & IComparable>(
  ...elements:
    | readonly Element[][]
    | readonly Sequence<Element>[]
    | readonly Set<Element>[]
    | readonly Element[]
): Set<Element> {
  if (elements.length === 0) {
    return new Set<Element>(seq());
  }
  if (elements.length === 1) {
    if (Array.isArray(elements[0])) {
      // array: readonly T[]
      return new Set(seq(elements[0] as readonly Element[]));
    }
    if (elements[0] instanceof Sequence) {
      // sequence: Sequence<T>
      return new Set(elements[0] as Sequence<Element>);
    }
    if (elements[0] instanceof Set) {
      // set: Set<T>
      return elements[0];
    }
  }
  // elements: readonly T[]
  return new Set(seq(elements as readonly Element[]));
}
