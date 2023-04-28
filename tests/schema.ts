import { doNotExecute, Equal, Expect } from "./utils";

import { z } from "zod";
import { Schema } from "../src/schema";
import * as zw from "../src/types";

import type { Prisma, Transaction } from ".prisma/client";

// With all fields correctly typed
doNotExecute(() => {
  z.object<Schema<Prisma.UserCreateInput>>({
    email: z.string(),
    name: z.string().optional(),
    password: z.string(),
  });
});

// With some fields incorrectly typed
doNotExecute(() => {
  z.object<Schema<Transaction, "id" | "createdAt" | "updatedAt">>({
    address: z.string(),
    amountReceived: z.bigint(),
    canceledAt: z.date().nullish(),
    cancellationReason: z.string().nullish(),
    userId: z.number(),
    status: z.enum(["PENDING", "COMPLETED", "CANCELED"]),
    metadata: zw.json().optional(),
  });
});

// With extra fields
doNotExecute(() => {
  z.object<Schema<Prisma.UserCreateInput>>({
    // @ts-expect-error
    shouldFail: z.string(),

    email: z.string(),
    name: z.string().optional(),
    password: z.string(),
  });
});
