import { describe, expect, test } from "vitest";
import { JSONEncodable } from "./JSONEncodable";

describe("Codable Tests", () => {
  class CustomJSON extends JSONEncodable<CustomJSON> {
    constructor(readonly name: string, readonly age: number) {
      super();
    }

    get json(): unknown {
      return {
        introduce: `${this.name} is ${this.age} years old.`,
      };
    }
  }

  class HasCustom extends JSONEncodable<HasCustom> {
    constructor(readonly value: CustomJSON) {
      super();
    }
  }

  test("JSONEncodable", () => {
    const custom = new CustomJSON("John", 20);
    const hasCustom = new HasCustom(custom);
    const actual = hasCustom.json;
    const expected = {
      value: {
        introduce: "John is 20 years old.",
      },
    };
    expect(actual).toEqual(expected);
  });
});
