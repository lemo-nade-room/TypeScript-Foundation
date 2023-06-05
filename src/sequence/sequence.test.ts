import { describe, expect, test } from "vitest";
import { seq } from "./sequence";
import { assertEquals } from "../equality/assertion.test";
import { none, some } from "../optional";
import { from } from "../range";
import { Comparable } from "../compare";
import { Codable } from "../codable";

describe("Sequence Tests", () => {
  test("getで要素を取得できる", () => {
    const sequence = seq([1, 2, 3]);
    expect(sequence.get(0)).toBe(1);
    expect(sequence.get(1)).toBe(2);
    expect(sequence.get(2)).toBe(3);
  });

  test("atで要素を取得できる", () => {
    const sequence = seq([1, 2, 3]);
    expect(sequence.at(-4)).toEqual(none());
    expect(sequence.at(-3)).toEqual(some(1));
    expect(sequence.at(-2)).toEqual(some(2));
    expect(sequence.at(-1)).toEqual(some(3));
    expect(sequence.at(0)).toEqual(some(1));
    expect(sequence.at(1)).toEqual(some(2));
    expect(sequence.at(2)).toEqual(some(3));
    expect(sequence.at(3)).toEqual(none());
  });

  test("countで要素数を取得できる", () => {
    const sequence = seq([1, 2, 3]);
    expect(sequence.count).toBe(3);
  });

  test("要素空がない場合、isEmptyがfalseを返す", () => {
    expect(seq([1]).isEmpty).toBeFalsy();
  });

  test("要素が空の場合isEmptyがtrueを返す", () => {
    expect(seq([]).isEmpty).toBeTruthy();
  });

  test("要素空がない場合、nonEmptyがtrueを返す", () => {
    expect(seq([1]).nonEmpty).toBeTruthy();
  });

  test("要素が空の場合nonEmptyがfalseを返す", () => {
    expect(seq([]).nonEmpty).toBeFalsy();
  });

  test("firstで最初の要素が取れる", () => {
    const sequence = seq([1, 2, 3]);
    expect(sequence.first).toEqual(some(1));
  });

  test("要素が空のときfirstでnoneが返される", () => {
    const sequence = seq([]);
    expect(sequence.first).toBe(none());
  });

  test("lastで最後の要素が取れる", () => {
    const sequence = seq([1, 2, 3]);
    expect(sequence.last).toEqual(some(3));
  });

  test("要素が空のときlastでnoneが返される", () => {
    const sequence = seq([]);
    expect(sequence.last).toBe(none());
  });

  test("Iterable", () => {
    const sequence = seq(["hello", "my", "world"]);
    const expected = "hellomyworld";
    let actual = "";
    for (const element of sequence) {
      actual += element;
    }
    expect(actual).toBe(expected);
  });

  test("joinで文字列を連結できる", () => {
    const sequence = seq(["hello", "my", "world"]);
    const expected = "hello my world";
    const actual = sequence.join(" ");
    expect(actual).toBe(expected);
  });

  test("appendで値を追加できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 2, 3, 4]);
    const actual = sequence.append(4);
    assertEquals(actual, expected);
  });

  test("insertで間に値を追加できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 2, 2.5, 3]);
    const actual = sequence.insert(2.5, 2);
    assertEquals(actual, expected);
  });

  test("insertで最初に値を追加できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([0.5, 1, 2, 3]);
    const actual = sequence.insert(0.5, 0);
    assertEquals(actual, expected);
  });

  test("insertで最後に値を追加できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 2, 3, 4]);
    const actual = sequence.insert(4, 3);
    assertEquals(actual, expected);
  });

  test("removeで指定した位置の要素を削除できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 3]);
    const actual = sequence.remove(1);
    assertEquals(actual, expected);
  });

  test("mapで値を変換できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([2, 4, 6]);
    const actual = sequence.map((n) => n * 2);
    assertEquals(actual, expected);
  });

  test("flatMapで値を変換して平らにできる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 1, 2, 2, 3, 3]);
    const actual = sequence.flatMap((n) => seq([n, n]));
    assertEquals(actual, expected);
  });

  test("filter", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 3]);
    const actual = sequence.filter((n) => n % 2 === 1);
    assertEquals(actual, expected);
  });

  test("reduce", () => {
    const sequence = seq([1, 2, 3]);
    const expected = 6;
    const actual = sequence.reduce(0, (acc, n) => acc + n);
    expect(actual).toBe(expected);
  });

  test("全ての要素がtrueのときにeveryがtrueを返す", () => {
    const sequence = seq([1, 2, 3]);
    const actual = sequence.every((n) => n > 0);
    expect(actual).toBeTruthy();
  });

  test("どれか一つの要素がfalseのときにeveryがfalseを返す", () => {
    const sequence = seq([1, -1, 3]);
    const actual = sequence.every((n) => n > 0);
    expect(actual).toBeFalsy();
  });

  test("どれか1つの要素がtrueのときにsomeがtrueを返す", () => {
    const sequence = seq([-1, 2, 3]);
    const actual = sequence.some((n) => n < 0);
    expect(actual).toBeTruthy();
  });

  test("どれか一つの要素がfalseのときにsomeがfalseを返す", () => {
    const sequence = seq([1, 2, 3]);
    const actual = sequence.some((n) => n < 0);
    expect(actual).toBeFalsy();
  });

  test("numberでsortが可能", () => {
    const sequence = seq([2, 1, 3]);
    const expected = seq([1, 2, 3]);
    const actual = sequence.sorted();
    assertEquals(actual, expected);
  });

  test("引数でsortが可能", () => {
    const sequence = seq([2, 1, 3]);
    const expected = seq([3, 2, 1]);
    const actual = sequence.sorted((a, b) => a > b);
    assertEquals(actual, expected);
  });

  class N extends Codable<N> implements Comparable<N> {
    constructor(readonly value: number) {
      super();
    }
    compare(compared: N): boolean {
      return this.value < compared.value;
    }
  }
  test("Comparable Objectでsortが可能", () => {
    const sequence = seq([new N(2), new N(1), new N(3)]);
    const expected = seq([new N(1), new N(2), new N(3)]);
    const actual = sequence.sorted();
    assertEquals(actual, expected);
  });

  test("maxを取得できる", () => {
    const sequence = seq([new N(2), new N(1), new N(3)]);
    const expected = some(new N(3));
    const actual = sequence.max();
    assertEquals(actual, expected);
  });

  test("minを取得できる", () => {
    const sequence = seq([new N(2), new N(1), new N(3)]);
    const expected = some(new N(1));
    const actual = sequence.min();
    assertEquals(actual, expected);
  });

  test("含むかを確認できる", () => {
    const sequence = seq([new N(1), new N(2), new N(3)]);
    expect(sequence.contains(new N(2))).toBeTruthy();
    expect(sequence.contains(new N(4))).toBeFalsy();
  });

  test("最初の合致する要素のindexを探す", () => {
    const sequence = seq([new N(1), new N(2), new N(3)]);
    const expected = some(1);
    const actual = sequence.firstIndex(new N(2));
    assertEquals(actual, expected);
  });

  test("findをで検索できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = some(2);
    const actual = sequence.find((n) => n === 2);
    assertEquals(actual, expected);
  });

  test("enumeratedでindex付きのが取得できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([
      { index: 0, value: 1 },
      { index: 1, value: 2 },
      { index: 2, value: 3 },
    ]);
    const actual = sequence.enumerated;
    expect(actual).toEqual(expected);
  });

  test("reversedで逆順に並び替えられる", () => {
    const sequence = seq([1, 2, 3, 4, 5]);
    const expected = seq([5, 4, 3, 2, 1]);
    const actual = sequence.reversed;
    assertEquals(actual, expected);
  });

  test("open rangeでsliceできる", () => {
    const sequence = seq([1, 2, 3, 4, 5]);
    const expected = seq([3, 4, 5]);
    const actual = sequence.slice(from(2));
    assertEquals(actual, expected);
  });

  test("rangeでsliceできる", () => {
    const sequence = seq([1, 2, 3, 4, 5]);
    const expected = seq([3, 4]);
    const actual = sequence.slice(from<number>(2).until(4));
    assertEquals(actual, expected);
  });

  test("closed rangeでsliceできる", () => {
    const sequence = seq([1, 2, 3, 4, 5]);
    const expected = seq([3, 4, 5]);
    const actual = sequence.slice(from<number>(2).to(4));
    assertEquals(actual, expected);
  });

  test("open rangeで入れ替えられる", () => {
    const sequence = seq([1, 2, 7, 4, 5]);
    const expected = seq([1, 2, 100, 101, 5]);

    const openRange = from<number>(2);
    const actual = sequence.replaceSubrange(openRange, [100, 101, 5]);
    assertEquals(actual, expected);
  });

  test("rangeで入れ替えられる", () => {
    const sequence = seq([1, 2, 7, 4, 5]);
    const expected = seq([1, 2, 100, 101, 5]);

    const range = from<number>(2).until(4);
    const actual = sequence.replaceSubrange(range, [100, 101]);
    assertEquals(actual, expected);
  });

  test("closed rangeで入れ替えられる", () => {
    const sequence = seq([1, 2, 7, 4, 5]);
    const expected = seq([1, 2, 100, 101, 5]);

    const closedRange = from<number>(2).to(3);
    const actual = sequence.replaceSubrange(closedRange, [100, 101]);
    assertEquals(actual, expected);
  });

  test("concatで連結できる", () => {
    const sequence = seq([1, 2, 3]);
    const expected = seq([1, 2, 3, 4, 5, 6]);
    const actual = sequence.concat(seq([4, 5, 6]));
    assertEquals(actual, expected);
  });

  test("encodableに準拠", () => {
    const sequence = seq([1, 2, 3]);
    const expected = [1, 2, 3];
    const actual = sequence.encode;
    expect(actual).toEqual(expected);
  });

  test("decodableに準拠", () => {
    const json = [{ value: 3 }, { value: 4 }, { value: 6 }];
    const expected = seq([new N(3), new N(4), new N(6)]);
    const actual = seq([new N(0)]).decode(json);
    expect(actual).toEqual(expected);
  });
});
