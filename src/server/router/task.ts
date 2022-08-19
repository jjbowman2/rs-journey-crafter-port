import { Skill, TaskType } from "@prisma/client";
import { z } from "zod";
import { createRouter } from "./context";

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

const UpdateTaskSchema = z.intersection(
	CreateTaskSchema.partial(),
	z.object({
		id: z.string(),
	})
);

const AddPrerequisiteSchema = z.object({
	dependentTaskId: z.string(),
	prerequisite: CreateTaskSchema,
});

export const taskRouter = createRouter()
	.query("findAllTasksForAccount", {
		input: z.string(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.findMany({
				where: { accountId: input },
				orderBy: { createdAt: "desc" },
			});
		},
	})
	.query("findTaskById", {
		input: z.string(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.findFirst({
				where: { id: input },
				include: { dependees: true },
			});
		},
	})
	.query("findAllDependeesForTask", {
		input: z.string(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.findMany({
				where: { dependents: { some: { dependentId: input } } },
			});
		},
	})
	.mutation("createTask", {
		input: CreateTaskSchema,
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.create({
				data: { ...input },
			});
		},
	})
	.mutation("updateTask", {
		input: UpdateTaskSchema,
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.update({
				where: { id: input.id },
				data: input,
			});
		},
	})
	.mutation("addPrerequisite", {
		input: AddPrerequisiteSchema,
		async resolve({ input: { dependentTaskId, prerequisite }, ctx }) {
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
		},
	})
	.mutation("deleteTaskById", {
		input: z.string(),
		async resolve({ input, ctx }) {
			return await ctx.prisma.task.delete({
				where: { id: input },
			});
		},
	});
