import { describe, test, expect } from "vitest";
import { seq } from "../sequence";
import { set } from "./set";
import { assertEquals } from "../equality/assertion.test";

describe("Set Tests", () => {
  test("Iterable", () => {
    const s = set([4, 1, 3, 2]);
    let actual = seq<number>();
    for (const element of s) {
      actual = actual.append(element);
    }
    expect(actual.sorted()).toEqual(seq([1, 2, 3, 4]));
  });

  test("集合の要素が合致してた場合、equalsがtrueを返す", () => {
    const s1 = set([4, 2, 3, 2, 1]);
    const s2 = set([3, 3, 1, 2, 4]);
    assertEquals(s1, s2);
  });
});
