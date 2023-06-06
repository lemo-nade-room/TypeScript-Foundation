import { IEquatableObject, IEquatable } from "../equality";
import { IDecodable, IEncodable } from "../codable";
import { IClonable } from "../clone";
import { seq, Sequence } from "../sequence";

export class Set<Element extends IEquatable>
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

  readonly encode: unknown;

  get clone(): Set<Element> {
    return new Set(this.seq.clone);
  }

  [Symbol.iterator](): IterableIterator<Element> {
    return this.seq[Symbol.iterator]();
  }

  next(): IteratorResult<Element> {
    return this.seq[Symbol.iterator]().next();
  }

  decode(object: unknown): Set<Element> {
    return set(this.seq.decode(object));
  }

  equals(other: Set<Element>): boolean {
    return this.seq.equals(other.seq);
  }
}

export function set<Element extends IEquatable>(
  sequence: readonly Element[] | Sequence<Element> | Set<Element>
): Set<Element>;
export function set<Element extends IEquatable>(
  ...elements: readonly Element[]
): Set<Element>;
export function set<Element extends IEquatable>(): Set<Element>;
export function set<Element extends IEquatable>(
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
