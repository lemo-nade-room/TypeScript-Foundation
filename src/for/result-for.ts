import { ResultForResult } from "./resultForResult";
import { Result, success } from "../result";

export function resultFor5<
  ERR,
  A extends object,
  B extends object,
  C extends object = object,
  D extends object = object,
  E extends object = object
>(
  a: () => Result<A, ERR>,
  b: (a: A) => Result<B, ERR>,
  c?: (ab: A & B) => Result<C, ERR>,
  d?: (abc: A & B & C) => Result<D, ERR>,
  e?: (abcd: A & B & C & D) => Result<E, ERR>
): ResultForResult<A & B & C & D & E, ERR> {
  return new ResultForResult<A & B & C & D & E, ERR>(
    a().flatMap((rA) =>
      b(rA).flatMap((rB) =>
        c == null
          ? success({ ...rA, ...rB } as A & B & C & D & E)
          : c({ ...rA, ...rB }).flatMap((rC) =>
              d == null
                ? success({ ...rA, ...rB, ...rC } as A & B & C & D & E)
                : d({ ...rA, ...rB, ...rC }).flatMap((rD) =>
                    e == null
                      ? success({ ...rA, ...rB, ...rC, ...rD } as A &
                          B &
                          C &
                          D &
                          E)
                      : e({ ...rA, ...rB, ...rC, ...rD }).map((rE) => ({
                          ...rA,
                          ...rB,
                          ...rC,
                          ...rD,
                          ...rE,
                        }))
                  )
            )
      )
    )
  );
}
