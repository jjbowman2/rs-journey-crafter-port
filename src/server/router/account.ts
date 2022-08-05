import { createRouter } from "./context";
import { z } from "zod";
import { AccountType, Game } from "@prisma/client";

export const accountRouter = createRouter()
	.query("findAllForUser", {
		input: z.string(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.gameAccount.findMany({
				where: { userId: input },
			});
		},
	})
	.query("findById", {
		input: z.string(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.gameAccount.findFirst({
				where: { id: input },
			});
		},
	})
	.mutation("createAccount", {
		input: z.object({
			userId: z.string(),
			accountName: z.string(),
			game: z.nativeEnum(Game),
			accountType: z.nativeEnum(AccountType).nullable(),
		}),
		async resolve({ input, ctx }) {
			return await ctx.prisma.gameAccount.create({
				data: input,
			});
		},
	});
