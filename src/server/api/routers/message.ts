import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
  // 获取所有留言
  getAll: publicProcedure
    .query(async ({ ctx }) => {
      try {
        const messages = await ctx.db.message.findMany({
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        });

        return messages;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取留言失败",
          cause: error,
        });
      }
    }),

  // 获取单个留言
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const message = await ctx.db.message.findUnique({
          where: { id: input.id },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
              orderBy: {
                createdAt: "asc",
              },
            },
          },
        });

        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "留言不存在",
          });
        }

        return message;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取留言失败",
          cause: error,
        });
      }
    }),

  // 创建留言
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1, "留言内容不能为空"),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        console.log('===========================')

        console.log('input', input)
        console.log('===========================')
        const user = await ctx.db.user.findUnique({
          where: { id: input.authorId },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "用户不存在",
          });
        }

        const message = await ctx.db.message.create({
          data: {
            content: input.content,
            authorId: input.authorId,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            comments: true,
          },
        });

        return message;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "创建留言失败",
          cause: error,
        });
      }
    }),

  // 更新留言
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1, "留言内容不能为空"),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const message = await ctx.db.message.findUnique({
          where: { id: input.id },
          include: { author: true },
        });

        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "留言不存在",
          });
        }

        if (message.authorId !== input.authorId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "无权修改他人留言",
          });
        }

        const updatedMessage = await ctx.db.message.update({
          where: { id: input.id },
          data: {
            content: input.content,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            comments: {
              include: {
                author: {
                  select: {
                    id: true,
                    name: true,
                    avatar: true,
                  },
                },
              },
            },
          },
        });

        return updatedMessage;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "更新留言失败",
          cause: error,
        });
      }
    }),

  // 删除留言
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const message = await ctx.db.message.findUnique({
          where: { id: input.id },
        });

        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "留言不存在",
          });
        }

        if (message.authorId !== input.authorId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "无权删除他人留言",
          });
        }

        await ctx.db.message.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "删除留言失败",
          cause: error,
        });
      }
    }),
}); 