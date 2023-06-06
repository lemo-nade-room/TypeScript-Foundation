import { describe, test, expect } from "vitest";
import { none } from "./none";
import { some } from "./some";
import { failure } from "../result";

describe("None Tests", () => {
  test("getでErrorを投げる", () => {
    const option = none();
    expect(() => option.get).toThrowError("none to get");
  });

  test("valueでnullを返す", () => {
    const option = none();
    expect(option.value).toBeNull();
  });

  test("getOrElseで引数の値が返される", () => {
    const option = none();
    expect(option.getOrElse("world")).toBe("world");
  });

  test("orElseで引数の値が返される", () => {
    const option = none();
    expect(option.orElse(some("world"))).toEqual(some("world"));
  });

  test("isDefinedはfalse", () => {
    const option = none();
    expect(option.isDefined).toBeFalsy();
  });

  test("isEmptyはtrue", () => {
    const option = none();
    expect(option.isEmpty).toBeTruthy();
  });

  test("mapでnoneを返す", () => {
    const option = none<number>();
    expect(option.map((value) => value * 2)).toEqual(none());
  });

  test("flatMapでnoneを返す", () => {
    const option = none<number>();
    expect(option.flatMap((value) => some(value * 2))).toEqual(none());
  });

  test("none同士でequalsで比較するとtrueを返す", () => {
    const option1 = none<number>();
    const option2 = none<number>();
    expect(option1.equals(option2)).toBeTruthy();
  });

  test("noneとsomeでequalsで比較するとfalseを返す", () => {
    const option1 = none<number>();
    const option2 = some(10);
    expect(option1.equals(option2)).toBeFalsy();
  });

  test("foldでnoneの場合は第一引数の関数が実行される", () => {
    const option = none<number>();
    expect(
      option.fold(
        () => "none",
        (_) => "some"
      )
    ).toBe("none");
  });

  test("unwrapでErrorが投げられる", () => {
    const option = none<number>();
    expect(() => option.unwrap(new Error("Error"))).toThrowError("Error");
  });

  test("toResultでfailureに変換する", () => {
    const option = none();
    expect(option.toResult(new Error("error"))).toEqual(
      failure(new Error("error"))
    );
  });

  test("decodeはnoneを返す", () => {
    const option = none();
    expect(option.decode({})).toEqual(none());
  });

  test("encodeするとnullを返す", () => {
    expect(none().encode).toBeNull();
  });

  test("encodeするとnullを返す", () => {
    expect(none().encode).toBeNull();
  });

  test("compareはtrueを返す", () => {
    const option = none();
    expect(option.compare(none())).toBeTruthy();
  });
});
