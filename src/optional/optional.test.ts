import { describe, test, expect } from "vitest";
import { some } from "./some";
import { none } from "./none";
import { optional } from "./optional";

describe("Optional Tests", () => {
  test("nullをoptional型にする", () => {
    const value = null as string | null;
    const option = optional(value);
    expect(option).toBe(none());
  });

  test("undefinedをoptional型にする", () => {
    const value = undefined as string | undefined;
    const option = optional(value);
    expect(option).toBe(none());
  });

  test("nullableな型をoptional型にする", () => {
    const option = optional("" as string | null);
    expect(option).toEqual(some(""));
  });
});
