import { z } from "zod";
import { AccountType, Game } from "@prisma/client";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const createAccountInput = z.object({
  userId: z.string(),
  accountName: z.string(),
  game: z.nativeEnum(Game),
  accountType: z.nativeEnum(AccountType).nullable(),
});

export type CreateAccountInput = z.infer<typeof createAccountInput>;

export const accountRouter = createTRPCRouter({
  findAllForUser: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.gameAccount.findMany({
        where: { userId: input },
      });
    }),
  findById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.gameAccount.findFirst({
        where: { id: input },
      });
    }),
  createAccount: protectedProcedure
    .input(createAccountInput)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.gameAccount.create({
        data: input,
      });
    }),
});
