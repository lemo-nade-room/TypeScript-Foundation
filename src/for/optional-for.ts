import { Optional, some } from "../optional";
import { OptionalForResult } from "./optionalForResult";

export function optionalFor5<
  A extends object,
  B extends object,
  C extends object = object,
  D extends object = object,
  E extends object = object
>(
  a: () => Optional<A>,
  b: (a: A) => Optional<B>,
  c?: (ab: A & B) => Optional<C>,
  d?: (abc: A & B & C) => Optional<D>,
  e?: (abcd: A & B & C & D) => Optional<E>
): OptionalForResult<A & B & C & D & E> {
  return new OptionalForResult<A & B & C & D & E>(
    a().flatMap((rA) =>
      b(rA).flatMap((rB) =>
        c == null
          ? some({ ...rA, ...rB } as A & B & C & D & E)
          : c({ ...rA, ...rB }).flatMap((rC) =>
              d == null
                ? some({ ...rA, ...rB, ...rC } as A & B & C & D & E)
                : d({ ...rA, ...rB, ...rC }).flatMap((rD) =>
                    e == null
                      ? some({ ...rA, ...rB, ...rC, ...rD } as A &
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
