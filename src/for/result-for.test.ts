import { describe, expect, test } from "vitest";
import { resultFor5 } from "./result-for";
import { failure, success } from "../result";

describe("Result For 5 Tests", () => {
  test("4つのresult", () => {
    const data = success({
      a: success({
        b: success(3),
        c: success("Bob"),
      }),
    });

    const cb = resultFor5(
      () => data.map((data) => ({ data })),
      ({ data }) => data.a.map((a) => ({ a })),
      ({ a }) => a.b.map((b) => ({ b })),
      ({ a }) => a.c.map((c) => ({ c }))
    ).yield(({ b, c }) => `${c}は${b}歳`);
    expect(cb.get).toBe("Bobは3歳");
  });

  test("5つのfor", () => {
    const config = {
      aOpt: success("a"),
      bOpt: success("b"),
      cOpt: success("c"),
      dOpt: success("d"),
      eOpt: failure(new Error("error")),
    };
    const result = resultFor5(
      () => config.aOpt.map((a) => ({ a })),
      () => config.bOpt.map((b) => ({ b })),
      () => config.cOpt.map((c) => ({ c })),
      () => config.dOpt.map((d) => ({ d })),
      () => config.eOpt.map((e) => ({ e }))
    ).yield(({ a, b, c, d, e }) => `${a}${b}${c}${d}${e}`);
    expect(result.getError).toEqual(new Error("error"));
  });
});
