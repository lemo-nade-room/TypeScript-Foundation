import { describe, test, expect } from "vitest";
import { success } from "./success";
import { toEitherAsync, toEither } from "./either";
import { failure } from "./failure";

describe("Either Tests", () => {
  test("関数をsuccessになおす", () => {
    const expected = success(10);
    const actual = toEither(() => 10);
    expect(actual).toEqual(expected);
  });

  test("関数をfailureになおす", () => {
    const expected = failure(new Error("Hello"));
    const actual = toEither(() => {
      throw new Error("Hello");
    });
    expect(actual).toEqual(expected);
  });

  test("非同期関数をsuccessになおす", async () => {
    const expected = success(10);
    const actual = await toEitherAsync(async () => 10);
    expect(actual).toEqual(expected);
  });

  test("非同期関数をfailureになおす", async () => {
    const expected = failure(new Error("Hello"));
    const actual = await toEitherAsync(async () => {
      throw new Error("Hello");
    });
    expect(actual).toEqual(expected);
  });
});
