import { describe, test, expect } from "vitest";
import { success } from "./success";
import { failure } from "./failure";
import { some } from "../optional";
import { Equatable } from "../equality";

describe("Success Tests", () => {
  test("getで値を取得できる", () => {
    const either = success(10);
    expect(either.get).toBe(10);
  });

  test("getErrorでエラーを投げる", () => {
    const either = success(10);
    expect(() => either.getError).toThrowError("success to getError");
  });

  test("mapで値を変換できる", () => {
    const either = success(10);
    expect(either.map((n) => `${n * 2}番`)).toEqual(success("20番"));
  });

  test("flatMapで値を変換し平らにできる", () => {
    const either = success(10);
    expect(either.flatMap((n) => success(`${n * 2}番`))).toEqual(
      success("20番")
    );
  });

  test("flatMapで値を変換し戻り値がFailureのときはFailureになる", () => {
    const either = success(10);
    expect(either.flatMap((n) => failure(new Error()))).toEqual(
      failure(new Error())
    );
  });

  test("mapErrorで何も起こらない", () => {
    const either = success<Error, number>(10);
    const expected = success<Error, number>(10);
    const actual = either.mapError(
      (error) => new Error(error.message + "mapError")
    );
    expect(actual).toEqual(expected);
  });

  test("flatMapErrorで何も起こらない", () => {
    const either = success<Error, number>(10);
    const expected = success<Error, number>(10);
    const actual = either.flatMapError((error) =>
      failure(new Error(error.message + "mapError"))
    );
    expect(actual).toEqual(expected);
  });

  test("isSuccessでtrueを返し、isFailureでfalseを返す", () => {
    const either = success(10);
    expect(either.isSuccess).toBeTruthy();
    expect(either.isFailure).toBeFalsy();
  });

  test("equalsでsuccess同士で中身が同じならばtrueを返す", () => {
    const either1 = success(10);
    const either2 = success(10);
    expect(either1.equals(either2)).toBeTruthy();
  });

  test("equalsでsuccess同士で中身が異なればfalseを返す", () => {
    const either1 = success(10);
    const either2 = success(20);
    expect(either1.equals(either2)).toBeFalsy();
  });

  class E extends Equatable<E> {
    constructor(readonly value: number) {
      super();
    }
  }

  test("equalsでsuccess同士でEquatableならばequalsで比較する", () => {
    const either1 = success(new E(10));
    const either2 = success(new E(10));
    expect(either1.equals(either2)).toBeTruthy();
  });

  test("equalsでfailureと比較するとfalseを返す", () => {
    const either1 = success<number, number>(10);
    const either2 = failure<number, number>(10);
    expect(either1.equals(either2)).toBeFalsy();
  });

  test("equalsで第二引数に比較関数を渡すと、その関数で比較する", () => {
    const either1 = success(10);
    const either2 = success(20);
    expect(either1.equals(either2, (a, b) => a % 10 === b % 10)).toBeTruthy();
  });

  test("equalsで第二引数に比較関数を渡すと、その関数で比較する", () => {
    const either1 = success(10);
    const either2 = success(10);
    expect(either1.equals(either2, () => false)).toBeFalsy();
  });

  test("toOptionalでSomeを返す", () => {
    const either = success(10);
    expect(either.toOptional).toEqual(some(10));
  });
});
