// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { accountRouter } from "./account";
import { taskRouter } from "./task";

export const appRouter = createRouter()
	.transformer(superjson)
	.merge("account.", accountRouter)
	.merge("auth.", authRouter)
	.merge("task.", taskRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
