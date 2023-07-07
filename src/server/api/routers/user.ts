import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
    hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
        return {
            greeting: `Hello ${input.text}`,
        };
    }),
    addProfileName: privateProcedure
    .input(z.object({ profileName: z.string( )}))
    .query(async ({ input, ctx }) => {
        const res = await ctx.prisma.user.findUnique({ where: { profileName: input.profileName }});

        if (res) {
            return {
                code: "exists"
            }
        }

        const add = await ctx.prisma.user.create({ data: { id: ctx.userId, profileName: input.profileName}});

        if (!add) {
            return {
                code: "failure'"
            }
        }

        return {
            code: "success"
        }
    })
});
