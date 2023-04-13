import { doNotExecute, Equal, Expect } from "./utils";

import type { JsonArray, JsonObject } from "type-fest";
import { Decimal } from "decimal.js";

import { z } from "zod";
import { Schema } from "../src/schema";
import * as zw from "../src/types";

type Post = {
  createdAt: Date;
  updatedAt: Date;
  test_string: string;
  test_string_optional: string | null;
  test_enum: string;
  test_enum_optional: string | null;
  test_bigint: bigint;
  test_bigint_optional: bigint | null;
  test_decimal: Decimal;
  test_decimal_optional: Decimal | null;
  test_float: number;
  test_float_optional: number | null;
  test_int: number;
  test_int_optional: number | null;
  test_timestamptz: Date;
  test_timestamptz_optional: Date | null;
  test_timestamptz_with_default: Date;
  test_boolean: boolean;
  test_boolean_optional: boolean | null;
  test_json: string | number | boolean | JsonObject | JsonArray | null;
  test_json_optional: string | number | boolean | JsonObject | JsonArray | null;
  test_bytes: Buffer;
  test_bytes_optional: Buffer | null;
};

type HiddenFields = "createdAt" | "updatedAt";

// With all fields correctly typed
doNotExecute(() => {
  const schema = z.object<Schema<Post, HiddenFields>>({
    test_string: z.string(),
    test_string_optional: z.string().optional(),

    test_enum: z.enum(["wqewqe", "wqqewqe"]),
    test_enum_optional: z.string().optional(),

    test_boolean: z.boolean(),
    test_boolean_optional: z.boolean().optional(),

    test_int: z.number(),
    test_int_optional: z.number().nullish(),

    test_bigint: z.bigint(),
    test_bigint_optional: z.bigint().nullable(),

    test_decimal: zw.decimal(),
    test_decimal_optional: zw.decimal().optional(),

    test_float: z.number(),
    test_float_optional: z.number().optional(),

    test_timestamptz: z.date(),
    test_timestamptz_optional: z.date().optional(),
    test_timestamptz_with_default: z.date(),

    test_json: zw.json(),
    test_json_optional: zw.json().optional(),

    test_bytes: z.string().refine((str) => Buffer.isBuffer(Buffer.from(str))),
    test_bytes_optional: z
      .string()
      .refine((str) => Buffer.isBuffer(Buffer.from(str)))
      .optional(),
  });
});

// With some fields incorrectly typed
doNotExecute(() => {
  const schema = z.object<Schema<Post, HiddenFields>>({
    // @ts-expect-error
    test_string: z.number(),
    // @ts-expect-error
    test_string_optional: z.string(),

    // @ts-expect-error
    test_boolean: z.string(),
    // @ts-expect-error
    test_boolean_optional: z.boolean(),

    // @ts-expect-error
    test_int: z.string(),
    // @ts-expect-error
    test_int_optional: z.number(),

    test_bigint: z.bigint(),
    test_bigint_optional: z.bigint().nullable(),

    test_decimal: zw.decimal(),
    test_decimal_optional: zw.decimal().optional(),

    test_float: z.number(),
    test_float_optional: z.number().optional(),

    test_timestamptz: z.date(),
    test_timestamptz_optional: z.date().optional(),
    test_timestamptz_with_default: z.date(),

    test_json: zw.json(),
    test_json_optional: zw.json().optional(),

    test_bytes: z.string().refine((str) => Buffer.isBuffer(Buffer.from(str))),
    test_bytes_optional: z
      .string()
      .refine((str) => Buffer.isBuffer(Buffer.from(str)))
      .optional(),
  });
});

// With extra fields
doNotExecute(() => {
  const schema = z.object<Schema<Post, HiddenFields>>({
    // @ts-expect-error
    random_field: z.string(),

    test_string: z.string(),
    test_string_optional: z.string().optional(),

    test_boolean: z.boolean(),
    test_boolean_optional: z.boolean().optional(),

    test_int: z.number(),
    test_int_optional: z.number().nullish(),

    test_bigint: z.bigint(),
    test_bigint_optional: z.bigint().nullable(),

    test_decimal: zw.decimal(),
    test_decimal_optional: zw.decimal().optional(),

    test_float: z.number(),
    test_float_optional: z.number().optional(),

    test_timestamptz: z.date(),
    test_timestamptz_optional: z.date().optional(),
    test_timestamptz_with_default: z.date(),

    test_json: zw.json(),
    test_json_optional: zw.json().optional(),

    test_bytes: z.string().refine((str) => Buffer.isBuffer(Buffer.from(str))),
    test_bytes_optional: z
      .string()
      .refine((str) => Buffer.isBuffer(Buffer.from(str)))
      .optional(),
  });
});
