import { describe, expect, test } from "vitest";
import { Clonable } from "./clonable";

describe("Clonable Tests", () => {
  class C extends Clonable<C> {
    constructor(public name: string, public age: number) {
      super();
    }
  }

  test("cloneしたものを変更しても元に影響が出ない", () => {
    const c1 = new C("hello", 10);
    const c2 = c1.clone;
    c2.name = "world";
    expect(c1.name).toBe("hello");
  });

  class HasC extends Clonable<HasC> {
    constructor(public c: C) {
      super();
    }
  }

  test("clonableなプロパティはcloneを変更しても影響が出ない", () => {
    const h1 = new HasC(new C("hello", 10));
    const h2 = h1.clone;
    h2.c.age = 20;
    expect(h1.c.age).toBe(10);
  });
});
