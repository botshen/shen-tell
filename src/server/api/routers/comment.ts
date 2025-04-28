import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const commentRouter = createTRPCRouter({
  // 获取消息的所有评论
  getByMessageId: publicProcedure
    .input(z.object({ messageId: z.number() }))
    .query(async ({ ctx, input }) => {
      try {
        const comments = await ctx.db.comment.findMany({
          where: { messageId: input.messageId },
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
        });

        return comments;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "获取评论失败",
          cause: error,
        });
      }
    }),

  // 创建评论
  create: publicProcedure
    .input(
      z.object({
        content: z.string().min(1, "评论内容不能为空"),
        authorId: z.string(),
        messageId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // 检查消息是否存在
        const message = await ctx.db.message.findUnique({
          where: { id: input.messageId },
        });

        if (!message) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "要评论的留言不存在",
          });
        }

        // 检查用户是否存在
        const user = await ctx.db.user.findUnique({
          where: { id: input.authorId },
        });

        if (!user) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "用户不存在",
          });
        }

        const comment = await ctx.db.comment.create({
          data: {
            content: input.content,
            authorId: input.authorId,
            messageId: input.messageId,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        });

        return comment;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "创建评论失败",
          cause: error,
        });
      }
    }),

  // 更新评论
  update: publicProcedure
    .input(
      z.object({
        id: z.number(),
        content: z.string().min(1, "评论内容不能为空"),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.db.comment.findUnique({
          where: { id: input.id },
        });

        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "评论不存在",
          });
        }

        if (comment.authorId !== input.authorId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "无权修改他人评论",
          });
        }

        const updatedComment = await ctx.db.comment.update({
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
          },
        });

        return updatedComment;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "更新评论失败",
          cause: error,
        });
      }
    }),

  // 删除评论
  delete: publicProcedure
    .input(
      z.object({
        id: z.number(),
        authorId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const comment = await ctx.db.comment.findUnique({
          where: { id: input.id },
        });

        if (!comment) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "评论不存在",
          });
        }

        if (comment.authorId !== input.authorId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "无权删除他人评论",
          });
        }

        await ctx.db.comment.delete({
          where: { id: input.id },
        });

        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "删除评论失败",
          cause: error,
        });
      }
    }),
}); 