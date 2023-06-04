import { describe, test, expect } from "vitest";
import { success } from "./success";
import { failure } from "./failure";
import { some } from "../optional";

describe("Success Tests", () => {
  test("getで値を取得できる", () => {
    const result = success(10);
    expect(result.get).toBe(10);
  });

  test("getErrorでエラーを投げる", () => {
    const result = success(10);
    expect(() => result.getError).toThrowError("success to getError");
  });

  test("mapで値を変換できる", () => {
    const result = success(10);
    expect(result.map((n) => `${n * 2}番`)).toEqual(success("20番"));
  });

  test("flatMapで値を変換し平らにできる", () => {
    const result = success(10);
    expect(result.flatMap((n) => success(`${n * 2}番`))).toEqual(
      success("20番")
    );
  });

  test("flatMapで値を変換し戻り値がFailureのときはFailureになる", () => {
    const result = success(10);
    expect(result.flatMap((n) => failure(new Error()))).toEqual(
      failure(new Error())
    );
  });

  test("mapErrorで何も起こらない", () => {
    const result = success<number, Error>(10);
    const expected = success<number, Error>(10);
    const actual = result.mapError(
      (error) => new Error(error.message + "mapError")
    );
    expect(actual).toEqual(expected);
  });

  test("flatMapErrorで何も起こらない", () => {
    const result = success<number, Error>(10);
    const expected = success<number, Error>(10);
    const actual = result.flatMapError((error) =>
      failure(new Error(error.message + "mapError"))
    );
    expect(actual).toEqual(expected);
  });

  test("isSuccessでtrueを返し、isFailureでfalseを返す", () => {
    const result = success(10);
    expect(result.isSuccess).toBeTruthy();
    expect(result.isFailure).toBeFalsy();
  });

  test("equalsでsuccess同士で中身が同じならばtrueを返す", () => {
    const result1 = success(10);
    const result2 = success(10);
    expect(result1.equals(result2)).toBeTruthy();
  });

  test("equalsでsuccess同士で中身が異なればfalseを返す", () => {
    const result1 = success(10);
    const result2 = success(20);
    expect(result1.equals(result2)).toBeFalsy();
  });

  test("equalsでfailureと比較するとfalseを返す", () => {
    const result1 = success<number, number>(10);
    const result2 = failure<number, number>(10);
    expect(result1.equals(result2)).toBeFalsy();
  });

  test("equalsで第二引数に比較関数を渡すと、その関数で比較する", () => {
    const result1 = success(10);
    const result2 = success(20);
    expect(result1.equals(result2, (a, b) => a % 10 === b % 10)).toBeTruthy();
  });

  test("equalsで第二引数に比較関数を渡すと、その関数で比較する", () => {
    const result1 = success(10);
    const result2 = success(10);
    expect(result1.equals(result2, () => false)).toBeFalsy();
  });

  test("toOptionalでSomeを返す", () => {
    const result = success(10);
    expect(result.toOptional).toEqual(some(10));
  });
});
