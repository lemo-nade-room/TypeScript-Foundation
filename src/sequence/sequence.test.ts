import { describe, expect, test } from "vitest";
import { seq } from "./sequence";
import { assertEquals } from "../equality";
import { none, some } from "../optional";
import { from } from "../range";

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
});
