import { describe, test, expect } from "vitest";
import { Hashable } from "./hashable";
import { hash } from "./hash";

describe("hashable tests", () => {
  test("文字列が同じならばhash値が等しい", () => {
    const h1 = "hello";
    const h2 = "hello";
    expect(hash(h1)).toBe(hash(h2));
  });

  test("文字列が異なるならばhash値が異なる", () => {
    const h1 = "hello";
    const h2 = "world";
    expect(hash(h1) === hash(h2)).toBeFalsy();
  });

  test("数値が同じならばhash値が等しい", () => {
    const h1 = 100;
    const h2 = 100;
    expect(hash(h1)).toBe(hash(h2));
  });

  test("数値が異なるならばhash値が異なる", () => {
    const h1 = 100;
    const h2 = 101;
    expect(hash(h1) === hash(h2)).toBeFalsy();
  });

  test("真偽値が同じならばhash値が等しい", () => {
    const h1 = true;
    const h2 = true;
    expect(hash(h1)).toBe(hash(h2));
  });

  test("真偽値が異なるならばhash値が異なる", () => {
    const h1 = true;
    const h2 = false;
    expect(hash(h1) === hash(h2)).toBeFalsy();
  });

  test("型が異なるならばhash値が異なる", () => {
    const h1 = true;
    const h2 = "true";
    expect(hash(h1) === hash(h2)).toBeFalsy();
  });

  test("nullとundefinedはhash値が等しい", () => {
    const h1 = undefined;
    const h2 = null;
    expect(hash(h1)).toBe(hash(h2));
  });
});
