import { Decimal } from "decimal.js";
import { z } from "zod";
import type { RawCreateParams } from "zod";

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];

/**
 * Validates a JSON
 * @returns zod schema for JSON type
 */
export const json = (params?: RawCreateParams): z.ZodType<Json> =>
  z.lazy(
    () =>
      z.union(
        [
          literalSchema,
          z.array(json(params), params),
          z.record(json(params), params),
        ],
        params,
      ),
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
