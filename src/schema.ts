import type { z } from "zod";
import type { JsonArray, JsonObject } from "type-fest";
import type { decimal, json } from "./types";

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
  | z.ZodOptional<z.ZodNullable<T>>; // z.nullish

/**
 * 🔥 [WIP]
 *
 * This is a helper type that converts the Prisma types to Zod types.
 * Useful because we'll get an error on our schema files when there's change on the Prisma types.
 */
type ConvertSchemaTypes<T> = {
  [K in keyof T]: T[K] extends string
    ? z.ZodString | z.ZodEnum<[string, ...string[]]>
    : T[K] extends string | null
    ? OptionalOperator<z.ZodString | z.ZodEnum<[string, ...string[]]>>
    : T[K] extends boolean
    ? z.ZodBoolean
    : T[K] extends boolean | null
    ? OptionalOperator<z.ZodBoolean>
    : T[K] extends number
    ? z.ZodNumber
    : T[K] extends number | null
    ? OptionalOperator<z.ZodNumber>
    : T[K] extends Date
    ? z.ZodDate | z.ZodString
    : T[K] extends Date | null
    ? OptionalOperator<z.ZodDate | z.ZodString>
    : T[K] extends bigint
    ? z.ZodBigInt | z.ZodNumber
    : T[K] extends bigint | null
    ? OptionalOperator<z.ZodBigInt | z.ZodNumber>
    : T[K] extends DecimalJsLike
    ? ReturnType<typeof decimal>
    : T[K] extends DecimalJsLike | null
    ? OptionalOperator<ReturnType<typeof decimal>>
    : // FIX: Optional json type are represented by NullableJsonNullValueInput on prisma xxxCreateInput
    // which are not necessarily null but Prisma.JsonNull instead
    T[K] extends string | number | boolean | JsonObject | JsonArray | null
    ? ReturnType<typeof json> | OptionalOperator<ReturnType<typeof json>>
    :
        | z.ZodAny
        | z.ZodEffects<any, any, any>
        | OptionalOperator<z.ZodAny>
        | OptionalOperator<z.ZodEffects<any, any, any>>;
};

/**
 * This is a helper type that converts the Prisma types to Zod types and omits the fields that users don't need.
 */
export type Schema<
  PrismaModelType extends object,
  HiddenFields extends keyof PrismaModelType = never,
> = ConvertSchemaTypes<Omit<PrismaModelType, HiddenFields>>;
