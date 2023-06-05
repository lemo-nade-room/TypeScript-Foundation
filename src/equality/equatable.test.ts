import { describe, test } from "vitest";
import { Equatable } from "./equatable";
import { assertEquals, assertNotEquals } from "./assertion";

describe("equals Tests", () => {
  class E extends Equatable<E> {
    constructor(readonly name: string, readonly age: number) {
      super();
    }
  }

  test("同じ値の場合はtrue", () => {
    const e1 = new E("hello", 10);
    const e2 = new E("hello", 10);
    assertEquals(e1, e2);
  });

  test("異なるnameの場合はfalse", () => {
    const e1 = new E("hello", 10);
    const e2 = new E("world", 10);
    assertNotEquals(e1, e2);
  });

  test("異なるageの場合はfalse", () => {
    const e1 = new E("hello", 10);
    const e2 = new E("hello", 11);
    assertNotEquals(e1, e2);
  });

  class HasArray extends Equatable<HasArray> {
    constructor(readonly array: readonly number[]) {
      super();
    }
  }

  test("配列が同じ場合はtrue", () => {
    const e1 = new HasArray([1, 2, 3]);
    const e2 = new HasArray([1, 2, 3]);
    assertEquals(e1, e2);
  });

  test("配列の要素数が異なる場合はfalse", () => {
    const e1 = new HasArray([1, 2, 3]);
    const e2 = new HasArray([1, 2]);
    assertNotEquals(e1, e2);
  });

  test("配列の要素が一つでもが異なる場合はfalse", () => {
    const e1 = new HasArray([1, 2, 3]);
    const e2 = new HasArray([1, 2, 4]);
    assertNotEquals(e1, e2);
  });

  class HasEquatable extends Equatable<HasEquatable> {
    constructor(readonly e: E) {
      super();
    }
  }

  test("プロパティでもequalsの場合はtrue", () => {
    const e1 = new HasEquatable(new E("hello", 10));
    const e2 = new HasEquatable(new E("hello", 10));
    assertEquals(e1, e2);
  });

  test("プロパティが異なる場合はfalse", () => {
    const e1 = new HasEquatable(new E("hello", 10));
    const e2 = new HasEquatable(new E("hello", 11));
    assertNotEquals(e1, e2);
  });
});
