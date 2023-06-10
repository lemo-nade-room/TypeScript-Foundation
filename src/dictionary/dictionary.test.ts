import { describe, test, expect } from "vitest";
import { dict, kv } from "./dictionary";
import { none, some } from "../optional";

describe("Dictionary Tests", () => {
  test("置いたものを取り出せる", () => {
    let dictionary = dict<string, number>();
    dictionary = dictionary.put("a", 1);
    expect(dictionary.get("a")).toEqual(some(1));
  });

  test("値を更新できる", () => {
    let dictionary = dict({
      hello: "world",
    });
    dictionary = dictionary.put("hello", "こんにちは");
    expect(dictionary.get("hello")).toEqual(some("こんにちは"));
  });

  test("nullまたはnoneまたはundefinedで更新すると消せる", () => {
    let dictionary = dict({
      hello: "world",
    });
    const nullDictionary = dictionary.put("hello", null);
    expect(nullDictionary.get("hello")).toBe(none());
    const undefinedDictionary = dictionary.put("hello", undefined);
    expect(undefinedDictionary.get("hello")).toBe(none());
    const noneDictionary = dictionary.put("hello", none());
    expect(noneDictionary.get("hello")).toBe(none());
  });

  test("decodable", () => {
    const json = {
      hello: true,
      world: false,
    };
    const origin = dict([kv("" as string, true)]);
    const actual = origin.decode(json);
    expect(actual.get("hello")).toEqual(some(true));
    expect(actual.get("world")).toEqual(some(false));
  });
});
