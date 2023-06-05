import { describe, test } from "vitest";
import { Codable } from "./codable";
import { assertEquals } from "../equality/assertion.test";

describe("Codable Tests", () => {
  class A extends Codable<A> {
    constructor(readonly name: string, readonly age: number) {
      super();
    }
  }

  class B extends Codable<B> {
    constructor(readonly value: string) {
      super();
    }
  }

  class C extends Codable<C> {
    constructor(
      readonly a: A,
      readonly b: readonly B[],
      readonly nums: readonly number[]
    ) {
      super();
    }
  }

  test("jsonに変換できる", () => {
    const origin = new C(new A("default", 0), [new B("default")], []);
    const json = {
      a: {
        name: "hello",
        age: 10,
      },
      b: [{ value: "bad" }, { value: "good" }],
      nums: [1, 2, 3],
    };

    const expected = new C(
      new A("hello", 10),
      [new B("bad"), new B("good")],
      [1, 2, 3]
    );
    const actual = origin.decode(json);
    assertEquals(actual, expected);
  });
});
