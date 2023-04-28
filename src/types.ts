import { Decimal } from "decimal.js";
import { z } from "zod";
import type { RawCreateParams } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean()]);
const nullableLiteralSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.null(),
]);
type Literal = z.infer<typeof literalSchema>;
type NullableLiteral = z.infer<typeof nullableLiteralSchema>;
type Json = NullableLiteral | { [key: string]: Json } | Json[];
type JsonInput = Literal | { [key: string]: Json } | Json[];

/**
 * Workaround for using nullable literal types
 * @param params
 * @returns
 */
const jsonNullable = (params?: RawCreateParams): z.ZodType<Json> =>
  z.lazy(
    () =>
      z.union(
        [
          nullableLiteralSchema,
          z.array(json(params), params),
          z.record(json(params), params),
        ],
        params,
      ),
    params,
  );

/**
 * Validates a JSON
 * @returns zod schema for JSON type
 */
export const json = (params?: RawCreateParams): z.ZodType<JsonInput> =>
  z.union(
    [
      literalSchema,
      z.array(jsonNullable(params), params),
      z.record(jsonNullable(params), params),
    ],
    params,
  );

/**
 *
 * @returns zod schema for Decimal type
 */
export const decimal = (params?: RawCreateParams) =>
  z
    .instanceof(Decimal)
    .or(z.string(params))
    .or(z.number(params))
    .refine((value) => {
      try {
        return new Decimal(value);
      } catch (error) {
        return false;
      }
    }, params?.invalid_type_error)
    .transform((value) => new Decimal(value));
