import { describe, test, expect } from "vitest";
import { failure } from "./failure";
import { success } from "./success";

describe("Failure Tests", () => {
  test("getでthrowされる", () => {
    const result = failure(new Error("error"));
    expect(() => result.get).toThrowError("failure to get");
  });

  test("getErrorで値を返す", () => {
    const result = failure(new Error("error"));
    expect(result.getError).toEqual(new Error("error"));
  });

  test("mapで何も起こらない", () => {
    const result = failure<number, Error>(new Error("error"));
    const expected = failure<string, Error>(new Error("error"));
    const actual = result.map((n) => `${n}番`);
    expect(actual).toEqual(expected);
  });

  test("flatMapで何も起こらない", () => {
    const result = failure<number, Error>(new Error("error"));
    const expected = failure<string, Error>(new Error("error"));
    const actual = result.flatMap((n) => success(`${n}番`));
    expect(actual).toEqual(expected);
  });

  test("mapErrorで値を変換できる", () => {
    const result = failure(new Error("error"));
    const expected = failure(new Error("error+mapError"));
    const actual = result.mapError(
      (error) => new Error(error.message + "+mapError")
    );
    expect(actual).toEqual(expected);
  });

  test("flatMapErrorで値を変換し、平らにできる", () => {
    const result = failure(new Error("error"));
    const expected = failure(new Error("error+mapError"));
    const actual = result.flatMapError((error) =>
      failure(new Error(error.message + "+mapError"))
    );
    expect(actual).toEqual(expected);
  });

  test("isSuccessでfalseを返し、isFailureでtrueを返す", () => {
    const result = failure(new Error("error"));
    expect(result.isSuccess).toBeFalsy();
    expect(result.isFailure).toBeTruthy();
  });

  test("equalsで同じ値ならばtrueを返す", () => {
    const result1 = failure(10);
    const result2 = failure(10);
    expect(result1.equals(result2)).toBeTruthy();
  });

  test("equalsで異なる値ならばfalseを返す", () => {
    const result1 = failure(10);
    const result2 = failure(20);
    expect(result1.equals(result2)).toBeFalsy();
  });

  test("successと比較するとfalseを返す", () => {
    const result1 = failure<number, number>(10);
    const result2 = success<number, number>(10);
    expect(result1.equals(result2)).toBeFalsy();
  });

  test("equalsで第三引数に比較関数を渡すと、その関数で比較する", () => {
    const result1 = failure(10);
    const result2 = failure(20);
    expect(
      result1.equals(
        result2,
        () => true,
        (a, b) => a % 10 === b % 10
      )
    ).toBeTruthy();
  });

  test("equalsで第三引数に比較関数を渡すと、その関数がfalseを返すならfalseを返す", () => {
    const result1 = failure(10);
    const result2 = failure(20);
    expect(
      result1.equals(
        result2,
        () => true,
        () => false
      )
    ).toBeFalsy();
  });

  test("toOptionalでnoneを返す", () => {
    const result = failure(10);
    expect(result.toOptional.isEmpty).toBeTruthy();
  });
});
