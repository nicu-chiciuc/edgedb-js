import {Cardinality} from "../typesystem";

// Computing cardinality of path
// From base set cadinality and pointer cardinality
// Used in path expressions
// Cardinality  Empty  AtMostOne  One         Many  AtLeastOne
// Empty        0      0          0           0     0
// AtMostOne    0      AtMostOne  AtMostOne   Many  Many
// One          0      AtMostOne  One         Many  AtLeastOne
// Many         0      Many       Many        Many  Many
// AtLeastOne   0      Many       AtLeastOne  Many  AtLeastOne

export type pointerCardinality<
  C1 extends Cardinality,
  C2 extends Cardinality
> = C1 extends Cardinality.Empty
  ? Cardinality.Empty
  : C1 extends Cardinality.One
  ? C2
  : C1 extends Cardinality.AtMostOne
  ? C2 extends Cardinality.One
    ? Cardinality.AtMostOne
    : C2 extends Cardinality.AtLeastOne
    ? Cardinality.Many
    : C2
  : C1 extends Cardinality.Many
  ? C2 extends Cardinality.Empty
    ? Cardinality.Empty
    : Cardinality.Many
  : C1 extends Cardinality.AtLeastOne
  ? C2 extends Cardinality.AtMostOne
    ? Cardinality.Many
    : C2 extends Cardinality.One
    ? Cardinality.AtLeastOne
    : C2
  : never;

export function pointerCardinality(
  c1: Cardinality,
  c2: Cardinality
): Cardinality {
  if (c1 === Cardinality.Empty) return Cardinality.Empty;

  if (c1 === Cardinality.One) return c2;
  if (c1 === Cardinality.AtMostOne) {
    if (c2 === Cardinality.One) return Cardinality.AtMostOne;
    if (c2 === Cardinality.AtLeastOne) return Cardinality.Many;
    return c2;
  }
  if (c1 === Cardinality.Many) {
    if (c2 === Cardinality.Empty) return Cardinality.Empty;
    return Cardinality.Many;
  }
  if (c1 === Cardinality.AtLeastOne) {
    if (c2 === Cardinality.AtMostOne) return Cardinality.Many;
    if (c2 === Cardinality.One) return Cardinality.AtLeastOne;
    return c2;
  }
  throw new Error(`Invalid Cardinality ${c1}`);
}

// Merging two sets
// Used in set constructor
// Cardinality  Empty       AtMostOne  One         Many        AtLeastOne
// Empty        Empty       AtMostOne  One         Many        AtLeastOne
// AtMostOne    AtMostOne   Many       AtLeastOne  Many        AtLeastOne
// One          One         AtLeastOne AtLeastOne  AtLeastOne  AtLeastOne
// Many         Many        Many       AtLeastOne  Many        AtLeastOne
// AtLeastOne   AtLeastOne  AtLeastOne AtLeastOne  AtLeastOne  AtLeastOne

export type mergeCardinalities<
  A extends Cardinality,
  B extends Cardinality
> = A extends Cardinality.Empty
  ? B
  : B extends Cardinality.Empty
  ? A
  : A extends Cardinality.AtLeastOne
  ? Cardinality.AtLeastOne
  : B extends Cardinality.AtLeastOne
  ? Cardinality.AtLeastOne
  : A extends Cardinality.One
  ? Cardinality.AtLeastOne
  : B extends Cardinality.One
  ? Cardinality.AtLeastOne
  : Cardinality.Many;

export function mergeCardinalities<
  A extends Cardinality,
  B extends Cardinality
>(a: A, b: B): mergeCardinalities<A, B> {
  if (a === Cardinality.Empty) return b as any;
  if (b === Cardinality.Empty) return a as any;
  if (a === Cardinality.AtLeastOne) return Cardinality.AtLeastOne as any;
  if (b === Cardinality.AtLeastOne) return Cardinality.AtLeastOne as any;
  if (a === Cardinality.One) return Cardinality.AtLeastOne as any;
  if (b === Cardinality.One) return Cardinality.AtLeastOne as any;
  return Cardinality.Many as any;
}

type test1 = mergeCardinalities<Cardinality.AtMostOne, Cardinality.One>;
type test2 = mergeCardinalities<Cardinality.AtMostOne, Cardinality.AtMostOne>;

type _mergeCardinalitiesTuple<
  Cards extends [Cardinality, ...Cardinality[]]
> = Cards extends [infer Card]
  ? Card
  : Cards extends [infer A, infer B, ...infer Rest]
  ? A extends Cardinality
    ? B extends Cardinality
      ? Rest extends Cardinality[]
        ? mergeCardinalities<A, B> extends Cardinality
          ? _mergeCardinalitiesTuple<[mergeCardinalities<A, B>, ...Rest]>
          : never
        : never
      : never
    : never
  : never;

export type mergeCardinalitiesTuple<
  Cards extends [Cardinality, ...Cardinality[]]
> = _mergeCardinalitiesTuple<Cards> extends Cardinality
  ? _mergeCardinalitiesTuple<Cards>
  : never;
export function mergeCardinalitiesTuple<
  Cards extends [Cardinality, ...Cardinality[]]
>(cards: Cards): mergeCardinalitiesTuple<Cards> {
  if (cards.length === 0) throw new Error("Empty tuple not allowed");
  if (cards.length === 1) return cards[0] as any;
  const [first, second, ...rest] = cards;
  if (cards.length === 2) return mergeCardinalities(first, second) as any;
  return mergeCardinalitiesTuple([mergeCardinalities(first, second), ...rest]);
}
