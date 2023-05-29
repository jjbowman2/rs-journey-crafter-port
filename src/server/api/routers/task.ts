import { Skill, TaskType } from "@prisma/client";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const CreateTaskSchema = z.object({
  accountId: z.string(),
  taskType: z.nativeEnum(TaskType),
  title: z.string(),
  description: z.string().nullish(),
  skill: z.nativeEnum(Skill).nullish(),
  level: z.number().nullish(),
  questId: z.number().nullish(),
  achievementDiaryId: z.number().nullish(),
  combatTaskId: z.number().nullish(),
  complete: z.boolean().default(false),
  flagged: z.boolean().default(false),
  labels: z.string().array().default([]),
  createdAt: z.date().default(new Date()),
});
export type CreateTaskSchema = z.infer<typeof CreateTaskSchema>;

const UpdateTaskSchema = z.intersection(
  CreateTaskSchema.partial(),
  z.object({
    id: z.string(),
  })
);
export type UpdateTaskSchema = z.infer<typeof UpdateTaskSchema>;

const AddPrerequisiteSchema = z.object({
  dependentTaskId: z.string(),
  prerequisite: CreateTaskSchema,
});
export type AddPrerequisiteSchema = z.infer<typeof AddPrerequisiteSchema>;

export const taskRouter = createTRPCRouter({
  findAllTasksForAccount: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.task.findMany({
        where: { accountId: input },
        orderBy: { createdAt: "desc" },
        include: { dependees: true },
      });
    }),
  findTaskById: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.task.findFirst({
        where: { id: input },
        include: { dependees: true },
      });
    }),
  findAllDependeesForTask: protectedProcedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.task.findMany({
        where: { dependents: { some: { dependentId: input } } },
      });
    }),
  createTask: protectedProcedure
    .input(CreateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.create({
        data: { ...input },
      });
    }),
  updateTask: protectedProcedure
    .input(UpdateTaskSchema)
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.update({
        where: { id: input.id },
        data: input,
      });
    }),
  addPrerequisite: protectedProcedure
    .input(AddPrerequisiteSchema)
    .mutation(async ({ input: { dependentTaskId, prerequisite }, ctx }) => {
      return await ctx.prisma.task.update({
        where: { id: dependentTaskId },
        data: {
          dependees: {
            create: {
              dependee: { create: prerequisite },
            },
          },
        },
      });
    }),
  deleteTaskById: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.task.delete({
        where: { id: input },
      });
    }),
});
