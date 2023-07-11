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
    .mutation(async ({ input, ctx }) => {
        const res = await ctx.prisma.user.findUnique({ where: { profileName: input.profileName }});

        if (res) {
            throw new TRPCError({ message: "This username is already taken. Please try another.", code: "BAD_REQUEST"});
        }

        const clerkRes = await clerkClient.users.updateUserMetadata(ctx.userId, { publicMetadata: {
            profileName: input.profileName
        }});

        const add = await ctx.prisma.user.create({ data: { id: ctx.userId, profileName: input.profileName}});

        if (!add || !clerkRes) {
            throw new TRPCError({ message: "An error has ocurred. Please try submitting again.", code: "INTERNAL_SERVER_ERROR"});
        }
    })
});
