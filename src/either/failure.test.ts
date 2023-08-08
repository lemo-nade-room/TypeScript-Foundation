import { describe, test, expect } from "vitest";
import { failure } from "./failure";
import { success } from "./success";
import { Equatable } from "../equality";

describe("Failure Tests", () => {
  test("getでthrowされる", () => {
    const either = failure(new Error("error"));
    expect(() => either.get).toThrowError("failure to get");
  });

  test("getErrorで値を返す", () => {
    const either = failure(new Error("error"));
    expect(either.getError).toEqual(new Error("error"));
  });

  test("mapで何も起こらない", () => {
    const either = failure<Error, number>(new Error("error"));
    const expected = failure<Error, string>(new Error("error"));
    const actual = either.map((n) => `${n}番`);
    expect(actual).toEqual(expected);
  });

  test("flatMapで何も起こらない", () => {
    const either = failure<Error, number>(new Error("error"));
    const expected = failure<Error, string>(new Error("error"));
    const actual = either.flatMap((n) => success(`${n}番`));
    expect(actual).toEqual(expected);
  });

  test("mapErrorで値を変換できる", () => {
    const either = failure(new Error("error"));
    const expected = failure(new Error("error+mapError"));
    const actual = either.mapError(
      (error) => new Error(error.message + "+mapError")
    );
    expect(actual).toEqual(expected);
  });

  test("flatMapErrorで値を変換し、平らにできる", () => {
    const either = failure(new Error("error"));
    const expected = failure(new Error("error+mapError"));
    const actual = either.flatMapError((error) =>
      failure(new Error(error.message + "+mapError"))
    );
    expect(actual).toEqual(expected);
  });

  test("isSuccessでfalseを返し、isFailureでtrueを返す", () => {
    const either = failure(new Error("error"));
    expect(either.isSuccess).toBeFalsy();
    expect(either.isFailure).toBeTruthy();
  });

  test("equalsで同じ値ならばtrueを返す", () => {
    const either1 = failure(10);
    const either2 = failure(10);
    expect(either1.equals(either2)).toBeTruthy();
  });

  test("equalsで異なる値ならばfalseを返す", () => {
    const either1 = failure(10);
    const either2 = failure(20);
    expect(either1.equals(either2)).toBeFalsy();
  });

  test("equalsでequatableならばequalsで比較する", () => {
    class E extends Equatable<E> {
      constructor(readonly n: number) {
        super();
      }
    }
    const either1 = failure(new E(10));
    const either2 = failure(new E(10));
    expect(either1.equals(either2)).toBeTruthy();
  });

  test("successと比較するとfalseを返す", () => {
    const either1 = failure<number, number>(10);
    const either2 = success<number, number>(10);
    expect(either1.equals(either2)).toBeFalsy();
  });

  test("equalsで第三引数に比較関数を渡すと、その関数で比較する", () => {
    const either1 = failure(10);
    const either2 = failure(20);
    expect(
      either1.equals(
        either2,
        () => true,
        (a, b) => a % 10 === b % 10
      )
    ).toBeTruthy();
  });

  test("equalsで第三引数に比較関数を渡すと、その関数がfalseを返すならfalseを返す", () => {
    const either1 = failure(10);
    const either2 = failure(20);
    expect(
      either1.equals(
        either2,
        () => true,
        () => false
      )
    ).toBeFalsy();
  });

  test("toOptionalでnoneを返す", () => {
    const either = failure(10);
    expect(either.toOptional.isEmpty).toBeTruthy();
  });
});
