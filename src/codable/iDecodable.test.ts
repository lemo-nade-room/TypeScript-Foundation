import { describe, test, expect } from "vitest";
import { isDecodable } from "./iDecodable";

describe("isDecodable Tests", () => {
  test("objectでない場合はfalse", () => {
    expect(isDecodable(1)).toBeFalsy();
    expect(isDecodable("hello")).toBeFalsy();
    expect(isDecodable(true)).toBeFalsy();
    expect(isDecodable(undefined)).toBeFalsy();
    expect(isDecodable(null)).toBeFalsy();
  });

  test("decodeプロパティがない場合はfalse", () => {
    expect(isDecodable({})).toBeFalsy();
  });

  test("decodeプロパティが関数でない場合はfalse", () => {
    expect(isDecodable({ decode: "" })).toBeFalsy();
  });

  test("decodeプロパティが関数の場合はtrue", () => {
    expect(isDecodable({ decode: () => this })).toBeTruthy();
  });
});
