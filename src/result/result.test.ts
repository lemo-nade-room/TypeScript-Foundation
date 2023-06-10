import { describe, test, expect } from "vitest";
import { success } from "./success";
import { asyncResultBuilder, resultBuilder } from "./result";
import { failure } from "./failure";

describe("Result Tests", () => {
  test("関数をsuccessになおす", () => {
    const expected = success(10);
    const actual = resultBuilder(() => 10);
    expect(actual).toEqual(expected);
  });

  test("関数をfailureになおす", () => {
    const expected = failure(new Error("Hello"));
    const actual = resultBuilder(() => {
      throw new Error("Hello");
    });
    expect(actual).toEqual(expected);
  });

  test("非同期関数をsuccessになおす", async () => {
    const expected = success(10);
    const actual = await asyncResultBuilder(async () => 10);
    expect(actual).toEqual(expected);
  });

  test("非同期関数をfailureになおす", async () => {
    const expected = failure(new Error("Hello"));
    const actual = await asyncResultBuilder(async () => {
      throw new Error("Hello");
    });
    expect(actual).toEqual(expected);
  });
});
