import { describe, test, expect } from "vitest";
import { Hashable } from "./hashable";

describe("hashable tests", () => {
  class HChild extends Hashable<HChild> {
    constructor(private readonly value: string) {
      super();
    }
  }

  test("同じ値をハッシュ化すると同じ値になる", () => {
    const h1 = new HChild("hello");
    const h2 = new HChild("hello");
    expect(h1.hashValue).toBe(h2.hashValue);
  });

  test("異なる値をハッシュ化すると異なる値になる", () => {
    const h1 = new HChild("hello");
    const h2 = new HChild("world");
    expect(h1.hashValue === h2.hashValue).toBeFalsy();
  });

  class HParent extends Hashable<HParent> {
    constructor(private readonly value: HChild) {
      super();
    }
  }

  test("階層構造でもできる", () => {
    const h1 = new HParent(new HChild("hello"));
    const h2 = new HParent(new HChild("hello"));
    expect(h1.hashValue).toBe(h2.hashValue);
  });
});
