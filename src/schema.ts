import type { z } from "zod";
import type { JsonArray, JsonObject } from "type-fest";
import type { decimal, json } from "./types";

type JsonValue = string | number | boolean | JsonObject | JsonArray | null;

/**
 * Interface for any Decimal.js-like library
 * Allows us to accept Decimal.js from different
 * versions and some compatible alternatives
 */
export declare interface DecimalJsLike {
  d: number[];
  e: number;
  s: number;
}

type OptionalOperator<T extends z.ZodTypeAny> =
  | z.ZodOptional<T>
  | z.ZodNullable<T>
  | z.ZodOptional<z.ZodNullable<T>>; // z.nullish()

/**
 * 🔥 [WIP]
 *
 * This is a helper type that converts the Prisma types to Zod types.
 * Useful because we'll get an error on our schema files when there's change on the Prisma types.
 */
type TypeConvert<T> = T extends string
  ? z.ZodString | z.ZodEnum<[string, ...string[]]>
  : T extends number
  ? z.ZodNumber
  : T extends boolean
  ? z.ZodBoolean
  : T extends Date
  ? z.ZodDate
  : T extends bigint
  ? z.ZodBigInt
  : T extends DecimalJsLike
  ? ReturnType<typeof decimal>
  : T extends JsonValue
  ? ReturnType<typeof json>
  : never;

type Optional<T, T2 extends z.ZodType> = T extends null | undefined
  ? OptionalOperator<T2>
  : T2;
type PrepareType<T> = Optional<T, TypeConvert<T>>;

type ConvertSchemaTypes<T> = {
  [K in keyof T]: PrepareType<T[K]>;
};

/**
 * This is a helper type that converts the Prisma types to Zod types and omits the fields that users don't need.
 */
export type Schema<
  PrismaModelType extends object,
  HiddenFields extends keyof PrismaModelType = never,
> = ConvertSchemaTypes<Omit<PrismaModelType, HiddenFields>>;
