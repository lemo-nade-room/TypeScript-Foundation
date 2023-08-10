import { hash, Hashable, IHashable, IHashableObject } from "../hash";
import { IEquatable, equals, IEquatableObject } from "../equality";
import { set, Set } from "../set/set";
import { seq, Sequence } from "../sequence";
import { None, optional, Optional } from "../optional";
import {
  decode,
  JSONEncode,
  IDecodable,
  IJSONEncodable,
  isDecodable,
} from "../codable";
import { clone, IClonable } from "../clone";

export type DictionaryKey = IHashable & IEquatable;

export class Dictionary<K extends DictionaryKey, V>
  implements
    IEquatableObject<Dictionary<K, V>>,
    IHashableObject<Dictionary<K, V>>,
    IClonable<Dictionary<K, V>>,
    IJSONEncodable,
    IDecodable<Dictionary<K, V>>
{
  constructor(private readonly hashKV: Map<string, Set<KV<K, V>>>) {}

  /** 引数のキーに対応する値を返す */
  get(key: K): Optional<V> {
    const hashValue = hash(key);
    const kvSetOpt = optional(this.hashKV.get(hashValue));
    const kvOpt = kvSetOpt.flatMap((kvs) =>
      kvs.find((kv) => equals(kv.key, key))
    );
    return kvOpt.map((kv) => kv.value);
  }

  /** 対応するキーの値を更新する。none系を渡すとキーが削除される */
  put(key: K, value: V | null | undefined | None<V>): Dictionary<K, V> {
    const hashValue = hash(key);
    const copy = this.shallowCopyHashKV;
    const oldKvSet = copy.get(hashValue) ?? set();
    const newKvSet = optional(value).fold(
      () => oldKvSet.filter((kv) => !equals(kv.key, key)),
      (v) => oldKvSet.insert(kv(key, v))
    );
    return new Dictionary<K, V>(copy.set(hashValue, newKvSet));
  }

  private get shallowCopyHashKV(): Map<string, Set<KV<K, V>>> {
    const hashKV = new Map<string, Set<KV<K, V>>>();
    for (const [hash, kvs] of this.hashKV) {
      hashKV.set(hash, kvs.clone);
    }
    return hashKV;
  }

  equals(other: Dictionary<K, V>): boolean {
    return this.allKvSet.equals(other.allKvSet);
  }

  get hashValue(): string {
    return hash("dict" + this.allKvSet.hashValue);
  }

  map<NK extends IEquatable & IHashable, NU>(
    f: (key: K, value: V) => [NK, NU]
  ) {
    const result = this.allKvSeq.map((kv) => f(kv.key, kv.value));
    let next = dict<NK, NU>();
    for (const [key, value] of result) {
      next = next.put(key, value);
    }
    return next;
  }

  filter(f: (key: K, value: V) => boolean): Dictionary<K, V> {
    const result = this.allKvSeq.filter((kv) => f(kv.key, kv.value));
    let next = dict<K, V>();
    for (const kv of result) {
      next = next.put(kv.key, kv.value);
    }
    return next;
  }

  every(f: (key: K, value: V) => boolean): boolean {
    return this.allKvSeq.every((kv) => f(kv.key, kv.value));
  }

  some(f: (key: K, value: V) => boolean): boolean {
    return this.allKvSeq.some((kv) => f(kv.key, kv.value));
  }

  get encode(): Record<string | number, unknown> {
    return this.allKvSeq.reduce(
      {},
      (record: Record<string | number, unknown>, kv) => {
        const encodedKey = JSONEncode(kv.key);
        if (typeof encodedKey === "string" || typeof encodedKey === "number") {
          record[encodedKey] = JSONEncode(kv.value);
          return record;
        }
        return record;
      }
    );
  }

  decode(object: unknown): Dictionary<K, V> {
    if (typeof object !== "object" || object == null) {
      throw new Error(`${object} should be object`);
    }
    if (Array.isArray(object)) {
      throw new Error(`${object} should be object, but it is array`);
    }
    if (this.isEmpty) {
      throw new Error(`${this} is empty Dictionary`);
    }
    const { key, value } = this.allKvSeq.get(0);
    if (
      !(typeof key === "string" || typeof key === "number" || isDecodable(key))
    ) {
      throw new Error("Dictionary key should be string or number or Decodable");
    }
    let dictionary = dict<K, V>();
    for (const jsonKey in object) {
      dictionary = dictionary.put(
        jsonKey as K,
        decode((object as Record<string, V>)[jsonKey], value as any)
      );
    }
    return dictionary;
  }

  get clone(): Dictionary<K, V> {
    let result = dict<K, V>();
    for (const kv of this.allKvSeq) {
      result = result.put(clone(kv.key), clone(kv.value));
    }
    return result;
  }

  get isEmpty(): boolean {
    return this.count === 0;
  }

  get nonEmpty(): boolean {
    return this.count > 0;
  }

  get count(): number {
    return this.allKvSeq.count;
  }

  get keys(): Sequence<K> {
    return this.allKvSeq.map((kv) => kv.key);
  }

  get values(): Sequence<V> {
    return this.allKvSeq.map((kv) => kv.value);
  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.allKvArrays[Symbol.iterator]();
  }

  private get allKvSet(): Set<KV<K, V>> {
    return set(this.allKvSeq);
  }

  private get allKvArrays(): readonly [K, V][] {
    return this.allKvSeq.map((kv) => [kv.key, kv.value] as [K, V]).toArray;
  }

  private get allKvSeq(): Sequence<KV<K, V>> {
    let allKvSeq = seq<KV<K, V>>();
    for (const [_, kvs] of this.hashKV) {
      allKvSeq = allKvSeq.concat(kvs.toSeq);
    }
    return allKvSeq;
  }
}

export class KV<K extends DictionaryKey, V> extends Hashable<KV<K, V>> {
  constructor(readonly key: K, readonly value: V) {
    super();
  }

  get properties(): readonly IEquatable[] {
    return [this.key];
  }
}

export function kv<K extends DictionaryKey, V>(key: K, value: V): KV<K, V> {
  return new KV<K, V>(key, value);
}

export function dict<K extends string | number, V>(
  record: Record<K, V>
): Dictionary<K, V>;
export function dict<K extends DictionaryKey, V>(
  array: readonly KV<K, V>[] | Sequence<KV<K, V>>
): Dictionary<K, V>;
export function dict<K extends DictionaryKey, V>(): Dictionary<K, V>;
export function dict<K extends DictionaryKey, V>(
  array?: readonly KV<K, V>[] | Sequence<KV<K, V>> | Record<string | number, V>
): Dictionary<K, V> {
  if (array == null) return new Dictionary<K, V>(new Map());
  if (Array.isArray(array) || array instanceof Sequence) {
    const sequence: Sequence<KV<K, V>> = seq(array);
    const hashKV = new Map<string, Set<KV<K, V>>>();
    for (const kv of sequence) {
      const hashValue = kv.hashValue;
      const origin = hashKV.get(hashValue) ?? set<KV<K, V>>();
      hashKV.set(hashValue, origin.insert(kv));
    }
    return new Dictionary<K, V>(hashKV);
  }
  const hashKV = new Map<string, Set<KV<K, V>>>();
  for (const key in array) {
    const hashValue = hash(key);
    const origin = hashKV.get(hashValue) ?? set<KV<K, V>>();
    const kv = new KV<K, V>(key as K, array[key] as V);
    hashKV.set(hashValue, origin.insert(kv));
  }
  return new Dictionary<K, V>(hashKV);
}
