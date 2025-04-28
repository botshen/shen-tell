import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  // 获取所有用户
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const users = await ctx.db.user.findMany({
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        });

        return users;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取用户列表失败",
          cause: error,
        });
      }
    }),

  // 根据ID获取用户
  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.findUnique({
          where: { id: input.id },
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "用户不存在",
          });
        }

        return user;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取用户信息失败",
          cause: error,
        });
      }
    }),

  // 创建用户
  create: publicProcedure
    .input(
      z.object({
        name: z.string().min(1, "用户名不能为空"),
        avatar: z.string().default("/default-avatar.png"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const user = await ctx.db.user.create({
          data: {
            name: input.name,
            avatar: input.avatar,
          },
        });

        return user;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "创建用户失败",
          cause: error,
        });
      }
    }),

  // 更新用户
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "用户名不能为空").optional(),
        avatar: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { id, ...data } = input;

        const user = await ctx.db.user.findUnique({
          where: { id },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "用户不存在",
          });
        }

        const updatedUser = await ctx.db.user.update({
          where: { id },
          data,
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        });

        return updatedUser;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "更新用户信息失败",
          cause: error,
        });
      }
    }),
}); 