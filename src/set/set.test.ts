import { describe, test, expect } from "vitest";
import { seq } from "../sequence";
import { set } from "./set";
import { assertEquals } from "../equality/assertion.test";
import { JSONEncodable } from "../codable";
import { Comparable } from "../compare";
import { none, Optional, some } from "../optional";
import { Hashable } from "../hash";

describe("Set Tests", () => {
  test("Iterable", () => {
    const s = set([4, 1, 3, 2]);
    let actual = seq<number>();
    for (const element of s) {
      actual = actual.append(element);
    }
    expect(actual.sorted()).toEqual(seq([1, 2, 3, 4]));
  });

  test("集合の要素が合致してた場合、equalsがtrueを返す", () => {
    const s1 = set([4, 2, 3, 2, 1]);
    const s2 = set([3, 3, 1, 2, 4]);
    assertEquals(s1, s2);
  });

  test("countで要素数を取得できる", () => {
    const s = set([1, 2, 3]);
    expect(s.count).toBe(3);
  });

  test("要素空がない場合、isEmptyがfalseを返す", () => {
    expect(set([1]).isEmpty).toBeFalsy();
  });

  test("要素が空の場合isEmptyがtrueを返す", () => {
    expect(set([]).isEmpty).toBeTruthy();
  });

  test("要素空がない場合、nonEmptyがtrueを返す", () => {
    expect(set([1]).nonEmpty).toBeTruthy();
  });

  test("要素が空の場合nonEmptyがfalseを返す", () => {
    expect(set([]).nonEmpty).toBeFalsy();
  });

  test("insert値を追加できる", () => {
    const s = set<number>([1, 2, 3]);
    const expected = set([1, 2, 3, 4]);
    const actual = s.insert(4);
    assertEquals(actual, expected);
  });

  test("既存の値をinsertすると上書きされる", () => {
    class E extends Hashable<E> {
      constructor(readonly key: string, readonly value: number) {
        super();
      }
      get properties() {
        return [this.key];
      }
    }
    const s = set([new E("a", 1), new E("b", 2)]);
    const expected = set([new E("a", 1), new E("b", 3)]);
    const actual = s.insert(new E("b", 3));
    assertEquals(actual, expected);
  });

  test("mapで値を変換できる", () => {
    const s = set([1, 2, 3]);
    const expected = set([2, 4, 6]);
    const actual = s.map((n) => n * 2);
    assertEquals(actual, expected);
  });

  test("flatMapで値を変換して平らにできる", () => {
    const sequence = set([1, 2, 3]);
    const expected = set([1, 11, 2, 12, 3, 13]);
    const actual = sequence.flatMap((n) => set([n, n + 10]));
    assertEquals(actual, expected);
  });

  test("compactMapでnone値を除外して変換できる", () => {
    const s = set<Optional<number>>(some(1), some(2), none(), some(4));
    const expected = set(3, 6, 12);
    const actual = s.compactMap<number, number>((n) => n * 3);
    assertEquals(actual, expected);
  });

  test("filter", () => {
    const s = set([1, 2, 3]);
    const expected = set([1, 3]);
    const actual = s.filter((n) => n % 2 === 1);
    assertEquals(actual, expected);
  });

  test("reduce", () => {
    const s = set([1, 2, 3]);
    const expected = 6;
    const actual = s.reduce(0, (acc, n) => acc + n);
    expect(actual).toBe(expected);
  });

  test("全ての要素がtrueのときにeveryがtrueを返す", () => {
    const s = set([1, 2, 3]);
    const actual = s.every((n) => n > 0);
    expect(actual).toBeTruthy();
  });

  test("どれか一つの要素がfalseのときにeveryがfalseを返す", () => {
    const s = set([1, -1, 3]);
    const actual = s.every((n) => n > 0);
    expect(actual).toBeFalsy();
  });

  test("どれか1つの要素がtrueのときにsomeがtrueを返す", () => {
    const s = set([-1, 2, 3]);
    const actual = s.some((n) => n < 0);
    expect(actual).toBeTruthy();
  });

  test("どれか一つの要素がfalseのときにsomeがfalseを返す", () => {
    const s = set([1, 2, 3]);
    const actual = s.some((n) => n < 0);
    expect(actual).toBeFalsy();
  });

  test("numberでsortが可能", () => {
    const s = set([2, 1, 3]);
    const expected = seq([1, 2, 3]);
    const actual = s.sorted();
    assertEquals(actual, expected);
  });

  test("引数でsortが可能", () => {
    const s = set([2, 1, 3]);
    const expected = seq([3, 2, 1]);
    const actual = s.sorted((a, b) => a > b);
    assertEquals(actual, expected);
  });

  class N extends JSONEncodable<N> implements Comparable<N> {
    constructor(readonly value: number) {
      super();
    }
    compare(compared: N): boolean {
      return this.value < compared.value;
    }
  }
  test("Comparable Objectでsortが可能", () => {
    const s = set([new N(2), new N(1), new N(3)]);
    const expected = seq([new N(1), new N(2), new N(3)]);
    const actual = s.sorted();
    assertEquals(actual, expected);
  });

  test("maxを取得できる", () => {
    const s = set([new N(2), new N(1), new N(3)]);
    const expected = some(new N(3));
    const actual = s.max();
    assertEquals(actual, expected);
  });

  test("minを取得できる", () => {
    const s = set([new N(2), new N(1), new N(3)]);
    const expected = some(new N(1));
    const actual = s.min();
    assertEquals(actual, expected);
  });

  test("含むかを確認できる", () => {
    const s = set([new N(1), new N(2), new N(3)]);
    expect(s.contains(new N(2))).toBeTruthy();
    expect(s.contains(new N(4))).toBeFalsy();
  });

  test("findで検索できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = some(2);
    const actual = sequence.find((n) => n === 2);
    assertEquals(actual, expected);
  });

  test("encodableに準拠", () => {
    const sequence = set([1, 2, 3]);
    const expected = [1, 3, 2];
    const actual = sequence.json;
    expect(actual).toEqual(expected);
  });

  test("intersectionで交差している要素のみを抽出する", () => {
    const s1 = set<number>([1, 2, 3]);
    assertEquals(s1.intersection([2, 3, 4]), set([2, 3]));
  });

  test("unionで和集合を取得する", () => {
    const s1 = set<number>([1, 2, 3]);
    assertEquals(s1.union([2, 3, 4]), set([1, 2, 3, 4]));
  });

  test("isSubsetで、引数が部分集合の場合にtrueを返す", () => {
    const s1 = set<number>([1, 2, 3]);
    expect(s1.isSubset([2, 3])).toBeTruthy();
  });

  test("isSubsetで、引数が部分集合出ない場合にfalseを返す", () => {
    const s1 = set<number>([1, 2, 3]);
    expect(s1.isSubset([2, 3, 4])).toBeFalsy();
  });

  test("exceptで差集合を返される", () => {
    const s1 = set<number>([1, 2, 3, 4, 5]);
    assertEquals(s1.except([2, 3]), set([1, 4, 5]));
  });
});
