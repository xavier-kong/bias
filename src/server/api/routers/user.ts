import { z } from "zod";
import { createTRPCRouter, privateProcedure, publicProcedure } from "~/server/api/trpc";
import { clerkClient } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
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
