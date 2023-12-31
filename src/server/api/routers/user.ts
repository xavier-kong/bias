import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import ratelimit from "../rateLimiter";

export const userRouter = createTRPCRouter({
    addProfileName: privateProcedure
    .input(z.object({ profileName: z.string( )}))
    .mutation(async ({ input, ctx }) => {
        const res = await ctx.prisma.user.findUnique({ where: { profileName: input.profileName }});

        if (res) {
            if (res.id == ctx.userId) {
                await clerkClient.users.updateUserMetadata(ctx.userId, { publicMetadata: {
                    profileName: input.profileName
                }});

                return;
            } else {
                throw new TRPCError({ message: "This username is already taken. Please try another.", code: "BAD_REQUEST"});
            }
        }

        const clerkRes = await clerkClient.users.updateUserMetadata(ctx.userId, { publicMetadata: {
            profileName: input.profileName
        }});

        const add = await ctx.prisma.user.create({ data: { id: ctx.userId, profileName: input.profileName}});

        if (!add || !clerkRes) {
            throw new TRPCError({ message: "An error has ocurred. Please try submitting again.", code: "INTERNAL_SERVER_ERROR"});
        }
    }),
    fetchUserBiasesByName: publicProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
        const name = input.name;
        const user = await ctx.prisma.user.findUnique({
            where: {
                profileName: name
            }
        });

        if (!user?.id) {
            throw new TRPCError({ message: "user not found" , code: "NOT_FOUND" });
        }

        const userId = user.id;

        const userBiases = await ctx.prisma.bias.findMany({
            where: {
                userId
            },
            include: {
                member: {
                    include: {
                        group: true
                    }
                }
            }
        });

        return {
            userBiases
        };
    }),

    fetchUserBiases: privateProcedure
    .query(async ({ ctx }) => {
        const userBiases = await ctx.prisma.bias.findMany({ 
            where: { 
                userId: ctx.userId 
            },
            include: {
                member: {
                    include: {
                        group: true
                    }
                }
            }
        });

        return {
            userBiases
        };
    }),
    addUserBias: privateProcedure
    .input(z.object({ memberId: z.number( )}))
    .mutation(async ({ input, ctx }) => {
        const { success } = await ratelimit.limit(ctx.userId);

        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

        await ctx.prisma.bias.create({
            data: {
                userId: ctx.userId,
                memberId: input.memberId
            }
        });
    }),
    updateUserBias: privateProcedure
    .input(z.object({ biasId: z.number( ), memberId: z.number( ) }))
    .mutation(async ({ input, ctx }) => {
        const { success } = await ratelimit.limit(ctx.userId);

        if (!success) throw new TRPCError({ code: "TOO_MANY_REQUESTS"});

        await ctx.prisma.bias.update({
            where: {
                id: input.biasId
            },
            data: {
                memberId: input.memberId
            }
        });
    })
});
