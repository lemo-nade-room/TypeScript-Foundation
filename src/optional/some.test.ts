import { describe, test, expect } from "vitest";
import { some } from "./some";
import { none } from "./none";
import { success } from "../";
import { Equatable } from "../equality";
import { Clonable } from "../clone";
import { JSONEncodable } from "../codable";
import { optional } from "./optional";

describe("Some Tests", () => {
  test("getで値を取り出せる", () => {
    const option = some(10);
    expect(option.get).toBe(10);
  });

  test("valueで値を取り出せる", () => {
    const option = some(10);
    expect(option.value).toBe(10);
  });

  test("getOrElseで値を取り出せる", () => {
    const option = some("hello");
    expect(option.getOrElse("world")).toBe("hello");
  });

  test("orElseでインスタンスがそのまま出てくる", () => {
    const option = some("hello");
    expect(option.orElse(some("world"))).toEqual(option);
  });

  test("isDefinedはtrue", () => {
    const option = some("hello");
    expect(option.isDefined).toBeTruthy();
  });

  test("isEmptyはfalse", () => {
    const option = some("hello");
    expect(option.isEmpty).toBeFalsy();
  });

  test("mapで値を変換できる", () => {
    const option = some(10);
    expect(option.map((value) => value * 2)).toEqual(some(20));
  });

  test("flatMapで値を変換できる", () => {
    const option = some(10);
    expect(option.flatMap((value) => some(value * 2))).toEqual(some(20));
  });

  test("flatMapでnoneが帰ってきたらnoneを返す", () => {
    const option = some(10);
    expect(option.flatMap((_) => none())).toEqual(none());
  });

  test("同じ値同士ならequalsでtrueを返す", () => {
    const option1 = some(10);
    const option2 = some(10);
    expect(option1.equals(option2)).toBeTruthy();
  });

  test("optional型でなくてもvalueと同じならequalsでtrueを返す", () => {
    const option1 = some(10);
    const value = 10;
    expect(option1.equals(value)).toBeTruthy();
  });

  test("equatableならばそれで比較する", () => {
    class E extends Equatable<E> {
      constructor(readonly str: string, readonly num: number) {
        super();
      }
    }
    const option1 = some(new E("hello", 10));
    const option2 = some(new E("hello", 10));
    expect(option1.equals(option2)).toBeTruthy();
  });

  test("異なる値同士ならequalsでfalseを返す", () => {
    const option1 = some(10);
    const option2 = some(20);
    expect(option1.equals(option2)).toBeFalsy();
  });

  test("引数に関数が与えられた場合はsome同士ならば関数の戻り値がtrueならばtrueを返す", () => {
    const option1 = some({ num: 3 });
    const option2 = some({ num: 3 });
    expect(option1.equals(option2, (a, b) => a.num === b.num)).toBeTruthy();
  });

  test("引数に関数が与えられた場合はsome同士ならば関数の戻り値がfalseならばfalseを返す", () => {
    const option1 = some({ num: 3 });
    const option2 = some({ num: 3 });
    expect(option1.equals(option2, () => false)).toBeFalsy();
  });

  test("noneと比較するとfalseを返す", () => {
    const option1 = some(10);
    const option2 = none<number>();
    expect(option1.equals(option2)).toBeFalsy();
  });

  test("foldで第一引数の戻り値を返す", () => {
    const option = some(10);
    expect(
      option.fold(
        () => 0,
        (value) => value * 2
      )
    ).toBe(20);
  });

  test("unwrapで値を取り出せる", () => {
    const option = some(10);
    expect(option.unwrap(new Error("Error"))).toBe(10);
  });

  test("toResultでsuccessに変換する", () => {
    const option = some(10);
    expect(option.toEither(new Error("error"))).toEqual(success(10));
  });

  test("cloneでvalueをcloneする", () => {
    class C extends Clonable<C> {
      constructor(public num: number) {
        super();
      }
    }
    const option = some(new C(10));
    const clone = option.clone;
    clone.value.num = 20;
    expect(option.value.num).toBe(10);
  });

  class J extends JSONEncodable<J> {
    constructor(readonly num: number) {
      super();
    }
  }

  test("encodeするとvalueをencodeする", () => {
    const option = some(new J(1000));
    const actual = option.json;
    expect(actual).toEqual({ num: 1000 });
  });

  test("要素で比較できる", () => {
    expect(some(3).compare(some(5))).toBeTruthy();
    expect(some(5).compare(some(3))).toBeFalsy();
  });

  test("noneと比較するとtrueを返す", () => {
    expect(some(3).compare(optional<number>(null))).toBeTruthy();
  });
});
