# zod-prisma-utils [WIP]

The libs out there for Prisma and Zod try to squish them together by forcing you write a non-typesafe code inside your Prisma schema. Instead, we use a different approach here. We don't generate anything for you, but we do provide you with a set of utilities that you can use to make your Zod schemas a little bit more Prisma safe.

## Installation

```bash
npm install zod-prisma-utils
```

## Usage

Simply import the `Schema` type from `zod-prisma-utils` and use it to define your Zod schema. You can also specify which fields you want to hide from the schema.

```ts
import { z } from "zod";

import type { User } from "@prisma/client";
import type { Schema } from "zod-prisma-utils";

type HiddenFields = "createdAt" | "updatedAt";

export const UserSchema = z.object<Schema<User, HiddenFields>>({
  id: z.string().uuid(),
  email: z.string().max(255).email(),
  name: z.string().max(255).optional(),
  password: z.string(),
  someField: z.string().max(255).optional(),
});
```

That's it! No need to generate anything, no need to write any code inside your Prisma schema. Just use the `Schema` type and you're good to go.

Since Prisma has a special way to handle `decimal` and `json` fields, we also provide a `decimal` and `json` function that you can use to define your schema.

```ts
import { z } from "zod";

import * as zpu from "zod-prisma-utils";

export const TransactionSchema = z.object<Schema<Transaction>>({
  id: z.string().uuid(),
  amount: zpu.decimal(),
  details: zpu.json(),
});
```
