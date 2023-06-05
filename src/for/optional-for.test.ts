import { describe, expect, test } from "vitest";
import { optionalFor5 } from "./optional-for";
import { none, optional } from "../optional";

describe("Optional For 5 Tests", () => {
  test("4つのfor", () => {
    const data = {
      a: {
        b: 3 as number | null,
        c: "Bob" as string | null,
      } as { b: number | null; c: string | null } | null,
    } as { a: { b: number | null; c: string | null } | null } | null;

    const cb = optionalFor5(
      () => optional(data).map((data) => ({ data })),
      ({ data }) => optional(data.a).map((a) => ({ a })),
      ({ a }) => optional(a.c).map((c) => ({ c })),
      ({ a }) => optional(a.b).map((b) => ({ b }))
    ).yield(({ b, c }) => `${c}は${b}歳`);
    expect(cb.value).toBe("Bobは3歳");
  });

  test("5つのfor", () => {
    const config = {
      aOpt: optional("a"),
      bOpt: optional("b"),
      cOpt: optional("c"),
      dOpt: optional("d"),
      eOpt: optional(null),
    };
    const result = optionalFor5(
      () => config.aOpt.map((a) => ({ a })),
      () => config.bOpt.map((b) => ({ b })),
      () => config.cOpt.map((c) => ({ c })),
      () => config.dOpt.map((d) => ({ d })),
      () => config.eOpt.map((e) => ({ e }))
    ).yield(({ a, b, c, d, e }) => `${a}${b}${c}${d}${e}`);
    expect(result).toBe(none());
  });
});
