import { describe, test, expect } from "vitest";
import { dict, kv } from "./dictionary";
import { none, some } from "../optional";
import { set } from "../set/set";
import { seq } from "../sequence";
import { assertEquals } from "../equality/assertion.test";

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

  test("iterable", () => {
    const dictionary = dict({
      hello: "こんにちは",
      world: "世界",
    });
    let keys = set<string>([]);
    let values = set<string>([]);
    for (const [key, value] of dictionary) {
      keys = keys.insert(key);
      values = values.insert(value);
    }
    expect(keys).toEqual(set(["hello", "world"]));
    expect(values).toEqual(set(["こんにちは", "世界"]));
  });

  test("values", () => {
    const dictionary = dict({
      hello: "こんにちは",
      world: "世界",
    });
    expect(dictionary.values).toEqual(seq(["こんにちは", "世界"]));
  });

  test("keys", () => {
    const dictionary = dict({
      hello: "こんにちは",
      world: "世界",
    });
    expect(dictionary.keys).toEqual(seq(["hello", "world"]));
  });

  test("map", () => {
    const dictionary = dict({
      hello: "こんにちは",
      world: "世界",
    });
    const expected = dict({
      "hello?": "こんにちは!",
      "world?": "世界!",
    });
    const actual = dictionary.map((key, value) => [key + "?", value + "!"]);
    assertEquals(actual, expected);
  });

  test("filter", () => {
    const dictionary = dict<string, string>({
      hello: "こんにちは",
      world: "世界",
    });
    const expected = dict<string, string>({
      hello: "こんにちは",
    });
    const actual = dictionary.filter((key, value) => value.length > 3);
    assertEquals(actual, expected);
  });

  test("every", () => {
    const dictionary = dict<string, string>({
      hello: "こんにちは",
      world: "世界",
    });
    expect(dictionary.every((key) => key.length > 3)).toBeTruthy();
    expect(dictionary.every((key, value) => value.length > 3)).toBeFalsy();
  });

  test("some", () => {
    const dictionary = dict<string, string>({
      hello: "こんにちは",
      world: "世界",
    });
    expect(dictionary.some((key) => key.length < 3)).toBeFalsy();
    expect(dictionary.some((key, value) => value.length < 3)).toBeTruthy();
  });
});
