import { doNotExecute, Equal, Expect } from "./utils";

import { z } from "zod";
import { Schema } from "../src/schema";
import * as zpu from "../src/types";

import type { Prisma, Transaction } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// With all fields correctly typed
doNotExecute(() => {
  const schema = z.object({
    email: z.string(),
    name: z.string().optional(),
    password: z.string(),
  } satisfies Schema<Prisma.UserCreateInput>);

  const data = schema.parse({});

  prisma.user.create({
    data,
  });
});

// With some fields incorrectly typed
doNotExecute(() => {
  const schema = z.object({
    address: z.string(),
    amountReceived: z.bigint(),
    canceledAt: z.date().nullish(),
    cancellationReason: z.string().nullish(),
    userId: z.number(),
    status: z.enum(["CONFIRMING", "CONFIRMED", "CANCELED"]),
    metadata: zpu.json().optional(),
  } satisfies Schema<Transaction, "id" | "createdAt" | "updatedAt">);

  const data = schema.parse({});

  prisma.transaction.create({
    data,
  });
});

// With extra fields
doNotExecute(() => {
  const schema = z.object({
    // @ts-expect-error
    shouldFail: z.string(),

    email: z.string(),
    name: z.string().optional(),
    password: z.string(),
  } satisfies Schema<Prisma.UserCreateInput>);

  const data = schema.parse({});

  prisma.user.create({
    data,
  });
});
